export {
    default as factory
}
from "../examples/out.js"
// export {default as factory} from '../modules/mgclient.mjs';

class MgResourceManagerInternal {
    #resourceManager;
    constructor() {
        this.#resourceManager = [];
    }

    push(resource) {
        this.#resourceManager.push(resource);
    }

    stopManaging(resource) {
        let index = this.#resourceManager.indexOf(resource);
        if (index == -1) {
            throw "Internal error";
        }
        this.#resourceManager.splice(index, 1);
    }

    releaseAll() {
        // deallocate in reverse order
        this.#resourceManager.reverse().forEach(element => {
            element.destroy();
        });
        this.#resourceManager = [];
    }

    resourcesTracked() {
        return this.#resourceManager.length;
    }
};

let resourceManager = new MgResourceManagerInternal();

function errorOrValue(value) {
    if (value.transferToWasm() == 0) {
        return null
    }
    resourceManager.push(value);
    return value;
}

let instance = null;

export function clientVersion() {
    let wrappedFun = instance.cwrap('mg_client_version', 'string');
    return wrappedFun();
}

export function init(wasmInstance) {
    if (instance != null) {
        return null;
    }
    instance = wasmInstance;
    return instance._mg_init();
}

export function finalize() {
    resourceManager.releaseAll();
    return instance._mg_finalize();
}

export function releaseAll() {
    resourceManager.releaseAll();
}

export function resourcesTracked() {
    return resourceManager.resourcesTracked();
}

export class MgValueTypeEnum {
    static MG_VALUE_TYPE_NULL = new MgValueTypeEnum("MG_VALUE_TYPE_NULL");
    static MG_VALUE_TYPE_BOOL = new MgValueTypeEnum("MG_VALUE_TYPE_BOOL");
    static MG_VALUE_TYPE_INTEGER = new MgValueTypeEnum("MG_VALUE_TYPE_INTEGER");
    static MG_VALUE_TYPE_FLOAT = new MgValueTypeEnum("MG_VALUE_TYPE_FLOAT");
    static MG_VALUE_TYPE_STRING = new MgValueTypeEnum("MG_VALUE_TYPE_STRING");
    static MG_VALUE_TYPE_LIST = new MgValueTypeEnum("MG_VALUE_TYPE_LIST");
    static MG_VALUE_TYPE_MAP = new MgValueTypeEnum("MG_VALUE_TYPE_MAP");
    static MG_VALUE_TYPE_NODE = new MgValueTypeEnum("MG_VALUE_TYPE_NODE");
    static MG_VALUE_TYPE_RELATIONSHIP =
        new MgValueTypeEnum("MG_VALUE_TYPE_RELATIONSHIP");
    static MG_VALUE_TYPE_UNBOUND_RELATIONSHIP =
        new MgValueTypeEnum("MG_VALUE_TYPE_UNBOUND_RELATIONSHIP");
    static MG_VALUE_TYPE_PATH = new MgValueTypeEnum("MG_VALUE_TYPE_PATH");
    static MG_VALUE_TYPE_DATE = new MgValueTypeEnum("MG_VALUE_TYPE_DATE");
    static MG_VALUE_TYPE_TIME = new MgValueTypeEnum("MG_VALUE_TYPE_TIME");
    static MG_VALUE_TYPE_LOCAL_TIME =
        new MgValueTypeEnum("MG_VALUE_TYPE_LOCAL_TIME");
    static MG_VALUE_TYPE_DATE_TIME =
        new MgValueTypeEnum("MG_CALUE_TYPE_DATE_TIME");
    static MG_VALUE_TYPE_DATE_TIME_ZONE_ID =
        new MgValueTypeEnum("MG_VALUE_TYPE_DATE_TIME");
    static MG_VALUE_TYPE_LOCAL_DATE_TIME =
        new MgValueTypeEnum("MG_VALUE_TYPE_LOCAL_DATE_TIME");
    static MG_VALUE_TYPE_DURATION = new MgValueTypeEnum("MG_VALUE_TYPE_DURATION");
    static MG_VALUE_TYPE_POINT_2D = new MgValueTypeEnum("MG_VALUE_TYPE_POINT_2D");
    static MG_VALUE_TYPE_POINT_3D = new MgValueTypeEnum("MG_VALUE_TYPE_POINT_3D");
    static MG_VALUE_TYPE_UNKNOWN = new MgValueTypeEnum("MG_VALUE_TYPE_UNKNOWN");

