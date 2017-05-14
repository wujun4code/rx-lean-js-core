import { Observable } from 'rxjs';
import { AVCommand } from '@internal/AVCommand';
import { AVCommandResponse } from '@internal/AVCommandResponse';
import { HttpResponse } from '@internal/HttpResponse';
import { IAVCommandRunner } from '@internal/IAVCommandRunner';
import { IRxHttpClient } from '@internal/iRxHttpClient';

export class AVCommandRunner implements IAVCommandRunner {

    private _iRxHttpClient: IRxHttpClient;

    constructor(rxHttpClient: IRxHttpClient) {
        this._iRxHttpClient = rxHttpClient;
    }

    runRxCommand(command: AVCommand): Observable<AVCommandResponse> {
        return this._iRxHttpClient.execute(command).map(res => {
            return new AVCommandResponse(res);
        }).catch((errorRes) => {
            return Observable.throw(errorRes);
        });
    }
}