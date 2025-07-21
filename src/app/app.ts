import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './core/header/header.component';
import { MenuComponent } from './core/menu/menu.component';
import { ItemMenu } from './core/menu/interfaces/item-menu';
import { ToastComponent } from './core/toast/toast.component';

@Component({
    selector: 'lm-root',
    imports: [RouterOutlet, HeaderComponent, MenuComponent, ToastComponent],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected readonly title = signal('lembreme-ng-pwa');

    corSelecionada!: string;
    itens: ItemMenu[] | undefined;

    ngOnInit() {
        this.itens = [
            {
                icone: 'fa-tags',
                titulo: 'Categorias',
                rota: '/categorias',
            },
            {
                icone: 'fa-thumbtack',
                titulo: 'Lembretes',
                rota: '/lembretes',
            },
            {
                icone: 'fa-id-badge',
                titulo: 'Perfil',
                descricao: 'Acesse os dados cadastrais',
                rota: '',
            },
            {
                icone: 'fa-gear',
                titulo: 'Configurações',
                descricao: 'Preferências do app',
                rota: '',
            },
            {
                icone: 'fa-arrow-right-from-bracket',
                titulo: 'Sair',
                rota: '',
            },
        ];
    }
}