    constructor(name) {
        this.name = name;
    }

    toString() {
        return this.name;
    }
};

export class MgValue {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    getType() {
        let wrappedFun = instance.cwrap('mg_value_get_type', 'i32', ['i32']);
        let enumValuesArray = Object.keys(MgValueTypeEnum);
        return enumValuesArray[wrappedFun(this.#cPtr)];
    }

    isNull() {
        return this.#cPtr == 0;
    }

    getBool() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_BOOL.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_bool', 'i32', ['i32']);
        return (wrappedFun(this.#cPtr) == 0) ? false : true;
    }

    getInteger() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_INTEGER.name) {
            return null
        }
        let wrappedFun = instance.cwrap('mg_value_integer', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    getFloat() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_FLOAT.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_float', 'double', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    getMgString() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_STRING.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_string', 'i32', ['i32']);
        return new MgString(wrappedFun(this.#cPtr));
    }

    getMgList() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_LIST.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_list', 'i32', ['i32']);
        return new MgList(wrappedFun(this.#cPtr));
    }

    getMgMap() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_MAP.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_map', 'i32', ['i32']);
        return new MgMap(wrappedFun(this.#cPtr));
    }

    getMgNode() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_NODE.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_node', 'i32', ['i32']);
        return new MgNode(wrappedFun(this.#cPtr));
    }

    getMgRelationship() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_RELATIONSHIP.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_relationship', 'i32', ['i32']);
        return new MgRelationship(wrappedFun(this.#cPtr));
    }

    getMgUnboundRelationship() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_UNBOUND_RELATIONSHIP.name) {
            return null;
        }
        let wrappedFun =
            instance.cwrap('mg_value_unbound_relationship', 'i32', ['i32']);
        return new MgUnboundRelationship(wrappedFun(this.#cPtr));
    }

    getMgPath() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_PATH.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_path', 'i32', ['i32']);
        return new MgPath(wrappedFun(this.#cPtr));
    }

    getMgDate() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DATE.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_date', 'i32', ['i32']);
        return new MgDate(wrappedFun(this.#cPtr));
    }

    getMgTime() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_TIME.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_time', 'i32', ['i32']);
        return new MgTime(wrappedFun(this.#cPtr));
    }

    getMgLocalTime() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_LOCAL_TIME.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_local_time', 'i32', ['i32']);
        return new MgLocalTime(wrappedFun(this.#cPtr));
    }

    getMgDateTime() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DATE_TIME.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_date_time', 'i32', ['i32']);
        return new MgDateTime(wrappedFun(this.#cPtr));
    }

    getMgDateTimeZoneId() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DATE_TIME_ZONE_ID.name) {
            return null;
        }
        let wrappedFun =
            instance.cwrap('mg_value_date_time_zone_id', 'i32', ['i32']);
        return new MgDateTimeZoneId(wrappedFun(this.#cPtr));
    }

    getMgLocalDateTime() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_LOCAL_DATE_TIME.name) {
            return null;
        }
        let wrappedFun =
            instance.cwrap('mg_value_local_date_time', 'i32', ['i32']);
        return new MgLocalDateTime(wrappedFun(this.#cPtr));
    }

    getMgDuration() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DURATION.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_duration', 'i32', ['i32']);
        return new MgDuration(wrappedFun(this.#cPtr));
    }

    getPoint2D() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_POINT_2D.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_point_2d', 'i32', ['i32']);
        return new MgPoint2D(wrappedFun(this.#cPtr));
    }

    getMgPoint3D() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_POINT_3D.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_point_3d', 'i32', ['i32']);
        return new MgLocalPoint3D(wrappedFun(this.#cPtr));
    }

    copy(instance) {
        let wrappedFun = instance.cwrap('mg_value_copy', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_value_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }

    static makeNull() {
        let result = new MgValue(instance._mg_value_make_null());
        return errorOrValue(result);
    }

    static makeBool(val) {
        let bool = (val == false) ? 0 : 1;
        let result = new MgValue(instance._mg_value_make_bool(1));
        return errorOrValue(result);
    }

    static makeInteger(val) {
        let result = new MgValue(instance._mg_value_make_integer(val));
        return errorOrValue(result);
    }

    static makeFloat(val) {
        let wrappedFun = instance.cwrap('mg_value_copy', 'i32', ['double']);
        let result = new MgValue(instance._mg_value_make_float(val));
        return errorOrValue(result);
    }

    static makeString(str) {
        let wrappedFun =
            instance.cwrap('mg_value_make_string', 'i32', ['string']);
        let result = new MgValue(wrappedFun(str));
        return errorOrValue(result);
    }

    static makeString2(mgString) {
        let wrappedFun = instance.cwrap('mg_value_make_string2', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgString.transferToWasm()));
        return errorOrValue(result);
    }

    static makeList(mgList) {
        let wrappedFun = instance.cwrap('mg_value_make_list', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgList.transferToWasm()));
        return errorOrValue(result);
    }

    static makeMap(mgMap) {
        let wrappedFun = instance.cwrap('mg_value_make_map', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgMap.transferToWasm()));
        return errorOrValue(result);
    }

    static makeNode(mgNode) {
        let wrappedFun = instance.cwrap('mg_value_make_node', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgNode.transferToWasm()));
        return errorOrValue(result);
    }

    static makeRelationship(mgRelationship) {
        let wrappedFun =
            instance.cwrap('mg_value_make_relationship', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgRelationship.transferToWasm()));
        return errorOrValue(result);
    }

    static makeUnboundRelationship(mgValueMakeUnboundRelationship) {
        let wrappedFun =
            instance.cwrap('mg_value_make_unbound_relationship', 'i32', ['i32']);
        let result = new MgValue(
            wrappedFun(mgValueMakeUnboundRelationship.transferToWasm()));
        return value;
    }

    static MgValueMakePath(mgPath) {
        let wrappedFun = instance.cwrap('mg_value_make_path', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgPath.transferToWasm()));
        return errorOrValue(result);
    }

    static MgValueMakeDate(mgDate) {
        let wrappedFun = instance.cwrap('mg_value_make_date', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgDate.transferToWasm()));
        return errorOrValue(result);
    }

    static MgValueMakeTime(mgTime) {
        let wrappedFun = instance.cwrap('mg_value_make_time', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgTime.transferToWasm()));
        return errorOrValue(result);
    }

    static MgValueMakeLocalTime(mgLocalTime) {
        let wrappedFun =
            instance.cwrap('mg_value_make_local_time', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgLocalTime.transferToWasm()));
        return errorOrValue(result);
    }

    static MgValueMakeDateTime(mgDateTime) {
        let wrappedFun =
            instance.cwrap('mg_value_make_date_time', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgDateTime.transferToWasm()));
        return errorOrValue(result);
    }

    static MgValueMakeTimeZoneId(mgDateTimeZoneId) {
        let wrappedFun =
            instance.cwrap('mg_value_make_date_time_zone_id', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgDateTimeZoneId.transferToWasm()));
        return errorOrValue(result);
    }

    static MgValueMakeLocalDateTime(mgLocalDateTime) {
        let wrappedFun =
            instance.cwrap('mg_value_make_local_date_time', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgLocalDateTime.transferToWasm()));
        return errorOrValue(result);
    }

    static MgValueMakeDuration(mgDuration) {
        let wrappedFun = instance.cwrap('mg_value_make_duration', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgDuration.transferToWasm()));
        return errorOrValue(result);
    }

    static MgValueMakePoint2d(mgPoint2d) {
        let wrappedFun = instance.cwrap('mg_value_make_point_2d', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgValueMakePoint2d.transferToWasm()));
        return errorOrValue(result);
    }

    static MgValueMakePoint3d(mgPoint3D) {
        let wrappedFun =
            instance.cwrap('mg_value_make_date_time', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgPoint3D.transferToWasm()));
        return errorOrValue(result);
    }
};

export class MgString {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static make(string) {
        let wrappedFun = instance.cwrap('mg_string_make', 'i32', ['string']);
        let result = new MgString(wrappedFun(string));
        return errorOrValue(result);
    }

