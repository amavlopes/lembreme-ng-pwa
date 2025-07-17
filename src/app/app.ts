import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './core/header/header.component';
import { MenuComponent } from './core/menu/menu.component';
import { ItemMenu } from './core/menu/interfaces/item-menu';

@Component({
    selector: 'lm-root',
    imports: [RouterOutlet, HeaderComponent, MenuComponent],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected readonly title = signal('lembreme-ng-pwa');
    itens: ItemMenu[] | undefined;

    ngOnInit() {
        this.itens = [
            {
                icone: 'pi-bookmark',
                titulo: 'Lembretes',
                rota: '',
            },
            {
                icone: 'pi-tags',
                titulo: 'Categorias',
                rota: '',
            },
            {
                icone: 'pi-id-card',
                titulo: 'Perfil',
                descricao: 'Acesse os dados cadastrais',
                rota: '',
            },
            {
                icone: 'pi-cog',
                titulo: 'Configurações',
                descricao: 'Preferências do app',
                rota: '',
            },
            {
                icone: 'pi-sign-out',
                titulo: 'Sair',
                rota: '',
            },
        ];
    }
}
