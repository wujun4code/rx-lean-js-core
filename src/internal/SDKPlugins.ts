import { HttpRequest } from '@internal/HttpRequest';
import { IRxHttpClient } from '@internal/iRxHttpClient';
import { RxHttpClient } from '@internal/RxHttpClient';
import { AVCommand } from '@internal/AVCommand';
import { IAVCommandRunner } from '@internal/IAVCommandRunner';
import { AVCommandRunner } from '@internal/AVCommandRunner';
import { IObjectController } from '@internal/IObjectController';
import { ObjectController } from '@internal/ObjectController';
import { IUserController } from '@internal/iUserController';
import { UserController } from '@internal/UserController';
import { IQueryController } from '@internal/IQueryController';
import { QueryController } from '@internal/QueryController';
import { ILeanEngineController } from '@internal/ILeanEngineController';
import { LeanEngineController } from '@internal/LeanEngineController';

import { IToolController } from '@internal/IToolController';
import { ToolController } from '@internal/ToolController';

import { IAVEncoder } from '@internal/IAVEncoder';
import { AVEncoder } from '@internal/AVEncoder';
import { IAVDecoder } from '@internal/IAVDecoder';
import { AVDecoder } from '@internal/AVDecoder';
import { IAVObjectDecoder } from '@internal/IAVObjectDecoder';
import { AVObjectDecoder } from '@internal/AVObjectDecoder';
import { ILeanEngineDecoder } from '@internal/ILeanEngineDecoder';
import { LeanEngineDecoder } from '@internal/LeanEngineDecoder';

import { IStorage } from '@internal/IStorage';
import { IStorageController } from '@internal/IStorageController';
import { StorageController } from '@internal/StorageController';

import { IDeviceInfo } from '@internal/IDeviceInfo';
import { IAnalyticsController } from '@internal/IAnalyticsController';
import { AnalyticsController } from '@internal/AnalyticsController';

import { IRxWebSocketClient } from '@internal/IRxWebSocketClient';
import { IWebSocketClient } from '@internal/IWebSocketClient';
import { RxWebSocketController } from '@internal/RxWebSocketController';
import { IRxWebSocketController } from '@internal/IRxWebSocketController';

import { RxAVClient } from '@public/RxAVClient';

export /**
 * SDKPlugins
 */
    class SDKPlugins {
    private _version = 1;
    private _HttpClient: IRxHttpClient;
    private _CommandRunner: IAVCommandRunner;
    private _ObjectController: IObjectController;
    private _QueryController: IQueryController;
    private _UserController: IUserController;
    private _LeanEngineController: ILeanEngineController;
    private _encoder: IAVEncoder;
    private _decoder: IAVDecoder;
    private _objectdecoder: IAVObjectDecoder;
    private _LeanEngineDecoder: ILeanEngineDecoder;
    private _ToolController: IToolController;
    private _StorageController: IStorageController;
    private _StorageProvider: IStorage;
    private _AnalyticsController: IAnalyticsController;
    private _DevicePorvider: IDeviceInfo;
    private _WebSocketProvider: IWebSocketClient;
    private _RxWebSocketController: IRxWebSocketController;
    private static _sdkPluginsInstance: SDKPlugins;

    constructor(version?: number) {
        this._version = version;
    }

    get HttpClient() {
        if (this._HttpClient == null) {
            this._HttpClient = new RxHttpClient(this._version);
        }
        return this._HttpClient;
    }

    get CommandRunner() {
        if (this._CommandRunner == null) {
            this._CommandRunner = new AVCommandRunner(this.HttpClient);
        }
        return this._CommandRunner;
    }

    get ObjectControllerInstance() {
        if (this._ObjectController == null) {
            this._ObjectController = new ObjectController(this.CommandRunner);
        }
        return this._ObjectController;
    }

    get UserControllerInstance() {
        if (this._UserController == null) {
            this._UserController = new UserController(this.CommandRunner);
        }
        return this._UserController;
    }

    get QueryControllerInstance() {
        if (this._QueryController == null) {
            this._QueryController = new QueryController(this.CommandRunner);
        }
        return this._QueryController;
    }

    get LeanEngineControllerInstance() {
        if (this._LeanEngineController == null) {
            this._LeanEngineController = new LeanEngineController(this.LeanEngineDecoder);
        }
        return this._LeanEngineController;
    }

    get ToolControllerInstance() {
        if (this._ToolController == null) {
            this._ToolController = new ToolController();
        }
        return this._ToolController;
    }

    get LocalStorageControllerInstance() {
        if (this._StorageController == null) {
            if (this.StorageProvider != null)
                this._StorageController = new StorageController(this.StorageProvider);
        }
        return this._StorageController;
    }

    get hasStorage() {
        return this.StorageProvider != null;
    }
    get StorageProvider() {
        return this._StorageProvider;
    }

    set StorageProvider(provider: IStorage) {
        this._StorageProvider = provider;
    }

    set LocalStorageControllerInstance(controller: IStorageController) {
        this._StorageController = controller;
    }

    get AnalyticsControllerInstance() {
        if (this._AnalyticsController == null) {
            if (this._DevicePorvider != null) {
                this._AnalyticsController = new AnalyticsController(this.CommandRunner, this._DevicePorvider);
            }
        }
        return this._AnalyticsController;
    }

    set AnalyticsControllerInstance(controller: IAnalyticsController) {
        this._AnalyticsController = controller;
    }

    get DeviceProvider() {
        return this._DevicePorvider;
    }
    set DeviceProvider(provider: IDeviceInfo) {
        this._DevicePorvider = provider;
    }

    get WebSocketProvider() {
        return this._WebSocketProvider;
    }
    set WebSocketProvider(provider: IWebSocketClient) {
        this._WebSocketProvider = provider;
    }

    get WebSocketController() {
        if (this._RxWebSocketController == null) {
            if (this._WebSocketProvider != null) {
                this._RxWebSocketController = new RxWebSocketController(this._WebSocketProvider);
            } else {
                throw new Error(`you musy set the websocket when invoke RxAVClient.init{
                    ...
                    plugins?: {
                        ...
                        websocket?: IWebSocketClient
                        ...
                    }
                    ...
                    }`);
            }
        }
        return this._RxWebSocketController;
    }

    set WebSocketController(provider: IRxWebSocketController) {
        this._RxWebSocketController = provider;
    }

    get Encoder() {
        if (this._encoder == null) {
            this._encoder = new AVEncoder();
        }
        return this._encoder;
    }

    get Decoder() {
        if (this._decoder == null) {
            this._decoder = new AVDecoder();
        }
        return this._decoder;
    }

    get ObjectDecoder() {
        if (this._objectdecoder == null) {
            this._objectdecoder = new AVObjectDecoder();
        }
        return this._objectdecoder;
    }

    get LeanEngineDecoder() {
        if (this._LeanEngineDecoder == null) {
            this._LeanEngineDecoder = new LeanEngineDecoder(this.Decoder, this.ObjectDecoder);
        }
        return this._LeanEngineDecoder;
    }

    static get instance(): SDKPlugins {
        if (SDKPlugins._sdkPluginsInstance == null)
            SDKPlugins._sdkPluginsInstance = new SDKPlugins(1);
        return SDKPlugins._sdkPluginsInstance;
    }

    static set version(version: number) {
        SDKPlugins._sdkPluginsInstance = new SDKPlugins(version);
    }
}
