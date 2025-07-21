import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
} from 'rxjs';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import ItemLista from '../../../../shared/item-lista/interfaces/item-lista';
import { LembreteService } from '../../services/lembrete.service';
import Lembrete from '../../interfaces/lembrete';
import { NenhumResultadoComponent } from '../../../../shared/nenhum-resultado/nenhum-resultado.component';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { TituloPaginaComponent } from '../../../../shared/titulo-pagina/titulo-pagina.component';
import { ItemListaComponent } from '../../../../shared/item-lista/item-lista.component';
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { Acao } from '../../../../shared/item-lista/enums/acao.enum';
import { LembreteParametros } from '../../interfaces/lembrete-parametros';

@Component({
    selector: 'lm-lista-lembrete',
    imports: [
        CommonModule,
        NenhumResultadoComponent,
        LoaderComponent,
        TituloPaginaComponent,
        ItemListaComponent,
        DialogComponent,
        ConfirmDialogComponent,
        ButtonModule,
    ],
    providers: [ConfirmationService],
    templateUrl: './lista-lembrete.component.html',
    styleUrl: './lista-lembrete.component.css',
})
export class ListaLembreteComponent implements OnInit {
    private roteador: Router = inject(Router);
    private servicoConfirmacao: ConfirmationService =
        inject(ConfirmationService);
    private servicoLembrete: LembreteService = inject(LembreteService);
    private destroy$ = new Subject<void>();

    estaCarregandoPagina: boolean = true;
    operacaoPendente = false;
    mostrarEstadoInicialVazio: boolean = false;
    mostrarDialog: boolean = false;
    tituloErro!: string;
    mensagemErro = '';
    itens: ItemLista[] = [];

    ngOnInit(): void {
        this.carregarLembretes();
    }

    obterLembretesHttp$(
        parametros?: LembreteParametros,
    ): Observable<ItemLista[]> {
        return this.servicoLembrete.obterLembretes(parametros).pipe(
            map((lembretes: Lembrete[]) => {
                const itens: ItemLista[] = lembretes.map(
                    (lembrete: Lembrete) => ({
                        id: lembrete.id,
                        titulo: lembrete.nome,
                        cor: lembrete.cor,
                        descricao: lembrete.descricao,
                    }),
                );

                return itens;
            }),
            catchError((e) => {
                this.tituloErro = 'Erro ao obter lembretes';
                this.mensagemErro = e.message;
                this.mostrarDialog = true;

                return of([]);
            }),
            takeUntil(this.destroy$),
        );
    }

    carregarLembretes(): void {
        this.obterLembretesHttp$()
            .pipe(finalize(() => (this.estaCarregandoPagina = false)))
            .subscribe((itens: ItemLista[]) => {
                this.itens = itens;
                this.mostrarEstadoInicialVazio = itens.length === 0;
            });
    }

    adicionarLembrete(): void {
        this.roteador.navigate(['/lembretes/cadastro']);
    }

    receberAcao(acao: Acao, item: ItemLista): void {
        if (acao === Acao.EDITAR) {
            this.roteador.navigate(['/lembretes/edicao', item.id]);
        } else if (acao === Acao.EXCLUIR) {
            this.confirmarExclusao(item);
        }
    }

    confirmarExclusao(item: ItemLista) {
        this.servicoConfirmacao.confirm({
            closable: true,
            closeOnEscape: true,
            header: 'Excluir lembrete',
            message: `Tem certeza que deseja excluir <b>${item.titulo}</b>?`,
            accept: () => {
                this.excluirLembrete(+item.id);
            },
            reject: () => {},
        });
    }

    excluirLembrete(id: number): void {
        this.servicoLembrete
            .excluirLembretePorId(id)
            .pipe(
                catchError((e) => {
                    this.tituloErro = 'Erro ao excluir lembrete';
                    this.mensagemErro = e.message;
                    this.mostrarDialog = true;

                    return EMPTY;
                }),
                concatMap(() => this.obterLembretesHttp$()),
                takeUntil(this.destroy$),
            )
            .subscribe((itens: ItemLista[]) => {
                if (!itens.length) this.mostrarEstadoInicialVazio = true;

                this.itens = itens;
            });
    }
}
