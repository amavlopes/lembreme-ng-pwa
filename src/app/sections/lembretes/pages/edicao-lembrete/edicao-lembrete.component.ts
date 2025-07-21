import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
    catchError,
    EMPTY,
    finalize,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';

import { MessageService } from 'primeng/api';

import Categoria from '../../../categorias/interfaces/categoria';
import Lembrete from '../../interfaces/lembrete';
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component';
import { TituloPaginaComponent } from '../../../../shared/titulo-pagina/titulo-pagina.component';
import { FormularioComponent } from '../../components/formulario/formulario.component';
import { LembreteService } from '../../services/lembrete.service';
import { LoaderComponent } from '../../../../shared/loader/loader.component';

@Component({
    selector: 'lm-edicao-lembrete',
    imports: [
        CommonModule,
        TituloPaginaComponent,
        DialogComponent,
        LoaderComponent,
        FormularioComponent,
    ],
    templateUrl: './edicao-lembrete.component.html',
    styleUrl: './edicao-lembrete.component.css',
})
export class EdicaoLembreteComponent implements OnInit, OnDestroy {
    private location = inject(Location);
    private servicoLembrete: LembreteService = inject(LembreteService);
    private servicoMensagem: MessageService = inject(MessageService);
    private roteador = inject(Router);
    private rotaAtiva = inject(ActivatedRoute);
    private destroy$ = new Subject<void>();

    lembrete$!: Observable<Lembrete | null>;
    lembreteId!: number;
    estaCarregando = true;
    operacaoPendente = false;
    mostrarDialog = false;
    tituloErro = '';
    mensagemErro = '';
    categorias: Categoria[] = [];

    ngOnInit(): void {
        this.carregarLembrete();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    voltarPagina(): void {
        this.location.back();
    }

    carregarLembrete(): void {
        this.lembrete$ = this.rotaAtiva.paramMap.pipe(
            switchMap((params) => {
                this.lembreteId = Number(params.get('lembreteId'));

                return this.servicoLembrete
                    .obterLembretePorId(this.lembreteId)
                    .pipe(
                        catchError((e) => {
                            this.tituloErro = 'Erro ao carregar lembrete';
                            this.mensagemErro = e.message;
                            this.mostrarDialog = true;

                            return EMPTY;
                        }),
                    );
            }),
            finalize(() => (this.estaCarregando = false)),
            takeUntil(this.destroy$),
        );
    }

    aoClicarSalvar(lembrete: Lembrete): void {
        if (this.operacaoPendente) return;

        this.operacaoPendente = true;

        this.servicoLembrete
            .atualizarLembrete(lembrete)
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => (this.operacaoPendente = false)),
                catchError((e: Error) => {
                    this.tituloErro = 'Erro ao atualizar lembrete';
                    this.mensagemErro = e.message;
                    this.mostrarDialog = true;

                    return EMPTY;
                }),
            )
            .subscribe((_) => {
                this.servicoMensagem.add({
                    severity: 'success',
                    summary: `Lembrete atualizado`,
                });

                this.roteador.navigate(['/lembretes']);
            });
    }
}
