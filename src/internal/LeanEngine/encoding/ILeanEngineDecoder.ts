import { IObjectState } from '@internal/IObjectState';

export interface ILeanEngineDecoder {
    decodeAVObject(serverResponse: { [key: string]: any }): IObjectState;
    decodeDictionary(serverResponse: { [key: string]: any }): { [key: string]: any };
}