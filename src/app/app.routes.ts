import { ListaCategoriaComponent } from './pages/categorias/lista-categoria/lista-categoria.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/categorias',
        pathMatch: 'full',
    },
    {
        path: 'categorias',
        children: [
            {
                path: '',
                redirectTo: 'lista',
                pathMatch: 'full',
            },
            {
                path: 'lista',
                title: 'Lembre.me - Categorias',
                loadComponent: () =>
                    import(
                        './pages/categorias/lista-categoria/lista-categoria.component'
                    ).then((m) => m.ListaCategoriaComponent),
            },
        ],
    },
    {
        path: 'lembretes',
        children: [
            {
                path: '',
                redirectTo: 'cadastro',
                pathMatch: 'full',
            },
            {
                path: 'cadastro',
                title: 'Lembre.me - Adicionar Lembrete',
                loadComponent: () =>
                    import(
                        './pages/lembretes/cadastro-lembrete/cadastro-lembrete.component'
                    ).then((m) => m.CadastroLembreteComponent),
            },
        ],
    },
];
