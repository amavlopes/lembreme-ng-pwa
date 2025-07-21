import {
    ApplicationConfig,
    LOCALE_ID,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import { LembreMeTheme } from './themes/lembre-me.theme';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideAnimationsAsync(),
        provideRouter(routes),
        provideHttpClient(),
        providePrimeNG({
            theme: {
                preset: LembreMeTheme,
                options: {
                    darkModeSelector: false,
                },
            },
            translation: {
                dayNames: [
                    'Domingo',
                    'Segunda-feira',
                    'Terça-feira',
                    'Quarta-feira',
                    'Quinta-feira',
                    'Sexta-feira',
                    'Sábado',
                ],
                dayNamesShort: [
                    'Dom',
                    'Seg',
                    'Ter',
                    'Qua',
                    'Qui',
                    'Sex',
                    'Sáb',
                ],
                dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
                monthNames: [
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro',
                ],
                monthNamesShort: [
                    'Jan',
                    'Fev',
                    'Mar',
                    'Abr',
                    'Mai',
                    'Jun',
                    'Jul',
                    'Ago',
                    'Set',
                    'Out',
                    'Nov',
                    'Dez',
                ],
                today: 'Hoje',
                clear: 'Limpar',
            },
        }),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        MessageService,
    ],
};
