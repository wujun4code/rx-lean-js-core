import { Observable } from 'rxjs';
import { iobjectstate } from '../../object/state/IObjectState';

export /**
 * iUserController
 */
    interface IUserController {
    signUp(state:iobjectstate,dictionary:{ [key: string]: any }): Observable<iobjectstate>;
    logIn(username: string, password: string): Observable<iobjectstate>;
    logInWithParamters(relativeUrl: string, data: { [key: string]: any }): Observable<iobjectstate>;
    getUser(sessionToken:string): Observable<iobjectstate>;
}