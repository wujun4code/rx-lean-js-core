import { RxAVObject } from '../RxLeanCloud';
import { IQueryController } from '../internal/query/controller/IQueryController';
import { IAVEncoder } from '../internal/encoding/IAVEncoder';
import { Observable } from '@reactivex/rxjs';
export declare class RxAVQuery {
    constructor(objectClass: string | RxAVObject);
    className: string;
    protected _where: any;
    protected _include: Array<string>;
    protected _select: Array<string>;
    protected _limit: number;
    protected _skip: number;
    protected _order: Array<string>;
    protected _extraOptions: {
        [key: string]: any;
    };
    protected static readonly _encoder: IAVEncoder;
    protected static readonly _queryController: IQueryController;
    config(filter: Array<{
        key: string;
        constraint: string;
        value: any;
    }>, limit: number, skip: number, include: string[], select: string[]): RxAVQuery;
    equalTo(key: string, value: any): RxAVQuery;
    notEqualTo(key: string, value: any): RxAVQuery;
    lessThan(key: string, value: any): RxAVQuery;
    lessThanOrEqualTo(key: string, value: any): RxAVQuery;
    greaterThan(key: string, value: any): RxAVQuery;
    greaterThanOrEqualTo(key: string, value: any): RxAVQuery;
    ascending(...keys: Array<string>): RxAVQuery;
    addAscending(...keys: Array<string>): RxAVQuery;
    descending(...keys: Array<string>): RxAVQuery;
    addDescending(...keys: Array<string>): RxAVQuery;
    skip(n: number): RxAVQuery;
    limit(n: number): RxAVQuery;
    include(...keys: Array<string>): RxAVQuery;
    select(...keys: Array<string>): RxAVQuery;
    find(): Observable<Array<RxAVObject>>;
    protected _addCondition(key: string, condition: string, value: any): RxAVQuery;
    protected _encode(value: any, disallowObjects: boolean, forcePointers: boolean): any;
    buildParameters(includeClassName?: boolean): {
        [key: string]: any;
    };
}