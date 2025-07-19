import { Component, Input } from '@angular/core';

@Component({
    selector: 'lm-titulo-pagina',
    imports: [],
    templateUrl: './titulo-pagina.component.html',
    styleUrl: './titulo-pagina.component.css',
})
export class TituloPaginaComponent {
    @Input({ required: true }) id!: string;
}
