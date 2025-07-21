import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Lembrete from '../interfaces/lembrete';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import LembreteResponse from '../interfaces/lembrete.response';
import { LembreteParametros } from '../interfaces/lembrete-parametros';

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
            map((response: LembreteResponse) => this.mapearResponse(response)),
        );
    }

    obterLembretes(parametros?: LembreteParametros): Observable<Lembrete[]> {
        const params = this.criarHttpParams({
            name: parametros?.nome?.trim(),
            color: parametros?.cor,
            categoryId: Number(parametros?.idCategoria),
        });

        return this.http.get<LembreteResponse[]>(this.url, { params }).pipe(
            catchError((e) =>
                throwError(() => new Error(e.error.message || e.message)),
            ),
            retry({ count: 2, delay: 1000 }),
            map((response: LembreteResponse[]) => {
                const lembretes: Lembrete[] = response.map(
                    (lembrete: LembreteResponse) =>
                        this.mapearResponse(lembrete),
                );

                return lembretes;
            }),
        );
    }

    obterLembretePorId(id: number): Observable<Lembrete> {
        return this.http.get<LembreteResponse>(`${this.url}/${id}`).pipe(
            catchError((e) =>
                throwError(() => new Error(e.error.message || e.message)),
            ),
            retry({ count: 2, delay: 1000 }),
            map((response: LembreteResponse) => this.mapearResponse(response)),
        );
    }

    atualizarLembrete(lembrete: Lembrete): Observable<Lembrete> {
        const request = this.criarRequest(lembrete);

        return this.http
            .put<LembreteResponse>(`${this.url}/${lembrete.id}`, request)
            .pipe(
                catchError((e) =>
                    throwError(() => new Error(e.error.message || e.message)),
                ),
                map((response: LembreteResponse) =>
                    this.mapearResponse(response),
                ),
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

    private criarHttpParams(query: { [key: string]: any }): HttpParams {
        let params = new HttpParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, value.toString());
            }
        });

        return params;
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

    private mapearResponse(response: LembreteResponse): Lembrete {
        return {
            id: response.id,
            nome: response.name,
            cor: response.color,
            idCategoria: response.category?.id,
            descricao: response.description,
            agendadoPara: response.scheduledAt,
        };
    }
}
