import { IObjectState } from '@internal/IObjectState';
import { IAVDecoder } from '@internal/IAVDecoder';

export interface IAVObjectDecoder {
    decode(serverResult: any, decoder: IAVDecoder): IObjectState;
}