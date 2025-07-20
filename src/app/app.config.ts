import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import { LembreMeTheme } from './themes/lembre-me.theme';
import { provideHttpClient } from '@angular/common/http';

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
        }),
    ],
};
