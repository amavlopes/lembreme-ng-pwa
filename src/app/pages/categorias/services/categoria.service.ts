import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import CategoriaI from '../interfaces/categoria';
import CategoriaResponseI from '../interfaces/response/categoria,response';

@Injectable({
    providedIn: 'root',
})
export class CategoriaService {
    url: string = 'http://localhost:7000/categories';

    private http = inject(HttpClient);

    criarCategoria(categoria: Omit<CategoriaI, 'id'>): Observable<CategoriaI> {
        const request = { name: categoria.nome };

        return this.http.post<CategoriaResponseI>(this.url, request).pipe(
            catchError((e) =>
                throwError(() => new Error(e.error.message || e.message)),
            ),
            map((response: CategoriaResponseI) => ({
                id: response.id,
                nome: response.name,
            })),
        );
    }

    obterCategorias(nome?: string): Observable<CategoriaI[]> {
        nome = nome?.trim();
        const opcoes = nome
            ? { params: new HttpParams().set('name', nome) }
            : {};

        return this.http.get<CategoriaResponseI[]>(this.url, opcoes).pipe(
            catchError((e) =>
                throwError(() => new Error(e.error.message || e.message)),
            ),
            retry({ count: 2, delay: 1000 }),
            map((response: CategoriaResponseI[]) => {
                const categorias = response.map(
                    (categoria: CategoriaResponseI) => ({
                        id: categoria.id,
                        nome: categoria.name,
                    }),
                );

                return categorias;
            }),
        );
    }

    atualizarCategoria(curso: CategoriaI): Observable<CategoriaI> {
        const request = { name: curso.nome };

        return this.http
            .put<CategoriaResponseI>(`${this.url}/${curso.id}`, request)
            .pipe(
                catchError((e) =>
                    throwError(() => new Error(e.error.message || e.message)),
                ),
                map((response: CategoriaResponseI) => ({
                    id: response.id,
                    nome: response.name,
                })),
            );
    }

    excluirCategoriaPorId(id: number): Observable<void> {
        return this.http.delete<Observable<void>>(`${this.url}/${id}`).pipe(
            catchError((e) =>
                throwError(() => new Error(e.error.message || e.message)),
            ),
            map(() => void 0),
        );
    }
}
