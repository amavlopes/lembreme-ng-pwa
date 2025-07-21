import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/lembretes',
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
                        './sections/categorias/pages/lista-categoria/lista-categoria.component'
                    ).then((m) => m.ListaCategoriaComponent),
            },
        ],
    },
    {
        path: 'lembretes',
        children: [
            {
                path: '',
                redirectTo: 'lista',
                pathMatch: 'full',
            },
            {
                path: 'lista',
                title: 'Lembre.me - Lembretes',
                loadComponent: () =>
                    import(
                        './sections/lembretes/pages/lista-lembrete/lista-lembrete.component'
                    ).then((m) => m.ListaLembreteComponent),
            },
            {
                path: 'cadastro',
                title: 'Lembre.me - Adicionar Lembrete',
                loadComponent: () =>
                    import(
                        './sections/lembretes/pages/cadastro-lembrete/cadastro-lembrete.component'
                    ).then((m) => m.CadastroLembreteComponent),
            },
            {
                path: 'edicao/:lembreteId',
                title: 'Lembre.me - Editar Lembrete',
                loadComponent: () =>
                    import(
                        './sections/lembretes/pages/edicao-lembrete/edicao-lembrete.component'
                    ).then((m) => m.EdicaoLembreteComponent),
            },
        ],
    },
];
