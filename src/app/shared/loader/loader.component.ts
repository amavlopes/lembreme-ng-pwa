import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'lm-loader',
    imports: [CommonModule],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.css',
})
export class LoaderComponent {
    @Input({ required: true }) id!: string;
    @Input() titulo!: string;
    @Input() descricao!: string;
}
