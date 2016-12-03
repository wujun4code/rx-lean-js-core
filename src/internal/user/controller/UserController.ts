import { HttpResponse } from '../../httpClient/HttpResponse';
import { AVCommand } from '../../command/AVCommand';
import { RxAVClient } from '../../../public/RxAVClient';
import { Observable } from 'rxjs';
import { iobjectstate } from '../../object/state/iobjectstate';
import { IUserController } from './iUserController';
import { SDKPlugins } from '../../SDKPlugins';
import { IAVCommandRunner } from '../../command/IAVCommandRunner';

export /**
 * UserController
 */
    class UserController implements IUserController {

    private readonly _commandRunner: IAVCommandRunner;
    constructor(commandRunner: IAVCommandRunner) {
        this._commandRunner = commandRunner;
    }
    signUp(state: iobjectstate, dictionary: { [key: string]: any }): Observable<iobjectstate> {
        let encoded = SDKPlugins.instance.Encoder.encode(dictionary);
        let cmd = new AVCommand({
            relativeUrl: "/users",
            method: 'POST',
            data: encoded
        });
        return this._commandRunner.runRxCommand(cmd).map(res => {
            let serverState = SDKPlugins.instance.ObjectDecoder.decode(res.body, SDKPlugins.instance.Decoder);
            serverState = serverState.mutatedClone((s: iobjectstate) => {
                s.isNew = true;
            });
            return serverState;
        });
    }
    logIn(username: string, password: string): Observable<iobjectstate> {
        return null;
    }
    logInWithParamters(relativeUrl: string, data: { [key: string]: any }): Observable<iobjectstate> {
        return null;
    }
    getUser(sessionToken: string): Observable<iobjectstate> {
        return null;
    }
}