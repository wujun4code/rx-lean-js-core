import { iobjectstate } from '../../object/state/IObjectState';

export interface ILeanEngineDecoder {
    decodeAVObject(serverResponse: { [key: string]: any }): iobjectstate;
    decodeDictionary(serverResponse: { [key: string]: any }): { [key: string]: any };
}