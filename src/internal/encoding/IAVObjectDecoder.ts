import { iobjectstate } from '../object/state/IObjectState';
import { IAVDecoder } from './IAVDecoder';

export interface IAVObjectDecoder {
    decode(serverResult: any, decoder: IAVDecoder): iobjectstate;
}