import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'lm-dialog',
    imports: [DialogModule],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.css',
})
export class DialogComponent {
    @Input({ required: true }) id!: string;
    @Input({ required: true }) titulo!: string;
    @Input() mostrarDialog!: boolean;
    @Input() largura = '18rem';
    @Output() aoFechar = new EventEmitter<boolean>();

    fechar(): void {
        this.aoFechar.emit();
    }
}
