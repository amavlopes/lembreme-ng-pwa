import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

import { catchError, EMPTY, finalize, Subject, takeUntil } from 'rxjs';

import { MessageService } from 'primeng/api';

import { listaCores } from '../../../const/cores.const';
import Categoria from '../../categorias/interfaces/categoria';
import { TituloPaginaComponent } from '../../../shared/titulo-pagina/titulo-pagina.component';
import { LembreteService } from '../services/lembrete.service';
import { DialogComponent } from '../../../shared/dialogs/dialog/dialog.component';
import Lembrete from '../interfaces/lembrete';
import { FormularioComponent } from '../components/formulario/formulario.component';

@Component({
    selector: 'lm-cadastro-lembrete',
    imports: [
        CommonModule,
        TituloPaginaComponent,
        DialogComponent,
        FormularioComponent,
    ],
    templateUrl: './cadastro-lembrete.component.html',
    styleUrl: './cadastro-lembrete.component.css',
})
export class CadastroLembreteComponent implements OnDestroy {
    private location = inject(Location);
    private servicoLembrete: LembreteService = inject(LembreteService);
    private servicoMensagem: MessageService = inject(MessageService);
    private roteador = inject(Router);
    private destroy$ = new Subject<void>();

    cores = listaCores;
    corPadrao = listaCores[0];
    operacaoPendente = false;
    mostrarDialog = false;
    tituloErro = 'Erro ao cadastrar lembrete';
    mensagemErro = '';
    categorias: Categoria[] = [];

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    voltarPagina(): void {
        this.location.back();
    }

    aoClicarSalvar(lembrete: Lembrete): void {
        if (this.operacaoPendente) return;

        this.operacaoPendente = true;

        const { id, ...novoLembrete } = lembrete;

        this.servicoLembrete
            .criarLembrete(novoLembrete)
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => (this.operacaoPendente = false)),
                catchError((e: Error) => {
                    this.mensagemErro = e.message;
                    this.mostrarDialog = true;

                    return EMPTY;
                }),
            )
            .subscribe((_) => {
                this.servicoMensagem.add({
                    severity: 'success',
                    summary: `Lembrete cadastrado com sucesso`,
                });

                this.roteador.navigate(['/lembretes']);
            });
    }
}
