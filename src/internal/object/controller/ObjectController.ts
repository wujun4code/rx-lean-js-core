import { iObjectState } from '../state/iObjectState';
import { iObjectController } from './iObjectController';
import { AVEncoder } from '../../encoding/AVEncoder';
import { SDKPlugins } from '../../SDKPlugins';
import { Observable } from 'rxjs';
import { HttpRequest } from '../../httpClient/HttpRequest';
import { RxAVClient } from '../../../public/RxAVClient';

export class ObjectController implements iObjectController {
    save(state: iObjectState, dictionary: { [key: string]: any }, sessionToken: string): Observable<iObjectState> {
        let request: HttpRequest = new HttpRequest();
        request.method = 'POST';

        let encodeData = AVEncoder.encode(dictionary);
        request.data = encodeData;
        request.url = RxAVClient.serverUrl() + "/classes/" + state.className;
        request.headers = RxAVClient.headers();


        return SDKPlugins.instance.HttpClient.execute(request).map(tuple => {
            console.log('tuple', tuple);
            if (tuple[0] == 201) {
                if (tuple[1].createdAt) {
                    state.createdAt = tuple[1].createdAt;
                    state.updatedAt = tuple[1].createdAt;
                }
                if (tuple[1].updatedAt) {
                    state.updatedAt = tuple[1].updatedAt;
                }
                if (tuple[1].objectId) {
                    state.objectId = tuple[1].objectId;
                }
                state.isNew = false;
                return state;
            }
        });
    }
}