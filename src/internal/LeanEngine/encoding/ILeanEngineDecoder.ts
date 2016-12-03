import { iobjectstate } from '../../object/state/iobjectstate';

export interface ILeanEngineDecoder {
    decodeAVObject(serverResponse: { [key: string]: any }): iobjectstate;
    decodeDictionary(serverResponse: { [key: string]: any }): { [key: string]: any };
}