import { RxAVUser } from 'RxAVUser';
import { RxAVRole } from 'RxAVRole';

export type PermissionsMap = { [permission: string]: boolean };
export type ByIdMap = { [userId: string]: PermissionsMap };
var PUBLIC_KEY = '*';

/**
 * 
 * 基于角色的权限管理
 * @export
 * @class RxAVACL
 */
export class RxAVACL {

    private permissionsById: ByIdMap;

    /**
     * Creates an instance of RxAVACL.
     * @param {...any[]} arg 
     * 
     * @memberOf RxAVACL
     */
    constructor(...arg: any[]) {
        this.permissionsById = {};
        if (arg.length > 0) {
            arg.forEach(currentItem => {
                if (currentItem instanceof RxAVUser) {
                    this.setReadAccess(currentItem, true);
                    this.setWriteAccess(currentItem, true);
                } else if (currentItem instanceof RxAVRole) {
                    this.setReadAccess(currentItem, true);
                    this.setWriteAccess(currentItem, true);
                } else if (typeof currentItem === 'string') {
                    this.setRoleWriteAccess(currentItem, true);
                    this.setRoleReadAccess(currentItem, true);
                } else if (currentItem !== undefined) {
                    throw new TypeError('RxAVACL.constructor need RxAVUser or RxAVRole.');
                }
            });
        } else {
            this.setPublicReadAccess(true);
            this.setPublicWriteAccess(true);
        }

        // if (arg1 && typeof arg1 === 'object') {
        //     if (arg1 instanceof RxAVUser) {
        //         this.setReadAccess(arg1, true);
        //         this.setWriteAccess(arg1, true);
        //     } else {
        //         for (var userId in arg1) {
        //             var accessList = arg1[userId];
        //             if (typeof userId !== 'string') {
        //                 throw new TypeError(
        //                     'Tried to create an ACL with an invalid user id.'
        //                 );
        //             }
        //             this.permissionsById[userId] = {};
        //             for (var permission in accessList) {
        //                 var allowed = accessList[permission];
        //                 if (permission !== 'read' && permission !== 'write') {
        //                     throw new TypeError(
        //                         'Tried to create an ACL with an invalid permission type.'
        //                     );
        //                 }
        //                 if (typeof allowed !== 'boolean') {
        //                     throw new TypeError(
        //                         'Tried to create an ACL with an invalid permission value.'
        //                     );
        //                 }
        //                 this.permissionsById[userId][permission] = allowed;
        //             }
        //         }
        //     }
        // } else if (typeof arg1 === 'function') {
        //     throw new TypeError(
        //         'RxAVACL constructed with a function. Did you forget ()?'
        //     );
        // }
    }

    toJSON(): ByIdMap {
        let permissions = {};
        for (let p in this.permissionsById) {
            permissions[p] = this.permissionsById[p];
        }
        return permissions;
    }

    /**
     * 判断两个 ACL 对象是否相等
     * 
     * @param {RxAVACL} other 
     * @returns {boolean} 
     * 
     * @memberOf RxAVACL
     */
    equals(other: RxAVACL): boolean {
        if (!(other instanceof RxAVACL)) {
            return false;
        }
        let users = Object.keys(this.permissionsById);
        let otherUsers = Object.keys(other.permissionsById);
        if (users.length !== otherUsers.length) {
            return false;
        }
        for (let u in this.permissionsById) {
            if (!other.permissionsById[u]) {
                return false;
            }
            if (this.permissionsById[u]['read'] !== other.permissionsById[u]['read']) {
                return false;
            }
            if (this.permissionsById[u]['write'] !== other.permissionsById[u]['write']) {
                return false;
            }
        }
        return true;
    }

    private _setAccess(accessType: string, userId: RxAVUser | RxAVRole | string, allowed: boolean) {
        if (userId instanceof RxAVUser) {
            userId = userId.objectId;
        } else if (userId instanceof RxAVRole) {
            const name = userId.name;
            if (!name) {
                throw new TypeError('Role must have a name');
            }
            userId = 'role:' + name;
        }
        if (typeof userId !== 'string') {
            throw new TypeError('userId must be a string.');
        }
        if (typeof allowed !== 'boolean') {
            throw new TypeError('allowed must be either true or false.');
        }
        let permissions = this.permissionsById[userId];
        if (!permissions) {
            if (!allowed) {
                // The user already doesn't have this permission, so no action is needed
                return;
            } else {
                permissions = {};
                this.permissionsById[userId] = permissions;
            }
        }

        if (allowed) {
            this.permissionsById[userId][accessType] = true;
        } else {
            delete permissions[accessType];
            if (Object.keys(permissions).length === 0) {
                delete this.permissionsById[userId];
            }
        }
    }

    private _getAccess(
        accessType: string,
        userId: RxAVUser | RxAVRole | string
    ): boolean {
        if (userId instanceof RxAVUser) {
            userId = userId.objectId;
            if (!userId) {
                throw new Error('Cannot get access for a RxAVUser without an ID');
            }
        } else if (userId instanceof RxAVRole) {
            const name = userId.name;
            if (!name) {
                throw new TypeError('Role must have a name');
            }
            userId = 'role:' + name;
        }
        let permissions = this.permissionsById[userId];
        if (!permissions) {
            return false;
        }
        return !!permissions[accessType];
    }

