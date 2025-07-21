import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ItemMenu } from './interfaces/item-menu';

@Component({
    selector: 'lm-menu',
    imports: [CommonModule, RouterModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css',
})
export class MenuComponent {
    @Input({ required: true }) itens: ItemMenu[] | undefined;
}
