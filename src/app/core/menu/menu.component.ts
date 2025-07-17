import { Component, Input } from '@angular/core';
import { ItemMenu } from './interfaces/item-menu';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'lm-menu',
    imports: [CommonModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css',
})
export class MenuComponent {
    @Input({ required: true }) itens: ItemMenu[] | undefined;
}
