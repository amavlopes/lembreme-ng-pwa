import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Lembrete from '../interfaces/lembrete';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import LembreteResponse from '../interfaces/lembrete.response';

@Injectable({
    providedIn: 'root',
})
export class LembreteService {
    url: string = 'http://localhost:7000/reminders';

    private http = inject(HttpClient);

    criarLembrete(lembrete: Omit<Lembrete, 'id'>): Observable<Lembrete> {
        const request = this.criarRequest(lembrete);

        return this.http.post<LembreteResponse>(this.url, request).pipe(
            catchError((e) =>
                throwError(() => new Error(e.error.message || e.message)),
            ),
            map((response: LembreteResponse) => ({
                id: response.id,
                nome: response.name,
                cor: response.color,
                idCategoria: response.category?.id,
                descricao: response.description,
                agendadoPara: response.scheduledAt,
            })),
        );
    }

    obterLembretes(nome?: string): Observable<Lembrete[]> {
        nome = nome?.trim();
        const opcoes = nome
            ? { params: new HttpParams().set('name', nome) }
            : {};

        return this.http.get<LembreteResponse[]>(this.url, opcoes).pipe(
            catchError((e) =>
                throwError(() => new Error(e.error.message || e.message)),
            ),
            retry({ count: 2, delay: 1000 }),
            map((response: LembreteResponse[]) => {
                const lembretes = response.map(
                    (response: LembreteResponse) => ({
                        id: response.id,
                        nome: response.name,
                        cor: response.color,
                        idCategoria: response.category?.id,
                        descricao: response.description,
                        agendadoPara: response.scheduledAt,
                    }),
                );

                return lembretes;
            }),
        );
    }

    excluirLembretePorId(id: number): Observable<void> {
        return this.http.delete<Observable<void>>(`${this.url}/${id}`).pipe(
            catchError((e) =>
                throwError(() => new Error(e.error.message || e.message)),
            ),
            map(() => void 0),
        );
    }

    private criarRequest(lembrete: Omit<Lembrete, 'id'>) {
        return {
            name: lembrete.nome,
            color: lembrete.cor,
            categoryId: lembrete.idCategoria,
            description: lembrete.descricao,
            scheduledAt: lembrete.agendadoPara,
        };
    }
}
