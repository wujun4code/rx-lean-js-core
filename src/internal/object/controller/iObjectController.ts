import { iobjectstate } from '../state/iobjectstate';
import { Observable } from 'rxjs';

export interface iObjectController {
    save(state: iobjectstate, dictionary:{ [key: string]: any },sessionToken: string): Observable<iobjectstate>;
}