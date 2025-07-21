import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { catchError, EMPTY, finalize, Subject, takeUntil } from 'rxjs';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';

import Categoria from '../../categorias/interfaces/categoria';
import { TituloPaginaComponent } from '../../../shared/titulo-pagina/titulo-pagina.component';
import { CategoriaService } from '../../categorias/services/categoria.service';
import { LembreteService } from '../services/lembrete.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import Lembrete from '../interfaces/lembrete';

@Component({
    selector: 'lm-cadastro-lembrete',
    imports: [
        CommonModule,
        TituloPaginaComponent,
        InputTextModule,
        ButtonModule,
        SelectModule,
        TextareaModule,
        DatePickerModule,
        ReactiveFormsModule,
    ],
    templateUrl: './cadastro-lembrete.component.html',
    styleUrl: './cadastro-lembrete.component.css',
})
export class CadastroLembreteComponent implements OnInit, OnDestroy {
    private location = inject(Location);
    private fb = inject(FormBuilder);
    private servicoCategoria: CategoriaService = inject(CategoriaService);
    private servicoLembrete: LembreteService = inject(LembreteService);
    private servicoMensagem: MessageService = inject(MessageService);
    private roteador = inject(Router);
    private destroy$ = new Subject<void>();

    cores: string[] = [
        '#F6F5FF',
        '#F7FFEB',
        '#FFEDDE',
        '#E8FAFF',
        '#FFEFFD',
        '#FFF9E5',
    ];
    corPadrao = '#F6F5FF';
    carregando = false;
    operacaoPendente = false;
    mostrarDialog = false;
    tituloErro = 'Erro ao cadastrar categorias';
    mensagemErro = '';
    categorias: Categoria[] = [];
    formulario: FormGroup = this.fb.group({
        id: this.fb.control(''),
        nome: this.fb.control('', [Validators.required]),
        cor: this.fb.control(''),
        idCategoria: this.fb.control(''),
        descricao: this.fb.control(''),
        agendadoPara: this.fb.control(''),
    });

    constructor() {}

    get id(): FormControl {
        return this.formulario.get('id') as FormControl;
    }

    get nome(): FormControl {
        return this.formulario.get('nome') as FormControl;
    }

    get cor(): FormControl {
        return this.formulario.get('cor') as FormControl;
    }

    get idCategoria(): FormControl {
        return this.formulario.get('idCategoria') as FormControl;
    }

    get descricao(): FormControl {
        return this.formulario.get('descricao') as FormControl;
    }

    get agendadoPara(): FormControl {
        return this.formulario.get('agendadoPara') as FormControl;
    }

    ngOnInit(): void {
        this.aplicarCor(this.corPadrao);
        this.carregarCategorias();
    }

    ngOnDestroy(): void {
        document.body.style.backgroundColor = '';
    }

    voltarPagina(): void {
        this.location.back();
    }

    carregarCategorias(): void {
        this.servicoCategoria
            .obterCategorias()
            .pipe(
                finalize(() => (this.carregando = false)),
                catchError((e: Error) => {
                    this.mensagemErro = e.message;
                    this.mostrarDialog = true;

                    return EMPTY;
                }),
            )
            .subscribe((categorias: Categoria[]) => {
                this.categorias = categorias;
            });
    }

    aplicarCor(hexadecimal: string): void {
        this.cor.setValue(hexadecimal);
        document.body.style.backgroundColor = hexadecimal;
    }

    limparFormulario(): void {
        this.formulario.reset();
        this.aplicarCor(this.corPadrao);
    }

    salvarLembrete(): void {
        this.formulario.markAllAsTouched();

        if (this.formulario.invalid || this.operacaoPendente) return;

        this.operacaoPendente = true;

        this.servicoLembrete
            .criarLembrete(this.formulario.value)
            .pipe(
                takeUntil(this.destroy$),
                catchError((e) => {
                    this.mensagemErro = e.message;
                    this.mostrarDialog = true;

                    return EMPTY;
                }),
                finalize(() => {
                    this.operacaoPendente = false;
                }),
            )
            .subscribe((_) => {
                this.servicoMensagem.add({
                    severity: 'success',
                    summary: `Lembrete cadastrado com sucesso`,
                });

                //this.roteador.navigate(['/lembretes']);
            });
    }
}
