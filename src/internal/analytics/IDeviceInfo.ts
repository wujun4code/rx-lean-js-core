import { RxAVAnalyticDevice } from 'RxAVAnalytics';

export interface IDeviceInfo {
    getDevice(): Promise<RxAVAnalyticDevice>;
}