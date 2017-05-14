import { ILeanEngineDecoder } from '@internal/ILeanEngineDecoder';
import { IAVDecoder } from '@internal/IAVDecoder';
import { IAVObjectDecoder } from '@internal/IAVObjectDecoder';
import { IObjectState } from '@internal/IObjectState';

export class LeanEngineDecoder implements ILeanEngineDecoder {

    protected _AVDecoder: IAVDecoder;
    protected _AVObjectDecoder: IAVObjectDecoder;

    constructor(AVDecoder: IAVDecoder, AVObjectDecoder: IAVObjectDecoder) {
        this._AVDecoder = AVDecoder;
        this._AVObjectDecoder = AVObjectDecoder;
    }
    
    decodeAVObject(serverResponse: { [key: string]: any }): IObjectState {
        return this._AVObjectDecoder.decode(serverResponse, this._AVDecoder);
    }

    decodeDictionary(serverResponse: { [key: string]: any }): { [key: string]: any } {
        return this._AVDecoder.decode(serverResponse);
    }
}