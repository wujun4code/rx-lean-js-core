import { Observable, Observer, Subject } from 'rxjs';
import { HttpRequest } from '@internal/HttpRequest';
import { HttpResponse } from '@internal/HttpResponse';
import { IRxHttpClient } from '@internal/iRxHttpClient';
import { IRxWebSocketClient } from '@internal/IRxWebSocketClient';
import { AVCommand } from '@internal/AVCommand';
import { AVCommandResponse } from '@internal/AVCommandResponse';
import { IWebSocketClient } from '@internal/IWebSocketClient';

export interface IRxWebSocketController {
    websocketClient: IWebSocketClient;
    onMessage: Observable<any>;
    onState: Observable<any>;
    open(url: string, protocols?: string | string[]): Observable<boolean>;
    execute(avCommand: AVCommand): Observable<AVCommandResponse>;
}