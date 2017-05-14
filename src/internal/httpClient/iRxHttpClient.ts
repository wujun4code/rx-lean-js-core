import { Observable } from 'rxjs';
import { HttpRequest } from '@internal/HttpRequest';
import { HttpResponse } from '@internal/HttpResponse';

export interface IRxHttpClient {
    execute(httpRequest: HttpRequest): Observable<HttpResponse>;
}
