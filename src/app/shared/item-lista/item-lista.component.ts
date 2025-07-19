import { Component, Input } from '@angular/core';

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

    editar(): void {}

    excluir(): void {}
}
