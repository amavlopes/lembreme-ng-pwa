import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import {
    catchError,
    concatMap,
    EMPTY,
    finalize,
    map,
    Observable,
    of,
    Subject,
    takeUntil,
    tap,
} from 'rxjs';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';

import { NenhumResultadoComponent } from '../../../shared/nenhum-resultado/nenhum-resultado.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { TituloPaginaComponent } from '../../../shared/titulo-pagina/titulo-pagina.component';
import { ItemListaComponent } from '../../../shared/item-lista/item-lista.component';
import ItemLista from '../../../shared/item-lista/interfaces/item-lista';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../../shared/dialogs/dialog/dialog.component';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { Acao } from '../../../shared/item-lista/enums/acao.enum';
import { CategoriaService } from '../services/categoria.service';
import Categoria from '../interfaces/categoria';

@Component({
    selector: 'lm-lista-categoria',
    imports: [
        CommonModule,
        InputTextModule,
        ReactiveFormsModule,
        NenhumResultadoComponent,
        LoaderComponent,
        TituloPaginaComponent,
        ItemListaComponent,
        DialogComponent,
        ConfirmDialogComponent,
        ButtonModule,
    ],
    providers: [ConfirmationService],
    templateUrl: './lista-categoria.component.html',
    styleUrl: './lista-categoria.component.css',
})
export class ListaCategoriaComponent implements OnInit {
    private fb = inject(FormBuilder);
    private servicoConfirmacao: ConfirmationService =
        inject(ConfirmationService);
    private servicoCategoria: CategoriaService = inject(CategoriaService);
    private destroy$ = new Subject<void>();

    estaCarregandoPagina: boolean = true;
    mostrarEstadoInicialVazio: boolean = false;
    mostrarDialogErro: boolean = false;
    mostrarDialogCategoria: boolean = false;
    tituloErro!: string;
    tituloCategoria = '';
    mensagemErro = '';
    itens: ItemLista[] = [];
    acaoCategoria: Acao | undefined;
    operacaoPendente = false;
    formulario: FormGroup = this.fb.group({
        id: this.fb.control(''),
        nome: this.fb.control('', [Validators.required]),
    });

    get id(): FormControl {
        return this.formulario.get('id') as FormControl;
    }

    get nome(): FormControl {
        return this.formulario.get('nome') as FormControl;
    }

    ngOnInit(): void {
        this.carregarCategorias();
    }

    adicionarCategoria(): void {
        this.acaoCategoria = Acao.CADASTRAR;
        this.tituloCategoria = 'Adicionar categoria';
        this.mostrarDialogCategoria = true;
    }

    obterCategoriasHttp$(termo: string = ''): Observable<ItemLista[]> {
        return this.servicoCategoria.obterCategorias(termo).pipe(
            map((categorias: Categoria[]) => {
                const itens: ItemLista[] = categorias.map(
                    (categoria: Categoria) => ({
                        id: categoria.id,
                        titulo: categoria.nome,
                    }),
                );

                return itens;
            }),
            catchError((e) => {
                this.mensagemErro = e.message;
                this.mostrarDialogErro = true;

                return of([]);
            }),
            takeUntil(this.destroy$),
        );
    }

    carregarCategorias() {
        this.obterCategoriasHttp$()
            .pipe(finalize(() => (this.estaCarregandoPagina = false)))
            .subscribe((itens: ItemLista[]) => {
                this.itens = itens;
                this.mostrarEstadoInicialVazio = itens.length === 0;
            });
    }

    receberAcao(acao: Acao, item: ItemLista): void {
        if (acao === Acao.EDITAR) {
            this.acaoCategoria = Acao.EDITAR;
            this.tituloCategoria = 'Editar categoria';

            this.id.setValue(item.id);
            this.nome.setValue(item.titulo);

            this.mostrarDialogCategoria = true;
        } else if (acao === Acao.EXCLUIR) {
            this.confirmarExclusao(item);
        }
    }

    confirmarExclusao(item: ItemLista) {
        this.servicoConfirmacao.confirm({
            closable: true,
            closeOnEscape: true,
            header: 'Excluir categoria',
            message: `Tem certeza que deseja excluir <b>${item.titulo}</b>?`,
            accept: () => {
                this.excluirCategoria(+item.id);
            },
            reject: () => {},
        });
    }

    excluirCategoria(id: number): void {
        this.servicoCategoria
            .excluirCategoriaPorId(id)
            .pipe(
                catchError((e) => {
                    this.tituloErro = 'Erro ao excluir categoria';
                    this.mensagemErro = e.message;
                    this.mostrarDialogErro = true;

                    return EMPTY;
                }),
                concatMap(() => this.obterCategoriasHttp$()),
                takeUntil(this.destroy$),
            )
            .subscribe((itens: ItemLista[]) => {
                if (!itens.length) this.mostrarEstadoInicialVazio = true;

                this.itens = itens;
            });
    }

    salvarCategoria(): void {
        this.formulario.markAllAsTouched();

        if (this.formulario.invalid || this.operacaoPendente) return;

        this.operacaoPendente = true;

        const operacao$ =
            this.acaoCategoria === Acao.CADASTRAR
                ? this.servicoCategoria.criarCategoria(this.formulario.value)
                : this.servicoCategoria.atualizarCategoria(
                      this.formulario.value,
                  );

        operacao$
            .pipe(
                takeUntil(this.destroy$),
                catchError((e) => {
                    this.mensagemErro = e.message;
                    return EMPTY;
                }),
                finalize(() => {
                    this.operacaoPendente = false;
                }),
            )
            .subscribe((_) => {
                this.mensagemErro = '';
                this.acaoCategoria = undefined;
                this.mostrarDialogCategoria = false;

                this.carregarCategorias();
            });
    }

    fecharDialogCategoria(): void {
        this.operacaoPendente = false;
        this.mensagemErro = '';
        this.mostrarDialogCategoria = false;
        this.formulario.reset();
    }

    aoDigitar(): void {
        this.mensagemErro = '';
    }
}
