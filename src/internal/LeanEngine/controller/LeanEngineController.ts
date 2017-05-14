import { ILeanEngineController } from '@internal/ILeanEngineController'
import { Observable } from 'rxjs';
import { AVCommand } from '@internal/AVCommand';
import { SDKPlugins } from '@internal/SDKPlugins';
import { ILeanEngineDecoder } from '@internal/ILeanEngineDecoder';

export class LeanEngineController implements ILeanEngineController {
    private _LeanEngineDecoder: ILeanEngineDecoder;

    constructor(LeanEngineDecoder: ILeanEngineDecoder) {
        this._LeanEngineDecoder = LeanEngineDecoder;
    }

    callFunction(name: string,
        parameters?: { [key: string]: any },
        sessionToken?: string): Observable<{ [key: string]: any }> {

        let cmd = new AVCommand({
            relativeUrl: `/functions/${name}`,
            method: 'POST',
            data: parameters,
            sessionToken: sessionToken
        });

        return SDKPlugins.instance.CommandRunner.runRxCommand(cmd).map(res => {
            let result = this._LeanEngineDecoder.decodeDictionary(res.body.result);
            return result;
        });
    }
}