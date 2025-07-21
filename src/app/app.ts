import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ConfirmDialogComponent } from './shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ConfirmationService } from 'primeng/api';
import { UpdateService } from './core/services/update-app.service';
import { HeaderComponent } from './core/components/header/header.component';
import { ItemMenu } from './core/components/menu/interfaces/item-menu';
import { MenuComponent } from './core/components/menu/menu.component';
import { ToastComponent } from './core/components/toast/toast.component';

@Component({
    selector: 'lm-root',
    imports: [
        RouterOutlet,
        HeaderComponent,
        MenuComponent,
        ToastComponent,
        ConfirmDialogComponent,
    ],
    providers: [ConfirmationService],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected readonly title = signal('lembreme-ng-pwa');
    itens: ItemMenu[] = [
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

    constructor(
        private updateService: UpdateService,
        private confirmationService: ConfirmationService,
    ) {
        this.updateService.updateAvailable$.subscribe(() => {
            this.confirmationService.confirm({
                message:
                    'Uma nova versão da aplicação está disponível. Deseja atualizar?',
                acceptLabel: 'Atualizar',
                rejectLabel: 'Mais tarde',
                accept: () => this.updateService.activateUpdate(),
            });
        });
    }
}
