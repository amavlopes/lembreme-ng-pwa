import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UpdateService {
    public updateAvailable$ = new Subject<void>();

    constructor(private swUpdate: SwUpdate) {
        if (this.swUpdate.isEnabled) {
            this.swUpdate.versionUpdates
                .pipe(
                    filter(
                        (evt): evt is VersionReadyEvent =>
                            evt.type === 'VERSION_READY',
                    ),
                )
                .subscribe(() => {
                    this.updateAvailable$.next();
                });
        }
    }

    activateUpdate() {
        document.location.reload();
    }
}
