import { ILeanEngineDecoder } from './ILeanEngineDecoder';
import { IAVDecoder } from '../../encoding/IAVDecoder';
import { IAVObjectDecoder } from '../../encoding/IAVObjectDecoder';
import { iobjectstate } from '../../object/state/iobjectstate';

export class LeanEngineDecoder implements ILeanEngineDecoder {

    protected _AVDecoder: IAVDecoder;
    protected _AVObjectDecoder: IAVObjectDecoder;

    constructor(AVDecoder: IAVDecoder, AVObjectDecoder: IAVObjectDecoder) {
        this._AVDecoder = AVDecoder;
        this._AVObjectDecoder = AVObjectDecoder;
    }

    decodeAVObject(serverResponse: { [key: string]: any }): iobjectstate {
        return this._AVObjectDecoder.decode(serverResponse, this._AVDecoder);
    }

    decodeDictionary(serverResponse: { [key: string]: any }): { [key: string]: any } {
        return this._AVDecoder.decode(serverResponse);
    }
}