import { SDKPlugins } from '@internal/SDKPlugins';
import { AVCommand } from '@internal/AVCommand';
import { AVCommandResponse } from '@internal/AVCommandResponse';
import { IAVCommandRunner } from '@internal/IAVCommandRunner';
import { AVCommandRunner } from '@internal/AVCommandRunner';
import { IStorage } from '@internal/IStorage';
import { IDeviceInfo } from '@internal/IDeviceInfo';
import { IRxWebSocketClient } from '@internal/IRxWebSocketClient';
import { IWebSocketClient } from '@internal/IWebSocketClient';
import { StorageController } from '@internal/StorageController';
import { Observable } from 'rxjs';
import { HttpRequest } from '@internal/HttpRequest';
var pjson = require('../package.json');

// var providers: {
//     storage?: IStorage,
//     device?: IDeviceInfo
// } = {};

/**
 * SDK 核心类，包含了基础的功能模块
 * 
 * @export
 * @class RxAVClient
 */
export class RxAVClient {
    /**
     * 初始化 SDK
     * 
     * @static
     * @param {any}
     * {{
     *         appId: string,
     *         appKey: string,
     *         region?: string,
     *         serverUrl?: string,
     *         log?: boolean,
     *         pluginVersion?: number,
     *         plugins?: {
     *             storage?: IStorage,
     *             device?: IDeviceInfo
     *         }
     *     }} config 
     * 
     * @memberOf RxAVClient
     */
    static init(config: {
        appId?: string,
        appKey?: string,
        region?: string,
        log?: boolean,
        pluginVersion?: number,
        plugins?: {
            storage?: IStorage,
            device?: IDeviceInfo,
            websocket?: IWebSocketClient
        }
    }): RxAVClient {
        return RxAVClient.instance.initialize(config);
    }

    /*
    *  
    */
    currentApp: RxAVApp;
    remotes: Array<RxAVApp> = [];
    add(app: RxAVApp, replace?: boolean) {
        if (this.remotes.length == 0 || (typeof replace != 'undefined' && replace)) {
            if (app.shortname == null) {
                app.shortname = 'default';
            }
            this.currentApp = app;
        }
        this.remotes.push(app);
        return this as RxAVClient;
    }

    take(options?: any) {
        let app: RxAVApp = null;
        if (options) {
            if (options.app) {
                if (options.app instanceof RxAVApp) {
                    app = options.app;
                }
            } else if (options.appName) {
                if (typeof options.appName === "string") {
                    let tempApp = this.remotes.find(a => {
                        return a.shortname == options.appName;
                    });
                    if (tempApp) {
                        app = tempApp;
                    }
                }
            }
        } else {
            app = RxAVClient.instance.currentApp;
        }
        return app;
    }

    private _switch(shortname: string) {
        let tempApp = this.remotes.find(app => {
            return app.shortname == shortname;
        });
        if (tempApp) {
            this.currentApp = tempApp;
        }
        return this as RxAVClient;
    }


    public get SDKVersion(): string {
        return pjson.version;
    }

    public isNode() {
        return this.currentConfiguration.isNode;
    }

    public static inLeanEngine() {
        return false;
    }

    protected printWelcome() {
        RxAVClient.printLog('=== LeanCloud-Typescript-Rx-SDK ===');
        RxAVClient.printLog(`pluginVersion:${this.currentConfiguration.pluginVersion}`);
        RxAVClient.printLog(`environment:node?${this.currentConfiguration.isNode}`);
        RxAVClient.printLog(`region:${this.currentApp.region}`);
        RxAVClient.printLog('=== Rx is great, Typescript is wonderful! ===');
    }

    public static printLog(message?: any, ...optionalParams: any[]) {
        if (RxAVClient.instance.currentConfiguration.log) {
            console.log('===================================');
            if (optionalParams.length > 0)
                console.log(message, optionalParams);
            else console.log(message);
        }
    }

    protected static generateAVCommand(relativeUrl: string, method: string, data?: { [key: string]: any }, sessionToken?: string, app?: RxAVApp): AVCommand {
        let cmd = new AVCommand({
            app: app,
            relativeUrl: relativeUrl,
            method: method,
            data: data,
            sessionToken: sessionToken
        });
        return cmd;
    }

    public static runCommand(relativeUrl: string, method: string, data?: { [key: string]: any }, sessionToken?: string, app?: RxAVApp): Observable<{ [key: string]: any }> {
        let cmd = RxAVClient.generateAVCommand(relativeUrl, method, data, sessionToken, app);
        return SDKPlugins.instance.CommandRunner.runRxCommand(cmd).map(res => {
            return res.body;
        });
    }

    private static _avClientInstance: RxAVClient;

    static get instance(): RxAVClient {
        if (RxAVClient._avClientInstance == null)
            RxAVClient._avClientInstance = new RxAVClient();
        return RxAVClient._avClientInstance;
    }

    currentConfiguration: {
        isNode?: boolean,
        sdkVersion?: string,
        log?: boolean,
        pluginVersion?: number,
        runtime?: string
    } = {};


    public initialize(config: {
        appId?: string,
        appKey?: string,
        region?: string,
        log?: boolean,
        pluginVersion?: number,
        plugins?: {
            storage?: IStorage,
            device?: IDeviceInfo,
            websocket?: IWebSocketClient
        }
    }) {
        // 注册全局未捕获异常处理器
        process.on('uncaughtException', function (err) {
            console.error("Caught exception:", err.stack);
        });
        process.on('unhandledRejection', function (reason, p) {
            console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason.stack);
        });

