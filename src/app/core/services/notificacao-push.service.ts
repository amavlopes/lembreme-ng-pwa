import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificacaoPushService {
    private readonly VAPID_PUBLIC_KEY =
        'BApnBnlYYdBpFZ1RC1iSKG7-tubkJo30W3tbmcYm62fkTLez0cMT80q9Fqz8UHqYraziiR7JzL0RObsmroHwYes';
    currentMessage = new BehaviorSubject<any>(null);

    constructor(private swPush: SwPush) {}

    solicitarPermissaoNotificacoes() {
        this.swPush
            .requestSubscription({
                serverPublicKey: this.VAPID_PUBLIC_KEY,
            })
            .then((subscription) => {
                console.log('Inscrição push:', subscription);

                //
            })
            .catch((err) => {
                console.error('Erro push', err);
            });
    }

    receberNotificacao() {
        this.swPush.messages.subscribe((message) => {
            this.currentMessage.next(message);
        });
    }
}
