import { iobjectstate } from '../object/state/iobjectstate';
import { IAVDecoder } from './IAVDecoder';

export interface IAVObjectDecoder {
    decode(serverResult: any, decoder: IAVDecoder): iobjectstate;
}