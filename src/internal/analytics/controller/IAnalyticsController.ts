import { Observable } from 'rxjs';
import { IDeviceInfo } from '@internal/IDeviceInfo';
import { RxAVAnalytics } from 'RxAVAnalytics';

export interface IAnalyticsController {
    deviceProvider: IDeviceInfo;
    send(analyticsData: RxAVAnalytics, sessionToken: string): Observable<boolean>;
    getPolicy(): Observable<RxAVAnalytics>;
}