import { IObjectState } from '../../object/state/IObjectState';
import { RxAVQuery } from '../../../RxLeancloud';
import { Observable } from '@reactivex/rxjs';

export /**
 * IQueryController
 */
    interface IQueryController {
    find(query: RxAVQuery, sesstionToken: string): Observable<Array<IObjectState>>;
    count(query: RxAVQuery, sesstionToken: string): Observable<number>;
    fitst(query: RxAVQuery, sesstionToken: string): Observable<Array<IObjectState>>;

    //find<T>(): Observable<Array<IObjectState>>;

}