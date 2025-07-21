import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export default function tratarErro(e: HttpErrorResponse): Observable<never> {
    let mensagem;

    switch (e.status) {
        case 0:
            mensagem = 'Sem conexão com a internet. \n Verifique sua rede.';
            break;

        case 504:
            mensagem =
                'Tempo de conexão excedido. \n Tente novamente mais tarde.';
            break;

        default:
            mensagem = e?.error?.message || e?.message || 'Erro desconhecido';
            break;
    }

    return throwError(() => new Error(mensagem));
}