    toString() {
        let wrappedFun = instance.cwrap('mg_string_data', 'string', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy() {
        let wrappedFun = instance.cwrap('mg_string_copy', 'i32', ['i32']);
        let result = new MgString(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_string_destroy', 'void', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgList {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static make(capacity) {
        let wrappedFun = instance.cwrap('mg_list_make_empty', 'i32', ['i32']);
        let result = new MgList(wrappedFun(capacity));
        return errorOrValue(result);
    }

    size() {
        let wrappedFun = instance.cwrap('mg_list_size', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    append(mgValue) {
        let wrappedFun = instance.cwrap('mg_list_append', 'i32', ['i32', 'i32']);
        let result = wrappedFun(this.#cPtr, mgValue.transferToWasm());
        if (result != 0) {
            return null;
        }
        resourceManager.stopManaging(mgValue);
        return result;
    }

    at(index) {
        let wrappedFun = instance.cwrap('mg_list_at', 'i32', ['i32', 'i32']);
        let result = wrappedFun(this.#cPtr, index);
        return (result == 0) ? null : new MgValue(result);
    }

    copy() {
        let wrappedFun = instance.cwrap('mg_list_copy', 'i32', ['i32']);
        let result = new MgList(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_list_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgMap {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static make(capacity) {
        let wrappedFun = instance.cwrap('mg_map_make_empty', 'i32', ['i32']);
        let result = new MgMap(wrappedFun(capacity));
        return errorOrValue(result);
    }

    size() {
        let wrappedFun = instance.cwrap('mg_map_size', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    insert(keyString, mgValue) {
        let wrappedFun =
            instance.cwrap('mg_map_insert', 'i32', ['i32', 'string', 'i32']);
        let result = wrappedFun(this.#cPtr, keyString, mgValue.transferToWasm());
        if (result != 0) {
            return null;
        }
        resourceManager.stopManaging(mgValue);
        return result;
    }

    insertWithMgStringKey(mgStringKey, mgValue) {
        let wrappedFun = instance.cwrap('mg_map_insert2', 'i32', ['i32',
            'i32', 'i32'
        ]);
        let result = wrappedFun(this.#cPtr,
            mgStringKey.transferToWasm(), mgValue.transferToWasm());
        if (result ==
            0) {
            return null;
        }
        resourceManager.stopManaging(mgValue);
        resourceManager.stopManaging(mgStringKey);
        return result;
    }

    at(key) {
        let wrappedFun = instance.cwrap('mg_map_at', 'i32', ['i32', 'string']);
        let result = wrappedFun(this.#cPtr, key);
        return (result == 0) ? null : new MgValue(result);
    }

    copy() {
        let wrappedFun = instance.cwrap('mg_map_copy', 'i32', ['i32']);
        let result = new MgMap(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_map_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgNode {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    //  Add new function to MgClient
    //  static make(id, mgListLabels, mgMapProperties) {
    //    let wrappedFun = instance.cwrap('mg_map_make_empty', 'i32', [ 'i32' ]);
    //    let result = new MgMap(wrappedFun(capacity));
    //    return errorOrValue(result);
    //  }

    id() {
        let wrappedFun = instance.cwrap('mg_node_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    labelCount() {
        let wrappedFun = instance.cwrap('mg_label_count', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    labelAtPos(pos) {
        let wrappedFun = instance.cwrap('mg_node_label_at', 'i32', ['i32', 'i32']);
        return new MgString(wrappedFun(this.#cPtr, pos));
    }

    properties() {
        let wrappedFun = instance.cwrap('mg_node_properties', 'i32', ['i32']);
        return new MgMap(wrappedFun(this.#cPtr));
    }

    copy() {
        let wrappedFun = instance.cwrap('mg_node_copy', 'i32', ['i32']);
        let result = MgNode(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_map_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgRelationship {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    id() {
        let wrappedFun = instance.cwrap('mg_relationship_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    startId() {
        let wrappedFun = instance.cwrap('mg_relationship_start_id', 'i32',
            ['i32']);
        return wrappedFun(this.#cPtr);
    }

    endId() {
        let wrappedFun = instance.cwrap('mg_relationship_end_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    type() {
        let wrappedFun = instance.cwrap('mg_relationship_type', 'i32', ['i32']);
        return new MgString(wrappedFun(this.#cPtr));
    }

    properties() {
        let wrappedFun = instance.cwrap('mg_relationship_properties', 'i32', [
            'i32', 'i32'
        ]);
        return new MgMap(wrappedFun(this.#cPtr, pos));
    }

    copy() {
        let wrappedFun = instance.cwrap('mg_relationship_copy', 'i32', ['i32']);
        let result = MgRelationship(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_relationship_destroy', 'void',
            ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgUnboundRelationship {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    id() {
        let wrappedFun = instance.cwrap('mg_unbound_relationship_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    type() {
        let wrappedFun = instance.cwrap('mg_unbound_relationship', 'i32', ['i32']);
        return new MgString(wrappedFun(this.#cPtr));
    }

    properties() {
        let wrappedFun =
            instance.cwrap('mg_unbound_relationship_properties', 'i32', ['i32']);
        return new MgMap(wrappedFun(this.#cPtr, pos));
    }

    copy() {
        let wrappedFun =
            instance.cwrap('mg_unbound_relationship_copy', 'i32', ['i32']);
        let result = new MgUnboundRelationship(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_unbound_relationship_destroy', 'void',
            ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgPath {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    length() {
        let wrappedFun = instance.cwrap('mg_path_length', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    nodeAt(pos) {
        let wrappedFun = instance.cwrap('mg_path_node_at', 'i32', ['i32', 'i32']);
        return new MgNode(wrappedFun(this.#cPtr, pos));
    }

    relationshipAt(pos) {
        let wrappedFun =
            instance.cwrap('mg_path_relationship_at', 'i32', ['i32', 'i32']);
        return MgUnboundRelationship(wrappedFun(this.#cPtr, pos));
    }

    relationshipReversedAt(pos) {
        let wrappedFun =
            instance.cwrap('mg_unbound_relationship_copy', 'i32', ['i32', 'i32']);
        return wrappedFun(this.#cPtr, pos);
    }

    copy() {
        let wrappedFun = instance.cwrap('mg_path_copy', 'i32', ['i32']);
        let result = new MgPath(this.#cPtr);
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_path_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgDate {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    days() {
        let wrappedFun = instance.cwrap('mg_date_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy() {
        let wrappedFun = instance.cwrap('mg_date_copy', 'i32', ['i32']);
        let result = new MgDate(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_map_destroy', 'i32', ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgTime {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    nanoseconds() {
        let wrappedFun = instance.cwrap('mg_time_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    tzOffsetSeconds() {
        let wrappedFun =
            instance.cwrap('mg_time_tz_offset_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy() {
        let wrappedFun = instance.cwrap('mg_time_tz_copy', 'i32', ['i32']);
        let result = new MgTime(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_map_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgLocalTime {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    days() {
        let wrappedFun = instance.cwrap('mg_date_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy() {
        let wrappedFun = instance.cwrap('mg_local_time_copy', 'i32', ['i32']);
        return MgDate(wrappedFun(this.#cPtr));
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_local_time_destroy', 'void', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgDateTime {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    seconds() {
        let wrappedFun = instance.cwrap('mg_date_time_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    nanoseconds() {
        let wrappedFun =
            instance.cwrap('mg_date_time_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    tzOffsetMinutes() {
        let wrappedFun =
            instance.cwrap('mg_date_time_tz_offset_minutes', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy() {
        let wrappedFun = instance.cwrap('mg_date_time_copy', 'i32', ['i32']);
        let result = new MgDateTime(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_local_time_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgDateTimeZoneId {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    seconds() {
        let wrappedFun =
            instance.cwrap('mg_date_time_zone_id_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    nanoseconds() {
        let wrappedFun =
            instance.cwrap('mg_date_time_zone_id_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    id() {
        let wrappedFun =
            instance.cwrap('mg_date_time_zone_id_tz_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy() {
        let wrappedFun =
            instance.cwrap('mg_date_time_zone_id_copy', 'i32', ['i32']);
        let result = new MgDateTime(this.#cPtr);
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun =
            instance.cwrap('mg_date_time_zone_id_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgLocalDateTime {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static make(seconds, nanoseconds) {
        let wrappedFun =
            instance.cwrap('mg_local_date_time_make', 'i32', ['i32', 'i32']);
        let result = new MgLocalDateTime(wrappedFun(seconds, nanoseconds));
        return errorOrValue(result);
    }

    seconds() {
        let wrappedFun =
            instance.cwrap('mg_local_date_time_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    nanoseconds() {
        let wrappedFun =
            instance.cwrap('mg_local_date_time_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgLocalDateTime) {
        let wrappedFun =
            instance.cwrap('mg_local_date_time_copy', 'i32', ['i32']);
        let value =
            new MgLocalDateTime(wrappedFun(mgLocalDateTime.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun =
            instance.cwrap('mg_local_date_time_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgDuration {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    months() {
        let wrappedFun = instance.cwrap('mg_duration_months', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    days() {
        let wrappedFun = instance.cwrap('mg_duration_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    seconds() {
        let wrappedFun = instance.cwrap('mg_duration_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    nanoseconds() {
        let wrappedFun =
            instance.cwrap('mg_duration_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgDuration) {
        let wrappedFun = instance.cwrap('mg_duration_copy', 'i32', ['i32']);
        let result = new MgDuration(wrappedFun(mgDuration.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_duration_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgPoint2D {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    srid() {
        let wrappedFun = instance.cwrap('mg_point_2d_srid', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    x() {
        let wrappedFun = instance.cwrap('mg_point_2d_x', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    y() {
        let wrappedFun = instance.cwrap('mg_point_2d_y', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgPoint2d) {
        let wrappedFun = instance.cwrap('mg_point_2d_copy', 'i32', ['i32']);
        let value = MgPoint2D(wrappedFun(mgPoint2d.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_point_2d_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgPoint3D {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    srid() {
        let wrappedFun = instance.cwrap('mg_point_3d_srid', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    x() {
        let wrappedFun = instance.cwrap('mg_point_3d_x', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    y() {
        let wrappedFun = instance.cwrap('mg_point_3d_y', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    z() {
        let wrappedFun = instance.cwrap('mg_point_3d_z', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgPoint2d) {
        let wrappedFun = instance.cwrap('mg_point_2d_copy', 'i32', ['i32']);
        let result = new MgPoint3D(wrappedFun(mgPoint2d.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        let wrappedFun = instance.cwrap('mg_point_2d_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

class MemoryHandle {
    #memArray;
    constructor() {
        this.#memArray = [];
    }

    alloc(size) {
        let ptr = instance._malloc(size);
        this.#memArray.push(ptr);
        return ptr;
    }

    deallocAll() {
        // deallocate in reverse order
        memArray.slice().reverse().forEach(element => {
            instance_.free(element);
        });
    }
};

export class MgClient {
    #sessionPtr;
    constructor(sessionPtr) {
        this.#sessionPtr = sessionPtr;
    }

    // todo expose ssl
    static async connect(host, port) {
        let mgparamsPtr = instance._mg_session_params_make();
        let mgSessionParamsSetHost = instance.cwrap('mg_session_params_set_host',
            'void', ['number', 'string']);
        mgSessionParamsSetHost(mgparamsPtr, host);
        instance._mg_session_params_set_port(mgparamsPtr, port);
        instance._mg_session_params_set_sslmode(mgparamsPtr, 0);

        let wrappedFun = instance.cwrap('mg_connect', 'number',
            ['number', 'number'], {
                async: true
            });

        let memoryHandle = new MemoryHandle();
        let ptr = memoryHandle.alloc(4);
        let ptrToPtr = memoryHandle.alloc(4);
        instance.setValue(ptrToPtr, ptr, 'i32');

        // todo cancel on error async
        let maybeConnected = await wrappedFun(mgparamsPtr, ptrToPtr);
        if (maybeConnected < 0) {
            memoryHandle.deallocAll();
            return null;
        }
        let sessionPtr = instance.getValue(ptrToPtr, 'i32');

        memoryHandle.deallocAll();
        instance._mg_session_params_destroy(mgparamsPtr);

        return new MgClient(sessionPtr, instance);
    }

    async execute(query) {
        let mgSessionRun = instance.cwrap(
            'mg_session_run', 'number',
            ['number', 'string', 'number', 'number', 'number', 'number'], {
                async: true
            });
        // todo error handling
        let runResult =
            await mgSessionRun(this.#sessionPtr, query, null, null, null, null);
        if (runResult < 0) {
            return false;
        }
        return (this.pull(instance) < 0) ? false : true;
    }

    pull() {
        let pullResult = instance._mg_session_pull(this.#sessionPtr, 0);
        return pullResult;
    }

    async fetchOne() {
        let memoryHandle = new MemoryHandle();
        let mgResult = memoryHandle.alloc(4);
        let ptrMgResult = memoryHandle.alloc(4);
        instance.setValue(ptrMgResult, mgResult, 'i32');
        let wrappedFun = instance.cwrap('mg_session_fetch', 'number',
            ['number', 'number'], {
                async: true
            });
        // todo add error handling when websocket fails
        let result = await wrappedFun(this.#sessionPtr, ptrMgResult);
        // todo fix allocations
        if (result != 1) {
            memoryHandle.deallocAll();
            return null;
        }

        let mgList = resultRow(ptrMgResult);
        memoryHandle.deallocAll();
        return mgList;
    }

    async fetchAll() {
        let arr = [];
        let result;
        while (result = await this.fetchOne()) {
            if (result == null) {
                // clean up
                return null;
            }
            arr.push(result)
        }
        return arr;
    }

    async discardAll() {
        while (await FetchOne())
        ;
    }

    destroySession() {
        instance._mg_session_destroy(this.#sessionPtr);
    }

    async beginTransaction() {
        // check async here
        let wrappedFun = instance.cwrap('mg_session_begin_transaction', 'number',
            ['number', 'number'], {
                async: true
            });
        return wrappedFun(this.#sessionPtr, null) == 0;
    }

    async commitTransaction() {
        let memoryHandle = new MemoryHandle();
        let mgResult = memoryHandle.alloc(4);
        let ptrMgResult = memoryHandle.alloc(4);
        let wrappedFun = instance.cwrap('mg_session_commit_transaction', 'number',
            ['number', 'number'], {
                async: true
            });
        let result = wrappedFun(this.#sessionPtr, ptrMgResult) == 0;
        memoryHandle.deallocAll();
        return result;
    }

    async rollbackTransaction() {
        let memoryHandle = new MemoryHandle();
        let mgResult = memoryHandle._malloc(4);
        let ptrMgResult = memoryHandle._malloc(4);
        let wrappedFun = instance.cwrap('mg_session_rollback_transaction', 'number',
            ['number', 'number'], {
                async: true
            });

        let result = wrappedFun(this.#sessionPtr, ptrMgResult) == 0;
        memoryHandle.deallocAll();
        return result;
    }

    resultRow(mgResult) {
        let wrappedFun =
            instance.cwrap('mg_result_columns', 'number', ['number']);
        return new MgList(wrappedFun(mgResult));
    }

    resultColumns(mgResult) {
        let wrappedFun = instance.cwrap('mg_result_row', 'number', ['number']);
        return new MgList(wrappedFun(mgResult));
    }

    resultSummary(mgResult) {
        let wrappedFun =
            instance.cwrap('mg_result_summary', 'number', ['number']);
        return new MgMap(wrappedFun(mgResult));
    }
};