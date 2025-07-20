import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AcaoItemLista } from './enums/item-lista,enum';

@Component({
    selector: 'lm-item-lista',
    imports: [],
    templateUrl: './item-lista.component.html',
    styleUrl: './item-lista.component.css',
})
export class ItemListaComponent {
    @Input({ required: true }) id!: string;
    @Input({ required: true }) titulo!: string;
    @Input() descricao: string | undefined;

    @Output() aoClicarAcaoItemLista: EventEmitter<AcaoItemLista> =
        new EventEmitter();

    editar(): void {
        this.aoClicarAcaoItemLista.emit(AcaoItemLista.EDITAR);
    }

    excluir(): void {
        this.aoClicarAcaoItemLista.emit(AcaoItemLista.EXCLUIR);
    }
}