        this.currentConfiguration.log = config.log;

        if (typeof (process) !== 'undefined' && process.versions && process.versions.node) {
            this.currentConfiguration.isNode = true;
        }
        if (config.appId && config.appKey) {
            let app = new RxAVApp({
                appId: config.appId,
                appKey: config.appKey,
            });

            this.add(app, true);
        }

        this.currentConfiguration.pluginVersion = config.pluginVersion;
        SDKPlugins.version = config.pluginVersion;
        if (config.plugins) {
            if (config.plugins.storage) {
                SDKPlugins.instance.StorageProvider = config.plugins.storage;
                SDKPlugins.instance.LocalStorageControllerInstance = new StorageController(config.plugins.storage);
            }
            if (config.plugins.device) {
                SDKPlugins.instance.DeviceProvider = config.plugins.device;
            }
            if (config.plugins.websocket) {
                SDKPlugins.instance.WebSocketProvider = config.plugins.websocket;
            }
        }
        return this as RxAVClient;
    }

    public request(url: string, method?: string, headers?: { [key: string]: any }, data?: { [key: string]: any }): Observable<{ [key: string]: any }> {
        let httpRequest = new HttpRequest();
        httpRequest.url = url;
        httpRequest.method = "GET";
        httpRequest.headers = {};
        if (method)
            httpRequest.method = method;
        if (data)
            httpRequest.data = data;
        if (headers)
            httpRequest.headers = headers;
        return SDKPlugins.instance.HttpClient.execute(httpRequest);
    }

}

export class AppRouterState {
    constructor(appId: string) {
        let appDomain = appId.substring(0, 8).toLowerCase();
        this.TTL = -1;
        let protocol = 'https://';
        let prefix = `${protocol}${appDomain}`;
        this.ApiServer = `${prefix}.api.lncld.net`;
        this.EngineServer = `${prefix}.engine.lncld.net`;
        this.PushServer = `${prefix}.push.lncld.net`;
        this.RealtimeRouterServer = `${prefix}.rtm.lncld.net`;
        this.StatsServer = `${prefix}.stats.lncld.net`;
        this.Source = "initial";

        let appHash = appId.split('-');
        if (appHash.length > 1) {
            let regionHash = appHash[1];
            if (regionHash == '9Nh9j0Va') {
                this.ApiServer = `${protocol}e1-api.leancloud.cn`;
                this.EngineServer = `${protocol}e1-api.leancloud.cn`;
                this.PushServer = `${protocol}e1-api.leancloud.cn`;
                this.RealtimeRouterServer = `${protocol}router-q0-push.leancloud.cn`;
                this.StatsServer = `${protocol}e1-api.leancloud.cn`;
            }
        }
    }
    public TTL: number
    public ApiServer: string;
    public EngineServer: string;
    public PushServer: string;
    public RealtimeRouterServer: string;
    public StatsServer: string;
    public Source: string;
    public FetchedAt: Date;
}

export class RxAVApp {

    constructor(options: {
        appId: string,
        appKey: string,
        region?: string,
        shortname?: string,
        server?: {
            api?: string,
            realtimeRouter?: string,
            rtm?: string,
            push?: string,
            stats?: string,
            engine?: string
        },
        additionalHeaders?: { [key: string]: any }
    }) {
        this.appId = options.appId;
        this.appKey = options.appKey;

        if (options.region)
            this.region = options.region;
        else this.region = 'cn';

        this.server = options.server;
        this.shortname = options.shortname;
        this.additionalHeaders = options.additionalHeaders;

        this.appRouterState = new AppRouterState(this.appId);
    }
    shortname: string;
    appId: string;
    appKey: string;
    region?: string;
    additionalHeaders?: { [key: string]: any };
    appRouterState: AppRouterState;

    server?: {
        api?: string,
        realtimeRouter?: string,
        rtm?: string,
        push?: string,
        stats?: string,
        engine?: string
    };

    get api() {
        let root = this.region == 'cn' ? 'https://api.leancloud.cn' : 'https://us-api.leancloud.cn';
        let url = this._getUrl('api');
        return url || this.appRouterState.ApiServer || root;
    }

    get rtm() {
        let url = this._getUrl('rtm');
        return url;
    }

    get realtimeRouter() {
        let url = this._getUrl('pushRouter');
        return url || this.appRouterState.RealtimeRouterServer;
    }

    get engine() {
        let url = this._getUrl('engine');
        return url || this.appRouterState.EngineServer;
    }

    get stats() {
        let url = this._getUrl('stats');
        return url || this.appRouterState.StatsServer;
    }

    get push() {
        let url = this._getUrl('push');
        return url || this.appRouterState.PushServer;
    }

    get httpHeaders() {
        let headers: { [key: string]: any } = {};
        headers = {
            'X-LC-Id': this.appId,
            'X-LC-Key': this.appKey,
            'Content-Type': 'application/json'
        };
        if (RxAVClient.instance.isNode()) {
            headers['User-Agent'] = 'ts-sdk/' + pjson.version;
        }
        if (this.additionalHeaders) {
            for (let key in this.additionalHeaders) {
                headers[key] = this.additionalHeaders[key];
            }
        }
        return headers;
    }

    private _getUrl(key: string) {
        if (this.server) {
            if (Object.prototype.hasOwnProperty.call(this.server, key)) {
                return this.server[key];
            }
        }
        return null;
    }
}
