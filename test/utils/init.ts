import { RxAVClient, RxAVApp } from '../../src/RxLeanCloud';
import { PCInfo } from '../analytics/PCInfo';
import { NodeJSWebSocketClient } from '../realtime/NodeJSWebSocketClient';
let app = new RxAVApp({
    appId: `uay57kigwe0b6f5n0e1d4z4xhydsml3dor24bzwvzr57wdap`,
    appKey: `kfgz7jjfsk55r5a8a3y4ttd3je1ko11bkibcikonk32oozww`,
    server: {
        rtm: `wss://rtm51.leancloud.cn`
    }
});
let app2 = new RxAVApp({
    appId: `1kz3x4fkhvo0ihk967hxdnlfk4etk754at9ciqspjmwidu1t`,
    appKey: `14t4wqop50t4rnq9e99j2b9cyg51o1232ppzzc1ia2u5e05e`,
    shortname: `dev`
});
import {
    APP_ID,
    APP_KEY,
    REGION,
} from './config';

export function init() {
    RxAVClient.init({
        log: true,
        plugins: {
            websocket: new NodeJSWebSocketClient(),
            device: new PCInfo()
        }
    }).add(app).add(app2);
}

