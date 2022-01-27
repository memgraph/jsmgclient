//import instance from "../examples/out.js"

class MgResourceManagerInternal {
    #resourceManager;
    constructor() {
        this.#resourceManager = [];
    }

    push(resource) {
        this.#resourceManager.push(resource);
    }

    stopManaging(resource) {
        let index = this.resourceManager.findIndex(resource);
        if (index == -1) {
            throw "Internal error";
        }
        this.#resourceManager.splice(index, 1);
    }

    releaseAll() {
        //deallocate in reverse order
        this.#resourceManager.reverse().forEach(element => {
            element.destroy();
        });
        this.#resourceManager = [];
    }
};

let resourceManager = new MgResourceManagerInternal();

function errorOrValue(value) {
    if (value.transferToWasm() == null) {
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

export class MgValueTypeEnum {
    static MG_VALUE_TYPE_NULL = new MgValueTypeEnum("MG_VALUE_TYPE_NULL");
    static MG_VALUE_TYPE_BOOL = new MgValueTypeEnum("MG_VALUE_TYPE_BOOL");
    static MG_VALUE_TYPE_INTEGER = new MgValueTypeEnum("MG_VALUE_TYPE_INTEGER");
    static MG_VALUE_TYPE_FLOAT = new MgValueTypeEnum("MG_VALUE_TYPE_FLOAT");
    static MG_VALUE_TYPE_STRING = new MgValueTypeEnum("MG_VALUE_TYTPE_STRING");
    static MG_VALUE_TYPE_LIST = new MgValueTypeEnum("MG_VALUE_TYPE_LIST");
    static MG_VALUE_TYPE_MAP = new MgValueTypeEnum("MG_VALUE_TYPE_MAP");
    static MG_VALUE_TYPE_NODE = new MgValueTypeEnum("MG_VALUE_TYPE_NODE");
    static MG_VALUE_TYPE_RELATIONSHIP = new MgValueTypeEnum("MG_VALUE_TYPE_RELATIONSHIP");
    static MG_VALUE_TYPE_UNBOUND_RELATIONSHIP = new MgValueTypeEnum("MG_VALUE_TYPE_UNBOUND_RELATIONSHIP");
    static MG_VALUE_TYPE_PATH = new MgValueTypeEnum("MG_VALUE_TYPE_PATH");
    static MG_VALUE_TYPE_DATE = new MgValueTypeEnum("MG_VALUE_TYPE_DATE");
    static MG_VALUE_TYPE_TIME = new MgValueTypeEnum("MG_VALUE_TYPE_TIME");
    static MG_VALUE_TYPE_LOCAL_TIME = new MgValueTypeEnum("MG_VALUE_TYPE_LOCAL_TIME");
    static MG_VALUE_TYPE_DATE_TIME = new MgValueTypeEnum("MG_CALUE_TYPE_DATE_TIME");
    static MG_VALUE_TYPE_DATE_TIME_ZONE_ID = new MgValueTypeEnum("MG_VALUE_TYPE_DATE_TIME");
    static MG_VALUE_TYPE_LOCAL_DATE_TIME = new MgValueTypeEnum("MG_VALUE_TYPE_LOCAL_DATE_TIME");
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
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    getType() {
        wrappedFun = instance.cwrap('mg_value_get_type', 'i32', ['i32']);
        enumValuesArray = Object.keys(MgValueTypeEnum);
        return enumValuesArray[wrappedFun(this.#cPtr)];
    }

    isNull() {
        return this.#cPtr == 0;
    }

    getBool() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_BOOL.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_bool', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    getInteger() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_INTEGER.name) {
            return null
        }
        wrapped_fun = instance.cwrap('mg_value_integer', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    getFloat() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_FLOAT.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_float', 'i32', ['i32']);
        return new wrappedFun(this.#cPtr);
    }

    getMgString() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_STRING.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_string', 'i32', ['i32']);
        return new MgString(wrappedFun(this.#cPtr));
    }

    getMgList() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_LIST.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_list', 'i32', ['i32']);
        return new MgList(wrappedFun(this.#cPtr));
    }

    getMgMap() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_MAP.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_map', 'i32', ['i32']);
        return new MgMap(wrappedFun(this.#cPtr));
    }

    getMgNode() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_NODE.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_node', 'i32', ['i32']);
        return new MgNode(wrappedFun(this.#cPtr));
    }

    getMgRelationship() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_RELATIONSHIP.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_relationship', 'i32', ['i32']);
        return new MgRelationship(wrappedFun(this.#cPtr));
    }

    getMgUnboundRelationship() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_UNBOUND_RELATIONSHIP.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_unbound_relationship', 'i32', ['i32']);
        return new MgUnboundRelationship(wrappedFun(this.#cPtr));
    }

    getMgPath() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_PATH.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_path', 'i32', ['i32']);
        return new MgPath(wrappedFun(this.#cPtr));
    }

    getMgDate() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DATE.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_date', 'i32', ['i32']);
        return new MgDate(wrappedFun(this.#cPtr));
    }

    getMgTime() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_TIME.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_time', 'i32', ['i32']);
        return new MgTime(wrappedFun(this.#cPtr));
    }

    getMgLocalTime() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_LOCAL_TIME.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_local_time', 'i32', ['i32']);
        return new MgLocalTime(wrappedFun(this.#cPtr));
    }

    getMgDateTime() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DATE_TIME.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_date_time', 'i32', ['i32']);
        return new MgDateTime(wrappedFun(this.#cPtr));
    }

    getMgDateTimeZoneId() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DATE_TIME_ZONE_ID.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_date_time_zone_id', 'i32', ['i32']);
        return new MgDateTimeZoneId(wrappedFun(this.#cPtr));
    }

    getMgLocalDateTime() {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_LOCAL_DATE_TIME.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_local_date_time', 'i32', ['i32']);
        return new MgLocalDateTime(wrappedFun(this.#cPtr));
    }

    getMgDuration(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DURATION.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_duration', 'i32', ['i32']);
        return new MgDuration(wrappedFun(this.#cPtr));
    }

    getPoint2D(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_POINT_2D.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_point_2d', 'i32', ['i32']);
        return new MgPoint2D(wrappedFun(this.#cPtr));
    }

    getMgPoint3D(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_POINT_3D.name) {
            return null;
        }
        wrapped_fun = instance.cwrap('mg_value_point_3d', 'i32', ['i32']);
        return new MgLocalPoint3D(wrappedFun(this.#cPtr));
    }

    copy(instance) {
        wrapped_fun = instance.cwrap('mg_value_copy', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy(instance) {
        wrapped_fun = instance.cwrap('mg_value_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }

    static
    function makeNull() {
        let result = new MgValue(instance._mg_value_make_null());
        return errorOrValue(result);
    }

    static
    function makeBool(val) {
        let result = new MgValue(instance._mg_value_make_bool(val));
        return errorOrValue(result);
    }

    static
    function makeInteger(val) {
        let result = new MgValue(instance._mg_value_make_integer_(val));
        return errorOrValue(result);
    }

    static
    function makeFloat(val) {
        let result = new MgValue(instance._mg_value_make_float(val));
        return errorOrValue(result);
    }

    static
    function makeString(str) {
        wrapped_fun = instance.cwrap('mg_value_make_string', 'i32', ['string']);
        let result = new MgValue(wrapped_fun(str));
        return errorOrValue(result);
    }

    static
    function makeString2(mgString) {
        wrapped_fun = instance.cwrap('mg_value_make_string2', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgString.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function makeList(mgList) {
        wrapped_fun = instance.cwrap('mg_value_make_list', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgList.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function makeMap(mgMap) {
        wrapped_fun = instance.cwrap('mg_value_make_map', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgMap.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function makeNode(mgNode) {
        wrapped_fun = instance.cwrap('mg_value_make_node', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgNode.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function makeRelationship(mgRelationship) {
        wrapped_fun = instance.cwrap('mg_value_make_relationship', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgRelationship.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function makeUnboundRelationship(mgValueMakeUnboundRelationship) {
        wrapped_fun = instance.cwrap('mg_value_make_unbound_relationship', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgValueMakeUnboundRelationship.transferToWasm()));
        return value;
    }

    static
    function MgValueMakePath(mgPath) {
        wrapped_fun = instance.cwrap('mg_value_make_path', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgPath.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function MgValueMakeDate(mgDate) {
        wrapped_fun = instance.cwrap('mg_value_make_date', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgDate.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function MgValueMakeTime(mgTime) {
        wrapped_fun = instance.cwrap('mg_value_make_time', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgTime.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function MgValueMakeLocalTime(mgLocalTime) {
        wrapped_fun = instance.cwrap('mg_value_make_local_time', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgLocalTime.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function MgValueMakeDateTime(mgDateTime) {
        wrapped_fun = instance.cwrap('mg_value_make_date_time', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgDateTime.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function MgValueMakeTimeZoneId(mgDateTimeZoneId) {
        wrapped_fun = instance.cwrap('mg_value_make_date_time_zone_id', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgDateTimeZoneId.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function MgValueMakeLocalDateTime(mgLocalDateTime) {
        wrapped_fun = instance.cwrap('mg_value_make_local_date_time', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgLocalDateTime.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function MgValueMakeDuration(mgDuration) {
        wrapped_fun = instance.cwrap('mg_value_make_duration', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgDuration.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function MgValueMakePoint2d(mgPoint2d) {
        wrapped_fun = instance.cwrap('mg_value_make_point_2d', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgValueMakePoint2d.transferToWasm()));
        return errorOrValue(result);
    }

    static
    function MgValueMakePoint3d(mgPoint3D) {
        wrapped_fun = instance.cwrap('mg_value_make_date_time', 'i32', ['i32']);
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
        wrapped_fun = instance.cwrap('mg_string_make', 'i32', ['string']);
        let result = new MgString(wrappedFun(string));
        return errorOrValue(result);
    }

    toString() {
        wrapped_fun = instance.cwrap('mg_string_data', 'i32');
        return wrappedFun(this.#cPtr);
    }

    copy(mgString) {
        wrapped_fun = instance.cwrap('mg_string_copy', 'i32', ['i32']);
        let result = new MgString(wrappedFun(mgString.transferToWasm()));
        return errorOrValue(result);
    }

    destory() {
        wrapped_fun = instance.cwrap('mg_string_destroy', 'i32');
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

    static
    make(capacity) {
        wrapped_fun = instance.cwrap('mg_list_make_empty', 'i32');
        let result = new MgList(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    size() {
        wrapped_fun = instance.cwrap('mg_list_size', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    //todo check reference ownership here
    append(mgValue) {
        wrapped_fun = instance.cwrap('mg_list_append', 'i32', ['i32', 'i32']);
        let result = wrappedFun(this.#cPtr, mgValue.transferToWasm());
        if (result == 0) {
            resourceManager.stopManaging(result);
        }
        return result;

    }

    at(index) {
        wrapped_fun = instance.cwrap('mg_list_at', 'i32', ['i32']);
        return new MgValue(wrappedFun(this.#cPtr));
    }

    copy() {
        wrapped_fun = instance.cwrap('mg_list_copy', 'i32', ['i32']);
        let result = MgList(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_list_destroy', 'i32');
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

    static
    make(capacity) {
        wrapped_fun = instance.cwrap('mg_map_make_empty', 'i32');
        let result = new MgMap(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    size() {
        wrapped_fun = instance.cwrap('mg_map_size', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    insert(keyString, mgValue) {
        wrapped_fun = instance.cwrap('mg_map_insert', 'i32', ['i32', 'string', 'i32']);
        let result = wrappedFun(this.#cPtr, keyString, mgValue.transferToWasm());
        if (result == 0) {
            resourceManager.stopManaging(mgValue);
        }
        return result;
    }

    insertWithMgStringKey(mgStringKey, mgValue) {
        wrapped_fun = instance.cwrap('mg_map_insert2', 'i32', ['i32', 'int32', 'i32']);
        let result = wrappedFun(this.#cPtr, mgStringKey.transferToWasm(), mgValue.transferToWasm());
        if (result == 0) {
            resourceManager.stopManaging(mgValue);
            resourceManager.stopManaging(mgStringKey);
        }
        return result;
    }

    //todo check for insert unsafe
    at(key) {
        wrapped_fun = instance.cwrap('mg_map_at', 'i32', ['i32']);
        return new MgValue(wrappedFun(this.#cPtr));
    }

    copy(mgMap) {
        wrapped_fun = instance.cwrap('mg_map_copy', 'i32', ['i32']);
        let result = MgMap(wrappedFun(mgMap.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_map_destroy', 'i32');
        return wrappedFun(this.#cPtr);
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

    id() {
        wrapped_fun = instance.cwrap('mg_node_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    labelCount() {
        wrapped_fun = instance.cwrap('mg_label_count', 'i32');
        return wrappedFun(this.#cPtr);
    }

    labelAtPos(pos) {
        wrapped_fun = instance.cwrap('mg_node_label_at', 'i32', ['i32']);
        return new MgString(wrappedFun(this.#cPtr, pos));
    }

    //todo check for insert unsafe

    properties() {
        wrapped_fun = instance.cwrap('mg_node_properties', 'i32');
        return new MgMap(wrappedFun(this.#cPtr));
    }

    copy(mgNode) {
        wrapped_fun = instance.cwrap('mg_node_copy', 'i32', ['i32']);
        let result = MgNode(wrappedFun(mgNode.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_map_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgRelationship {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    id() {
        wrapped_fun = instance.cwrap('mg_relationship_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    startId() {
        wrapped_fun = instance.cwrap('mg_relationship_start_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    endId() {
        wrapped_fun = instance.cwrap('mg_relationship_end_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    type() {
        wrapped_fun = instance.cwrap('mg_relationship_type', 'i32', ['i32']);
        return new MgString(wrappedFun(this.#cPtr));
    }

    properties() {
        wrapped_fun = instance.cwrap('mg_relationship_properties', 'i32', ['i32']);
        return new MgMap(wrappedFun(this.#cPtr, pos));
    }

    copy() {
        wrapped_fun = instance.cwrap('mg_relationship_copy', 'i32', ['i32']);
        let result = MgRelationship(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_relationship_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgUnboundRelationship {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    id() {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    type() {
        wrapped_fun = instance.cwrap('mg_unbound_relationship', 'i32', ['i32']);
        return new MgString(wrappedFun(this.#cPtr));
    }

    properties() {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_properties', 'i32', ['i32']);
        return new MgMap(wrappedFun(this.#cPtr, pos));
    }

    copy() {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_copy', 'i32', ['i32']);
        let result = new MgUnboundRelationship(wrappedFun(this.#cPtr));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgPath {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    length() {
        wrapped_fun = instance.cwrap('mg_path_length', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    nodeAt(pos) {
        wrapped_fun = instance.cwrap('mg_path_node_at', 'i32', ['i32', 'i32']);
        return new MgNode(wrappedFun(this.#cPtr));
    }

    relationshipAt(pos) {
        wrapped_fun = instance.cwrap('mg_path_relationship_at', 'i32', ['i32', 'i32']);
        return MgUnboundRelationship(wrappedFun(this.#cPtr, pos));
    }

    relationshipReversedAt(pos) {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_copy', 'i32', ['i32', 'i32']);
        return wrappedFun(this.#cPtr, pos);
    }

    copy() {
        wrapped_fun = instance.cwrap('mg_path_copy', 'i32', ['i32']);
        let result = new MgPath(this.#cPtr);
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_path_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgDate {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static
    make(days) {
        wrapped_fun = instance.cwrap('mg_date_make', 'i32', ['i32']);
        let result = new MgDate(wrappedFun(days));
        return errorOrValue(result);
    }

    days() {
        wrapped_fun = instance.cwrap('mg_date_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgDate) {
        wrapped_fun = instance.cwrap('mg_date_copy', 'i32', ['i32']);
        let result = new MgDate(wrappedFun(mgDate.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_map_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgTime {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    nanoseconds() {
        wrapped_fun = instance.cwrap('mg_time_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    tzOffsetSeconds() {
        wrapped_fun = instance.cwrap('mg_time_tz_offset_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgTime) {
        wrapped_fun = instance.cwrap('mg_time_tz_copy', 'i32', ['i32']);
        let result = new MgTime(wrappedFun(mgDate.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_map_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgLocalTime {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static
    make(days) {
        wrapped_fun = instance.cwrap('mg_local_time_make', 'i32');
        let result = MgLocalTime(wrappedFun(days));
        return errorOrValue(result);
    }

    days() {
        wrapped_fun = instance.cwrap('mg_date_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgLocalTime) {
        wrapped_fun = instance.cwrap('mg_local_time_copy', 'i32', ['i32']);
        return MgDate(wrappedFun(mgLocalTime.transferToWasm()));
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_local_time_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgDateTime {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    seconds() {
        wrapped_fun = instance.cwrap('mg_date_time_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    nanoseconds() {
        wrapped_fun = instance.cwrap('mg_date_time_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    tzOffsetMinutes() {
        wrapped_fun = instance.cwrap('mg_date_time_tz_offset_minutes', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgDateTime) {
        wrapped_fun = instance.cwrap('mg_date_time_copy', 'i32', ['i32']);
        let result = new MgDateTime(wrappedFun(mgDateTime.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_local_time_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgDateTimeZoneId {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    seconds() {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    nanoseconds() {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    id() {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_tz_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgDateTime) {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_copy', 'i32', ['i32']);
        let result = new MgDateTime(wrappedFun(mgDateTime.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgLocalDateTime {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static
    make(seconds, nanoseconds) {
        wrapped_fun = instance.cwrap('mg_local_date_time_make', 'i32', ['i32', 'i32']);
        let result = new MgLocalDateTime(wrappedFun(seconds, nanoseconds));
        return errorOrValue(result);
    }

    seconds() {
        wrapped_fun = instance.cwrap('mg_local_date_time_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    nanoseconds() {
        wrapped_fun = instance.cwrap('mg_local_date_time_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgLocalDateTime) {
        wrapped_fun = instance.cwrap('mg_local_date_time_copy', 'i32', ['i32']);
        let value = new MgLocalDateTime(wrappedFun(mgLocalDateTime.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_local_date_time_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgDuration {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static
    make(months, days, seconds, nanoseconds) {
        wrapped_fun = instance.cwrap('mg_duration_make', 'i32', ['i32', 'i32', 'i32', 'i32']);
        let result = MgDuration(wrappedFun(months, days, seconds, nanoseconds));
        return errorOrValue(result);
    }

    months() {
        wrapped_fun = instance.cwrap('mg_duration_months', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    days() {
        wrapped_fun = instance.cwrap('mg_duration_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    seconds() {
        wrapped_fun = instance.cwrap('mg_duration_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    nanoseconds() {
        wrapped_fun = instance.cwrap('mg_duration_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgDuration) {
        wrapped_fun = instance.cwrap('mg_duration_copy', 'i32', ['i32']);
        let result = new MgDuration(wrappedFun(mgDuration.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_duration_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgPoint2D {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    srid() {
        wrapped_fun = instance.cwrap('mg_point_2d_srid', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    x() {
        wrapped_fun = instance.cwrap('mg_point_2d_x', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    y() {
        wrapped_fun = instance.cwrap('mg_point_2d_y', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgPoint2d) {
        wrapped_fun = instance.cwrap('mg_point_2d_copy', 'i32', ['i32']);
        let value = MgPoint2D(wrappedFun(mgPoint2d.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_point_2d_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgPoint3D {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    srid() {
        wrapped_fun = instance.cwrap('mg_point_3d_srid', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    x() {
        wrapped_fun = instance.cwrap('mg_point_3d_x', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    y() {
        wrapped_fun = instance.cwrap('mg_point_3d_y', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    z() {
        wrapped_fun = instance.cwrap('mg_point_3d_z', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    copy(mgPoint2d) {
        wrapped_fun = instance.cwrap('mg_point_2d_copy', 'i32', ['i32']);
        let result = new MgPoint3D(wrappedFun(mgPoint2d.transferToWasm()));
        return errorOrValue(result);
    }

    destroy() {
        wrapped_fun = instance.cwrap('mg_point_2d_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    transferToWasm() {
        return this.#cPtr;
    }
};

class MemoryHandle {
    #memArray;
    constructor(arr) {
        this.#memArray = arr;
    }
    releaseAll() {
        //deallocate in reverse order
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

    //todo expose ssl
    static async connect(host, port) {
        let mgparamsPtr = wasmInstance._mg_session_params_make();
        let mgSessionParamsSetHost = wasm.instance.cwrap('mg_session_params_set_host', 'void', ['number', 'string']);
        mgSessionParamsSetHost(mgparamsPtr, host);
        wasmInstance._mg_session_params_set_port(mgparamsPtr, port);
        wasmInstance._mg_session_params_set_sslmode(mgparamsPtr, 0);

        let wrappedFun = instance.cwrap('mg_connect',
            'number',
            ['number', 'number'], {
                async: true
            });

        let ptr = instance._malloc(4);
        let ptrToPtr = instance._malloc(4);
        instance.setValue(ptrToPtr, ptr, 'i32');
        let memoryHandle = new MemoryHandle([ptr, ptrToPtr], instance);

        //todo cancel on error async
        let maybeConnected = await wrappedFun(mgparamsPtr, ptrToPtr);
        if (maybeConnected < 0) {
            memoryHandle.releaseAll();
            return null;
        }
        let sessionPtr = instance.getValue(ptrToPtr, 'i32');

        memoryHandle.releaseAll();
        instance._mg_session_params_destroy(mgparamsPtr);

        return new MgClient(sessionPtr, instance);
    }

    async execute(query) {
        let mgSessionRun = instance.cwrap('mg_session_run',
            'number',
            ['number', 'string', 'number', 'number', 'number', 'number'], {
                async: true
            });
        //todo error handling
        let runResult = await mgSessionRun(this.#sessionPtr, query, null, null, null, null);
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
        let mgResult = instance._malloc(4);
        let ptrMgResult = instance._malloc(4);
        let memoryHandle = new MemoryHandle([mgResult, ptrMgResult], instance);
        instance.setValue(ptrMgResult, mgResult, 'i32');
        let wrappedFun = instance.cwrap('mg_session_fetch', 'number', ['number', 'number'], {
            async: true
        });
        //todo add error handling when websocket fails
        let result = await wrappedFun(this.#sessionPtr, ptrMgResult);
        //todo fix allocations
        if (result != 1) {
            memoryHandle.releaseAll();
            return null;
        }

        let mgList = resultRow(ptrMgResult);
        //        let arr = [];
        //        for (let i = 0; i < mgList.size(); ++i) {
        //            arr.push(mgList.at(i));
        //        }
        memoryHandle.releaseAll();
        return mgList;
    }

    async fetchAll() {
        let arr = [];
        let result;
        while (result = await this.fetchOne()) {
            if (result == null) {
                //clean up
                return null;
            }
            arr.push(result)
        }
        return arr;
    }

    async discardAll() {
        while (await FetchOne());
    }

    destroySession() {
        instance._mg_session_destroy(this.#sessionPtr);
    }

    async beginTransaction() {
        //check async here
        let wrappedFun = instance.cwrap('mg_session_begin_transaction', 'number', ['number', 'number'], {
            async: true
        });
        return wrappedFun(this.#sessionPtr, null) == 0;
    }

    async commitTransaction() {
        let mgResult = instance._malloc(4);
        let ptrMgResult = instance._malloc(4);
        let memoryHandle = new MemoryHandle([mgResult, ptrMgResult], instance);
        let wrappedFun = instance.cwrap('mg_session_commit_transaction', 'number', ['number', 'number'], {
            async: true
        });
        let result = wrappedFun(this.#sessionPtr, ptrMgResult) == 0;
        memoryHandle.releaseAll();
        return result;
    }

    async rollbackTransaction() {
        let mgResult = instance._malloc(4);
        let ptrMgResult = instance._malloc(4);
        let memoryHandle = new MemoryHandle([mgResult, ptrMgResult], instance);
        let wrappedFun = instance.cwrap('mg_session_rollback_transaction', 'number', ['number', 'number'], {
            async: true
        });

        let result = wrappedFun(this.#sessionPtr, ptrMgResult) == 0;
        memoryHandle.releaseAll();
        return result;
    }

    resultRow(mgResult) {
        let wrappedFun = instance.cwrap('mg_result_columns', 'number', ['number']);
        return new MgList(wrappedFun(mgResult));
    }

    resultColumns(mgResult) {
        let wrappedFun = instance.cwrap('mg_result_row', 'number', ['number']);
        return new MgList(wrappedFun(mgResult));
    }

    resultSummary(mgResult) {
        let wrappedFun = instance.cwrap('mg_result_summary', 'number', ['number']);
        return new MgMap(wrappedFun(mgResult));
    }
};