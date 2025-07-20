import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
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
import { AcaoItemLista } from '../../../shared/item-lista/enums/item-lista,enum';

@Component({
    selector: 'lm-lista-categoria',
    imports: [
        CommonModule,
        InputTextModule,
        FloatLabel,
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

    estaCarregandoPagina: boolean = false;
    mostrarEstadoInicialVazio: boolean = false;
    mostrarDialogErro: boolean = false;
    mostrarDialogCategoria: boolean = false;
    tituloErro = 'Erro ao buscar curso';
    tituloCategoria = '';
    mensagemErro = '';
    itens: ItemLista[] = [];

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
        this.itens = [
            {
                id: '1',
                titulo: 'Alimentação',
            },
            {
                id: '2',
                titulo: 'Saúde',
            },
            {
                id: '3',
                titulo: 'Estudos',
            },
        ];
    }

    adicionarCategoria(): void {
        this.tituloCategoria = 'Adicionar categoria';
        this.mostrarDialogCategoria = true;
    }

    receberAcaoItemLista(acao: AcaoItemLista, item: ItemLista): void {
        if (acao === AcaoItemLista.EDITAR) {
            this.tituloCategoria = 'Editar categoria';

            this.id.setValue(item.id);
            this.nome.setValue(item.titulo);

            this.mostrarDialogCategoria = true;
        } else if (acao === AcaoItemLista.EXCLUIR) {
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

    excluirCategoria(id: number): void {}

    fecharDialogCategoria(): void {
        this.mostrarDialogCategoria = false;
        this.formulario.reset();
    }
}
