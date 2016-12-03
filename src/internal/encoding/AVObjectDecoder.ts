import { iobjectstate } from '../object/state/iobjectstate';
import { MutableObjectState } from '../object/state/MutableObjectState';
import { IAVObjectDecoder } from './IAVObjectDecoder';
import { IAVDecoder } from './IAVDecoder';

export /**
 * AVDecoder
 */
    class AVObjectDecoder implements IAVObjectDecoder {
    constructor() {
    }

    decode(serverResult: any, decoder: IAVDecoder): iobjectstate {
        let state = new MutableObjectState();
        this.handlerCreateResult(state, serverResult, decoder);
        return state;
    }

    handlerCreateResult(state: MutableObjectState, createResult: any, decoder: IAVDecoder): iobjectstate {
        if (createResult.createdAt) {
            state.createdAt = createResult.createdAt;
            state.updatedAt = createResult.createdAt;
        }
        if (createResult.updatedAt) {
            state.updatedAt = createResult.updatedAt;
        }
        if (createResult.objectId) {
            state.objectId = createResult.objectId;
        }
        state.serverData = decoder.decode(createResult);
        state.isNew = true;
        return state;
    }
}