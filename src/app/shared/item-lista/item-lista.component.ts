import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Acao } from './enums/acao.enum';
import { listaCores } from '../../const/cores.const';

@Component({
    selector: 'lm-item-lista',
    imports: [],
    templateUrl: './item-lista.component.html',
    styleUrl: './item-lista.component.css',
})
export class ItemListaComponent {
    @Input({ required: true }) id!: number;
    @Input({ required: true }) titulo!: string;
    @Input() descricao: string | undefined;
    @Input() cor: string = listaCores[0];

    @Output() aoClicarAcao: EventEmitter<Acao> = new EventEmitter();

    editar(): void {
        this.aoClicarAcao.emit(Acao.EDITAR);
    }

    excluir(): void {
        this.aoClicarAcao.emit(Acao.EXCLUIR);
    }
}
