import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import Categoria from '../interfaces/categoria';
import CategoriaResponse from '../interfaces/categoria.response';

@Injectable({
    providedIn: 'root',
})
export class CategoriaService {
    url: string = 'http://localhost:7000/categories';

    private http = inject(HttpClient);

    criarCategoria(categoria: Omit<Categoria, 'id'>): Observable<Categoria> {
        const request = { name: categoria.nome };

        return this.http.post<CategoriaResponse>(this.url, request).pipe(
            catchError((e) =>
                throwError(() => new Error(e.error.message || e.message)),
            ),
            map((response: CategoriaResponse) => ({
                id: response.id,
                nome: response.name,
            })),
        );
    }

    obterCategorias(nome?: string): Observable<Categoria[]> {
        nome = nome?.trim();
        const opcoes = nome
            ? { params: new HttpParams().set('name', nome) }
            : {};

        return this.http.get<CategoriaResponse[]>(this.url, opcoes).pipe(
            catchError((e) =>
                throwError(() => new Error(e.error.message || e.message)),
            ),
            retry({ count: 2, delay: 1000 }),
            map((response: CategoriaResponse[]) => {
                const categorias = response.map(
                    (categoria: CategoriaResponse) => ({
                        id: categoria.id,
                        nome: categoria.name,
                    }),
                );

                return categorias;
            }),
        );
    }

    atualizarCategoria(curso: Categoria): Observable<Categoria> {
        const request = { name: curso.nome };

        return this.http
            .put<CategoriaResponse>(`${this.url}/${curso.id}`, request)
            .pipe(
                catchError((e) =>
                    throwError(() => new Error(e.error.message || e.message)),
                ),
                map((response: CategoriaResponse) => ({
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
