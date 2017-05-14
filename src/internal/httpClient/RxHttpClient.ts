import { Observable } from 'rxjs';
import { HttpRequest } from '@internal/HttpRequest';
import { HttpResponse } from '@internal/HttpResponse';
import { IRxHttpClient } from '@internal/iRxHttpClient';
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import * as superagent from 'superagent';
import { RxAVClient } from 'RxAVClient';

export class RxHttpClient implements IRxHttpClient {
    version: number;
    constructor(version?: number) {
        this.version = version;
    }

    execute(httpRequest: HttpRequest): Observable<HttpResponse> {
        let tuple: [number, any] = [200, ''];
        let errMsg = {
            statusCode: -1,
            error: { code: 0, error: 'Server error' }
        };
        let response = new HttpResponse(tuple);
        RxAVClient.printLog('Request:', JSON.stringify(httpRequest));
        if (RxAVClient.instance.currentConfiguration.isNode && this.version == 1) {
            RxAVClient.printLog('http client:axios');
            return Observable.fromPromise(this.RxExecuteAxios(httpRequest)).map(res => {

                tuple[0] = res.status;
                tuple[1] = res.data;
                let response = new HttpResponse(tuple);
                RxAVClient.printLog('Response:', JSON.stringify(response));
                return response;
            }).catch((err: any) => {
                RxAVClient.printLog('Meta Error:', err);
                if (err) {
                    errMsg.statusCode = err.response.status;
                    errMsg.error = err.response.data;
                }
                RxAVClient.printLog('Error:', JSON.stringify(errMsg));
                return Observable.throw(errMsg);
            });
        }

        else {
            RxAVClient.printLog('http client:superagent');
            return Observable.fromPromise(this.RxExecuteSuperagent(httpRequest)).map(res => {
                tuple[0] = res.status;
                tuple[1] = res.body;
                let response = new HttpResponse(tuple);
                RxAVClient.printLog('Response:', JSON.stringify(response));
                return response;
            }).catch((err: any) => {
                RxAVClient.printLog('Meta Error:', err);
                if (err) {
                    errMsg.statusCode = err.status;
                    errMsg.error = JSON.parse(err.response.text);
                }
                RxAVClient.printLog('Error:', errMsg);
                return Observable.throw(errMsg);
            });
        }
    }

    batchExecute() {

    }


    RxExecuteAxios(httpRequest: HttpRequest): Promise<AxiosResponse> {
        let method = httpRequest.method.toUpperCase();
        let useData = false;
        if (method == 'PUT' || 'POST') {
            useData = true;
        }
        return new Promise<AxiosResponse>((resovle, reject) => {
            axios({
                method: method,
                url: httpRequest.url,
                data: useData ? httpRequest.data : null,
                headers: httpRequest.headers
            }).then(response => {
                resovle(response);
            }).catch(error => {
                reject(error);
            });
        });

    }
    RxExecuteSuperagent(httpRequest: HttpRequest): Promise<superagent.Response> {
        let method = httpRequest.method.toUpperCase();
        if (method == 'POST')
            return new Promise((resolve, reject) => {
                superagent
                    .post(httpRequest.url)
                    .send(httpRequest.data)
                    .set(httpRequest.headers)
                    .end((error, res) => {
                        error ? reject(error) : resolve(res);
                    });
            });
        else if (method == 'PUT')
            return new Promise((resolve, reject) => {
                superagent
                    .put(httpRequest.url)
                    .send(httpRequest.data)
                    .set(httpRequest.headers)
                    .end((error, res) => {
                        error ? reject(error) : resolve(res);
                    });
            });
        else if (method == 'GET')
            return new Promise((resolve, reject) => {
                superagent
                    .get(httpRequest.url)
                    .set(httpRequest.headers)
                    .end((error, res) => {
                        error ? reject(error) : resolve(res);
                    });
            });
        else if (method == 'DELETE')
            return new Promise((resolve, reject) => {
                superagent
                    .del(httpRequest.url)
                    .set(httpRequest.headers)
                    .end((error, res) => {
                        error ? reject(error) : resolve(res);
                    });
            });
    }
}