    /**
     * 查找 Write 权限
     * 
     * @returns {boolean}
     * 
     * @memberOf RxAVACL
     */
    public findWriteAccess(): boolean {
        let rtn = false;
        for (let key in this.permissionsById) {
            let permisstion = this.permissionsById[key];
            if (permisstion['write']) {
                rtn = true;
                break;
            }
        }
        return rtn;
    }

    /**
     * 设置 Read 权限
     * 
     * @param {any} userId {(RxAVUser | RxAVRole | string)}  
     * @param {boolean} allowed 
     * 
     * @memberOf RxAVACL
     */
    public setReadAccess(userId: RxAVUser | RxAVRole | string, allowed: boolean) {
        this._setAccess('read', userId, allowed);
    }

    /**
     * 获取 Read 权限
     * 
     * @param {any}  userId {(RxAVUser | RxAVRole | string)}  
     * @returns {boolean} 
     * 
     * @memberOf RxAVACL
     */
    public getReadAccess(userId: RxAVUser | RxAVRole | string): boolean {
        return this._getAccess('read', userId);
    }

    /**
     * 设置 Write 权限
     * 
     * @param {any} userId {(RxAVUser | RxAVRole | string)}  
     * @param {boolean} allowed 
     * 
     * @memberOf RxAVACL
     */
    public setWriteAccess(userId: RxAVUser | RxAVRole | string, allowed: boolean) {
        this._setAccess('write', userId, allowed);
    }

    /**
     * 获取 Write 权限
     * 
     * @param {any} userId {(RxAVUser | RxAVRole | string)} userId 
     * @returns {boolean} 
     * 
     * @memberOf RxAVACL
     */
    public getWriteAccess(userId: RxAVUser | RxAVRole | string): boolean {
        return this._getAccess('write', userId);
    }

    /**
     * 设置所有人的 Read 权限
     * 
     * @param {boolean} allowed 
     * 
     * @memberOf RxAVACL
     */
    public setPublicReadAccess(allowed: boolean) {
        this.setReadAccess(PUBLIC_KEY, allowed);
    }

    /**
     *  获取所有人的 Read 权限
     * 
     * @returns {boolean} 
     * 
     * @memberOf RxAVACL
     */
    public getPublicReadAccess(): boolean {
        return this.getReadAccess(PUBLIC_KEY);
    }


    /**
     * 设置所有人的 Write 权限
     * 
     * @param {boolean} allowed 
     * 
     * @memberOf RxAVACL
     */
    public setPublicWriteAccess(allowed: boolean) {
        this.setWriteAccess(PUBLIC_KEY, allowed);
    }

    /**
     * 获取所有人的 Write 权限
     * 
     * @returns {boolean} 
     * 
     * @memberOf RxAVACL
     */
    public getPublicWriteAccess(): boolean {
        return this.getWriteAccess(PUBLIC_KEY);
    }

    /**
     * 设置角色的 Read 权限
     * 
     * @param {any} role {(RxAVRole | string)}  
     * @returns {boolean} 
     * 
     * @memberOf RxAVACL
     */
    public getRoleReadAccess(role: RxAVRole | string): boolean {
        if (role instanceof RxAVRole) {
            // Normalize to the String name
            role = role.name;
        }
        if (typeof role !== 'string') {
            throw new TypeError(
                'role must be a RxAVRole or a String'
            );
        }
        return this.getReadAccess('role:' + role);
    }

    /**
     *  获取角色的 Write 权限
     * 
     * @param {any} role {(RxAVRole | string)}  
     * @returns {boolean} 
     * 
     * @memberOf RxAVACL
     */
    public getRoleWriteAccess(role: RxAVRole | string): boolean {
        if (role instanceof RxAVRole) {
            // Normalize to the String name
            role = role.name;
        }
        if (typeof role !== 'string') {
            throw new TypeError(
                'role must be a RxAVRole or a String'
            );
        }
        return this.getWriteAccess('role:' + role);
    }

    /**
     * 设置角色的 Read 权限
     * 
     * @param {any} role {(RxAVRole | string)}  
     * @param {boolean} allowed 
     * 
     * @memberOf RxAVACL
     */
    public setRoleReadAccess(role: RxAVRole | string, allowed: boolean) {
        if (role instanceof RxAVRole) {
            // Normalize to the String name
            role = role.name;
        }
        if (typeof role !== 'string') {
            throw new TypeError(
                'role must be a RxAVRole or a String'
            );
        }
        this.setReadAccess('role:' + role, allowed);
    }

    /**
     * 设置角色 Write 权限
     * 
     * @param {any} role {(RxAVRole | string)}  
     * @param {boolean} allowed 
     * 
     * @memberOf RxAVACL
     */
    public setRoleWriteAccess(role: RxAVRole | string, allowed: boolean) {
        if (role instanceof RxAVRole) {
            // Normalize to the String name
            role = role.name;
        }
        if (typeof role !== 'string') {
            throw new TypeError(
                'role must be a RxAVRole or a String'
            );
        }
        this.setWriteAccess('role:' + role, allowed);
    }
}