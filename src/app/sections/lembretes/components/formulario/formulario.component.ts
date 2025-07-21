import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import {
    catchError,
    debounceTime,
    EMPTY,
    filter,
    finalize,
    Subject,
    takeUntil,
    tap,
} from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import Lembrete from '../../interfaces/lembrete';
import { CategoriaService } from '../../../categorias/services/categoria.service';
import Categoria from '../../../categorias/interfaces/categoria';
import { listaCores } from '../../../../const/cores.const';
import { DialogComponent } from '../../../../shared/dialogs/dialog/dialog.component';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'lm-formulario',
    imports: [
        CommonModule,
        ButtonModule,
        SelectModule,
        InputTextModule,
        TextareaModule,
        DatePickerModule,
        ReactiveFormsModule,
        DialogComponent,
    ],
    templateUrl: './formulario.component.html',
    styleUrl: './formulario.component.css',
})
export class FormularioComponent implements OnInit {
    private fb = inject(FormBuilder);
    private servicoCategoria: CategoriaService = inject(CategoriaService);
    private salvar$ = new Subject<void>();
    private destroy$ = new Subject<void>();

    carregando = false;
    mostrarDialog = false;
    tituloErro = '';
    mensagemErro = '';
    categorias!: Categoria[];
    cores = listaCores;
    corPadrao = listaCores[0];
    formulario: FormGroup = this.fb.group({
        id: this.fb.control(''),
        nome: this.fb.control('', [Validators.required]),
        cor: this.fb.control(''),
        idCategoria: this.fb.control(''),
        descricao: this.fb.control(''),
        agendadoPara: this.fb.control(''),
    });

    @Input({ required: true }) id!: string;
    @Input({ required: true }) operacaoPendente: boolean = false;
    @Input() lembrete!: Lembrete;
    @Output() evtSalvar: EventEmitter<Lembrete> = new EventEmitter();
    @Output() evtLimpar: EventEmitter<void> = new EventEmitter();

    get idLembrete(): FormControl {
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
        this.carregarFormulario();

        this.observarEvtSalvar();
    }

    ngOnDestroy(): void {
        document.body.style.backgroundColor = '';

        this.destroy$.next();
        this.destroy$.complete();
    }

    carregarCategorias() {
        this.servicoCategoria
            .obterCategorias()
            .pipe(
                finalize(() => (this.carregando = false)),
                catchError((e: Error) => {
                    this.tituloErro = 'Erro ao obter categorias';
                    this.mensagemErro = e.message;
                    this.mostrarDialog = true;

                    return EMPTY;
                }),
            )
            .subscribe((categorias: Categoria[]) => {
                this.categorias = categorias;
            });
    }

    carregarFormulario(): void {
        if (!this.lembrete) return;

        this.idLembrete.setValue(this.lembrete.id);
        this.nome.setValue(this.lembrete.nome);
        this.aplicarCor(this.lembrete.cor!);
        this.idCategoria.setValue(this.lembrete.idCategoria);
        this.descricao.setValue(this.lembrete.descricao);
        this.agendadoPara.setValue(new Date(this.lembrete.agendadoPara!));
    }

    observarEvtSalvar(): void {
        this.salvar$
            .pipe(
                debounceTime(500),
                takeUntil(this.destroy$),
                filter(() => !this.operacaoPendente),
                tap(() => this.formulario.markAllAsTouched()),
                filter(() => this.formulario.valid),
            )
            .subscribe(() => {
                const lembrete: Lembrete = {
                    id: Number(this.idLembrete.value),
                    nome: this.nome.value,
                    cor: this.cor.value,
                    idCategoria: Number(this.idCategoria.value),
                    descricao: this.descricao.value,
                    agendadoPara: this.agendadoPara.value,
                };

                this.evtSalvar.emit(lembrete);
            });
    }

    aplicarCor(hexadecimal: string): void {
        this.cor.setValue(hexadecimal);
        document.body.style.backgroundColor = hexadecimal;
    }

    aoClicarSalvar(): void {
        if (this.operacaoPendente) return;

        this.salvar$.next();
    }

    aoClicarLimpar(): void {
        this.formulario.reset();
        this.aplicarCor(this.corPadrao);
        this.evtLimpar.emit();
    }
}
