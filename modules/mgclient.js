//import mgclient wasm here

//todo implement MemoryRegistry
//todo add another abstraction layer to get rid of passing the instance object

export function mgclientVersion(instance) {
    wrapped_fun = instance.cwrap('mg_client_version', 'string');
    returned wrapped_fun();
}

export function mgInit(instance) {
    return instance._mg_init();
}

export function mgClientFinalize(instance) {
    return instance._mg_finalize();
}

class MgValueTypeEnum {
    static MG_VALUE_TYPE_NULL = new MgValueTypeEnum("MG_VALUE_TYPE_NULL");
    static MG_VALUE_TYPE_BOOL = new MgValueTypeEnum("MG_VALUE_TYPE_BOOL");
    static MG_VALUE_TYPE_INTEGER = new MgValueTypeEnum("MG_VALUE_TYPE_INTEGER");
    static MG_VALUE_TYPE_FLOAT = new MgValueTypeEnum("MG_VALUE_TYPE_FLOAT");
    static MG_VALUE_TYPE_STRING = new MgValueTypeEnum("MG_VALUE_TYTPE_STRING");
    static MG_VALUE_TYPE_LIST = new MgValueTypeEnum("MG_VALUE_TYPE_LIST");
    static MG_VALUE_TYPE_MAP = new MgValueTypeEnum("MG_VALUE_TYPE_MAP");
    static MG_VALUE_TYPE_NODE = new MgValueTypeEnum("MG_VALUE_TYPE_NODE");
    static MG_VALUE_TYPE_RELATIONSHIP = new MgValueTypeEnum("MG_VALUE_TYPE_RELATIONSHIP");
    static MG_VALUE_TYPE_UNBOUND_RELATIONSHIP = new MgValueTypeEnum("MG_VALUE_TYPE_UNBOUND_RELATIONSHIP"):
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
}

export class MgValue {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    function getType(instance) {
        wrappedFun = instance.cwrap('mg_value_get_type', 'i32', ['i32']);
        enumValuesArray = Object.keys(MgValueTypeEnum);
        return enumValuesArray[wrappedFun(this.#cPtr)];
    }

    function isNull() {
        return this.#cPtr == 0;
    }

    function getBool(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_BOOL.name) {
            throw "Underline type is not a bool";

        }
        wrapped_fun = instance.cwrap('mg_value_bool', 'i32', ['i32']);
        return new wrappedFun(this.#cPtr);
    }

    function getInteger(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_INTEGER.name) {
            throw "Underline type is not an Integer";
        }
        wrapped_fun = instance.cwrap('mg_value_integer', 'i32', ['i32']);
        return new wrappedFun(this.#cPtr);
    }

    function getFloat(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_FLOAT.name) {
            throw "Underline type is not a Float";
        }
        wrapped_fun = instance.cwrap('mg_value_float', 'i32', ['i32']);
        return new wrappedFun(this.#cPtr);
    }

    function getMgString(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_STRING.name) {
            throw "Underline type is not a String";
        }
        wrapped_fun = instance.cwrap('mg_value_string', 'i32', ['i32']);
        return new MgString(wrappedFun(this.#cPtr));
    }

    function getMgList(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_LIST.name) {
            throw "Underline type is not a MgList";
        }
        wrapped_fun = instance.cwrap('mg_value_list', 'i32', ['i32']);
        return new MgList(wrappedFun(this.#cPtr));
    }

    function getMgMap(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_MAP.name) {
            throw "Underline type is not a MgMap";
        }
        wrapped_fun = instance.cwrap('mg_value_map', 'i32', ['i32']);
        return new MgMap(wrappedFun(this.#cPtr));
    }

    function getMgNode(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_NODE.name) {
            throw "Underline type is not a MgNode";
        }
        wrapped_fun = instance.cwrap('mg_value_node', 'i32', ['i32']);
        return new MgNode(wrappedFun(this.#cPtr));
    }

    function getMgRelationship(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_RELATIONSHIP.name) {
            throw "Underline type is not a MgRelationship";
        }
        wrapped_fun = instance.cwrap('mg_value_relationship', 'i32', ['i32']);
        return new MgRelationship(wrappedFun(this.#cPtr));
    }

    function getMgUnboundRelationship(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_UNBOUND_RELATIONSHIP.name) {
            throw "Underline type is not a MgUnboundRelationship";
        }
        wrapped_fun = instance.cwrap('mg_value_unbound_relationship', 'i32', ['i32']);
        return new MgUnboundRelationship(wrappedFun(this.#cPtr));
    }

    function getMgPath(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_PATH.name) {
            throw "Underline type is not a MgPath";
        }
        wrapped_fun = instance.cwrap('mg_value_path', 'i32', ['i32']);
        return new MgPath(wrappedFun(this.#cPtr));
    }

    function getMgDate(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_DATE.name) {
            throw "Underline type is not a MgDate";
        }
        wrapped_fun = instance.cwrap('mg_value_date', 'i32', ['i32']);
        return new MgDate(wrappedFun(this.#cPtr));
    }

    function getMgTime(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_TIME.name) {
            throw "Underline type is not a MgTime";
        }
        wrapped_fun = instance.cwrap('mg_value_time', 'i32', ['i32']);
        return new MgTime(wrappedFun(this.#cPtr));
    }

    function getMgLocalTime(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_LOCAL_TIME.name) {
            throw "Underline type is not a MgLocalTime";
        }
        wrapped_fun = instance.cwrap('mg_value_local_time', 'i32', ['i32']);
        return new MgLocalTime(wrappedFun(this.#cPtr));
    }

    function getMgDateTime(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_DATE_TIME.name) {
            throw "Underline type is not a MgDateTime";
        }
        wrapped_fun = instance.cwrap('mg_value_date_time', 'i32', ['i32']);
        return new MgDateTime(wrappedFun(this.#cPtr));
    }

    function getMgDateTimeZoneId(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_DATE_TIME_ZONE_ID.name) {
            throw "Underline type is not a MgDateTimeZoneId";
        }
        wrapped_fun = instance.cwrap('mg_value_date_time_zone_id', 'i32', ['i32']);
        return new MgDateTimeZoneId(wrappedFun(this.#cPtr));
    }

    function getMgLocalDateTime(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_LOCAL_DATE_TIME.name) {
            throw "Underline type is not a MgLocalDateTime";
        }
        wrapped_fun = instance.cwrap('mg_value_local_date_time', 'i32', ['i32']);
        return new MgLocalDateTime(wrappedFun(this.#cPtr));
    }

    function getMgDuration(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_DURATION.name) {
            throw "Underline type is not a MgDuration";
        }
        wrapped_fun = instance.cwrap('mg_value_duration', 'i32', ['i32']);
        return new MgDuration(wrappedFun(this.#cPtr));
    }

    function getPoint2D(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_POINT_2D.name) {
            throw "Underline type is not a MgPoint2D";
        }
        wrapped_fun = instance.cwrap('mg_value_point_2d', 'i32', ['i32']);
        return new MgPoint2D(wrappedFun(this.#cPtr));
    }

    function getMgPoint3D(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum::MG_VALUE_TYPE_POINT_3D.name) {
            throw "Underline type is not a MgDuration";
        }
        wrapped_fun = instance.cwrap('mg_value_point_3d', 'i32', ['i32']);
        return new MgLocalPoint3D(wrappedFun(this.#cPtr));
    }

    function copy(instance) {
        wrapped_fun = instance.cwrap('mg_value_copy', 'i32', ['i32']);
        return new MgValue(wrappedFun(this.#cPtr));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_value_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
        return this.#cPtr;
    }

};

export function MgValueMakeNull(instance) {
    return new MgValue(instance._mg_value_make_null());
}

export function MgValueMakeBool(instance, val) {
    return new MgValue(instance._mg_value_make_bool(val));
}

export function MgValueMakeInteger(instance, val) {
    return new MgValue(instance._mg_value_make_integer_(val));
}

export function MgValueMakeFloat(instance, val) {
    return new MgValue(instance._mg_value_make_float(val));
}

export function MgValueMakeString(instance, str) {
    wrapped_fun = instance.cwrap('mg_value_make_string', 'i32', ['string']);
    return new MgValue(wrapped_fun(str));
}

export function MgValueMakeString2(instance, mgString) {
    wrapped_fun = instance.cwrap('mg_value_make_string2', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgString.transferToWasm()));
}

export function MgValueMakeList(instance, mgList) {
    wrapped_fun = instance.cwrap('mg_value_make_list', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgList.transferToWasm()));
}

export function MgValueMakeMap(instance, mgMap) {
    wrapped_fun = instance.cwrap('mg_value_make_map', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgMap.transferToWasm()));
}

export function MgValueMakeNode(instance, mgNode) {
    wrapped_fun = instance.cwrap('mg_value_make_node', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgNode.transferToWasm()));
}

export function MgValueMakeRelationship(instance, mgRelationship) {
    wrapped_fun = instance.cwrap('mg_value_make_relationship', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgRelationship.transferToWasm()));
}

export function MgValueMakeUnboundRelationship(instance, mgValueMakeUnboundRelationship) {
    wrapped_fun = instance.cwrap('mg_value_make_unbound_relationship', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgValueMakeUnboundRelationship.transferToWasm()));
}

export function MgValueMakePath(instance, mgPath) {
    wrapped_fun = instance.cwrap('mg_value_make_path', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgPath.transferToWasm()));
}

export function MgValueMakeDate(instance, mgDate) {
    wrapped_fun = instance.cwrap('mg_value_make_date', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgDate.transferToWasm()));
}

export function MgValueMakeTime(instance, mgTime) {
    wrapped_fun = instance.cwrap('mg_value_make_time', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgTime.transferToWasm()));
}

export function MgValueMakeLocalTime(instance, mgLocalTime) {
    wrapped_fun = instance.cwrap('mg_value_make_local_time', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgLocalTime.transferToWasm()));
}

export function MgValueMakeDateTime(instance, mgDateTime) {
    wrapped_fun = instance.cwrap('mg_value_make_date_time', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgDateTime.transferToWasm()));
}

export function MgValueMakeTimeZoneId(instance, mgDateTimeZoneId) {
    wrapped_fun = instance.cwrap('mg_value_make_date_time_zone_id', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgDateTimeZoneId.transferToWasm()));
}

export function MgValueMakeLocalDateTime(instance, mgLocalDateTime) {
    wrapped_fun = instance.cwrap('mg_value_make_local_date_time', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgLocalDateTime.transferToWasm()));
}

export function MgValueMakeDuration(instance, mgDuration) {
    wrapped_fun = instance.cwrap('mg_value_make_duration', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgDuration.transferToWasm()));
}

export function MgValueMakePoint2d(instance, mgPoint2d) {
    wrapped_fun = instance.cwrap('mg_value_make_point_2d', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgValueMakePoint2d.transferToWasm()));
}

export function MgValueMakePoint3d(instance, mgPoint3D) {
    wrapped_fun = instance.cwrap('mg_value_make_date_time', 'i32', ['i32']);
    return new MgValue(wrappedFun(mgPoint3D.transferToWasm()));
}

export class MgString {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static
    function make(instance, string) {
        wrapped_fun = instance.cwrap('mg_string_make', 'i32', ['string']);
        return MgString(wrappedFun(string));
    }

    function toString(instance) {
        wrapped_fun = instance.cwrap('mg_string_data', 'i32');
        return wrappedFun(this.#cPtr);
    }

    function copy(instance, mgString) {
        wrapped_fun = instance.cwrap('mg_string_copy', 'i32', ['i32']);
        return MgString(wrappedFun(mgString.transferToWasm()));
    }

    function destory(instance) {
        wrapped_fun = instance.cwrap('mg_string_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }
};

export class MgList {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static
    function make(instance, capacity) {
        wrapped_fun = instance.cwrap('mg_list_make_empty', 'i32');
        return MgList(wrappedFun(this.#cPtr));
    }

    function size(instance) {
        wrapped_fun = instance.cwrap('mg_list_size', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    //todo check reference ownership here
    function append(instance, mgValue) {
        wrapped_fun = instance.cwrap('mg_list_append', 'i32', ['i32', 'i32']);
        return wrappedFun(this.#cPtr, mgValue.transferToWasm());
    }

    function at(instance, index) {
        wrapped_fun = instance.cwrap('mg_list_at', 'i32', ['i32']);
        return MgValue(wrappedFun(this.#cPtr));
    }

    function copy(instance) {
        wrapped_fun = instance.cwrap('mg_list_copy', 'i32', ['i32']);
        return MgList(wrappedFun(this.#cPtr)));
}

function destroy(instance) {
    wrapped_fun = instance.cwrap('mg_list_destroy', 'i32');
    return wrappedFun(this.#cPtr);
}

function transferToWasm() {
    return this.#cPtr;
}
};

export class MgMap {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
    static
    function make(instance, capacity) {
        wrapped_fun = instance.cwrap('mg_map_make_empty', 'i32');
        return MgMap(wrappedFun(this.#cPtr));
    }

    function size(instance) {
        wrapped_fun = instance.cwrap('mg_map_size', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function insert(instance, keyString, mgValue) {
        wrapped_fun = instance.cwrap('mg_map_size', 'i32', ['i32', 'string', 'i32']);
        return wrappedFun(this.#cPtr, keyString, mgValue.transferToWasm());
    }

    function insertWithMgStringKey(instance, mgStringKey, mgValue) {
        wrapped_fun = instance.cwrap('mg_map_size', 'i32', ['i32', 'int32', 'i32']);
        return wrappedFun(this.#cPtr, mgStringKey.transferToWasm(), mgValue.transferToWasm());
    }

    //todo check for insert unsafe

    function at(instance, key) {
        wrapped_fun = instance.cwrap('mg_map_at', 'i32', ['i32']);
        return MgValue(wrappedFun(this.#cPtr));
    }

    function copy(instance, mgMap) {
        wrapped_fun = instance.cwrap('mg_map_copy', 'i32', ['i32']);
        return MgMap(wrappedFun(mgMap.transferToWasm()));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_map_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
        return this.#cPtr;
    }
};

export class MgNode {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    function id(instance) {
        wrapped_fun = instance.cwrap('mg_node_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function labelCount(instance) {
        wrapped_fun = instance.cwrap('mg_label_count', 'i32');
        return wrappedFun(this.#cPtr);
    }

    function labelAtPos(instance, pos) {
        wrapped_fun = instance.cwrap('mg_node_label_at', 'i32', ['i32']);
        return MgString(wrappedFun(this.#cPtr, pos));
    }

    //todo check for insert unsafe

    function properties(instance) {
        wrapped_fun = instance.cwrap('mg_node_properties', 'i32');
        return MgMap(wrappedFun(this.#cPtr));
    }

    function copy(instance, mgNode) {
        wrapped_fun = instance.cwrap('mg_node_copy', 'i32', ['i32']);
        return MgNode(wrappedFun(mgNode.transferToWasm()));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_map_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
        return this.#cPtr;
    }
};

export class MgRelationship {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    function id(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function startId(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_start_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function endId(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_end_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function type(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_type', 'i32', ['i32']);
        return MgString(wrappedFun(this.#cPtr));
    }

    function properties(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_properties', 'i32', ['i32']);
        return MgMap(wrappedFun(this.#cPtr, pos));
    }

    function copy(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_copy', 'i32', ['i32']);
        return MgRelationship(wrappedFun(this.#cPtr));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
        return this.#cPtr;
    }
};

export class MgUnboundRelationship {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    function id(instance) {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function type(instance) {
        wrapped_fun = instance.cwrap('mg_unbound_relationship', 'i32', ['i32']);
        return MgString(wrappedFun(this.#cPtr));
    }

    function properties(instance) {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_properties', 'i32', ['i32']);
        return MgMap(wrappedFun(this.#cPtr, pos));
    }

    function copy(instance) {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_copy', 'i32', ['i32']);
        return MgUnboundRelationship(wrappedFun(this.#cPtr));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
        return this.#cPtr;
    }
};

export class MgPath {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    function length(instance) {
        wrapped_fun = instance.cwrap('mg_path_length', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function nodeAt(instance, pos) {
        wrapped_fun = instance.cwrap('mg_path_node_at', 'i32', ['i32', 'i32']);
        return MgNode(wrappedFun(this.#cPtr));
    }

    function relationshipAt(instance, pos) {
        wrapped_fun = instance.cwrap('mg_path_relationship_at', 'i32', ['i32', 'i32']);
        return MgUnboundRelationship(wrappedFun(this.#cPtr, pos));
    }

    function relationshipReversedAt(instance, pos) {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_copy', 'i32', ['i32', 'i32']);
        return wrappedFun(this.#cPtr, pos);
    }

    function copy(instance) {
        wrapped_fun = instance.cwrap('mg_path_copy', 'i32', ['i32']);
        return MgPath(this.#cPtr));
}

function destroy(instance) {
    wrapped_fun = instance.cwrap('mg_path_destroy', 'i32');
    return wrappedFun(this.#cPtr);
}

function transferToWasm() {
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
    function make(instance, days) {
        wrapped_fun = instance.cwrap('mg_date_make', 'i32', ['i32']);
        return MgDate(wrappedFun(days));
    }

    function days(instance) {
        wrapped_fun = instance.cwrap('mg_date_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function copy(instance, mgDate) {
        wrapped_fun = instance.cwrap('mg_date_copy', 'i32', ['i32']);
        return MgDate(wrappedFun(mgDate.transferToWasm()));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_map_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
        return this.#cPtr;
    }
};

export class MgTime {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    function nanoseconds(instance) {
        wrapped_fun = instance.cwrap('mg_time_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function tzOffsetSeconds(instance) {
        wrapped_fun = instance.cwrap('mg_time_tz_offset_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function copy(instance, mgTime) {
        wrapped_fun = instance.cwrap('mg_time_tz_copy', 'i32', ['i32']);
        return MgTime(wrappedFun(mgDate.transferToWasm()));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_map_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
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
    function make(instance, days) {
        wrapped_fun = instance.cwrap('mg_local_time_make', 'i32');
        return MgLocalTime(wrappedFun(days));
    }

    function days(instance) {
        wrapped_fun = instance.cwrap('mg_date_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function copy(instance, mgLocalTime) {
        wrapped_fun = instance.cwrap('mg_local_time_copy', 'i32', ['i32']);
        return MgDate(wrappedFun(mgLocalTime.transferToWasm()));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_local_time_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
        return this.#cPtr;
    }
};

export class MgDateTime {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    function seconds(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function nanoseconds(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function tzOffsetMinutes(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_tz_offset_minutes', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function copy(instance, mgDateTime) {
        wrapped_fun = instance.cwrap('mg_date_time_copy', 'i32', ['i32']);
        return MgDateTime(wrappedFun(mgDateTime.transferToWasm()));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_local_time_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
        return this.#cPtr;
    }
};

export class MgDateTimeZoneId {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    function seconds(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function nanoseconds(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function id(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_tz_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function copy(instance, mgDateTime) {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_copy', 'i32', ['i32']);
        return MgDateTime(wrappedFun(mgDateTime.transferToWasm()));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_destroy', 'i32');
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
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
    function make(instance, seconds, nanoseconds) {
        wrapped_fun = instance.cwrap('mg_local_date_time_make', 'i32', ['i32', 'i32']);
        return MgLocalDateTime(wrappedFun(seconds, nanoseconds));
    }

    function seconds(instance) {
        wrapped_fun = instance.cwrap('mg_local_date_time_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function nanoseconds(instance) {
        wrapped_fun = instance.cwrap('mg_local_date_time_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function copy(instance, mgLocalDateTime) {
        wrapped_fun = instance.cwrap('mg_local_date_time_copy', 'i32', ['i32']);
        return MgLocalDateTime(wrappedFun(mgLocalDateTime.transferToWasm()));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_local_date_time_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
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
    function make(instance, months, days, seconds, nanoseconds) {
        wrapped_fun = instance.cwrap('mg_duration_make', 'i32', ['i32', 'i32', 'i32', 'i32']);
        return MgDuration(wrappedFun(months, days, seconds, nanoseconds));
    }

    function months(instance) {
        wrapped_fun = instance.cwrap('mg_duration_months', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function days(instance) {
        wrapped_fun = instance.cwrap('mg_duration_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function seconds(instance) {
        wrapped_fun = instance.cwrap('mg_duration_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function nanoseconds(instance) {
        wrapped_fun = instance.cwrap('mg_duration_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function copy(instance, mgDuration) {
        wrapped_fun = instance.cwrap('mg_duration_copy', 'i32', ['i32']);
        return MgDuration(wrappedFun(mgDuration.transferToWasm()));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_duration_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
        return this.#cPtr;
    }
};

export class MgPoint2D {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    function srid(instance) {
        wrapped_fun = instance.cwrap('mg_point_2d_srid', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function x(instance) {
        wrapped_fun = instance.cwrap('mg_point_2d_x', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function y(instance) {
        wrapped_fun = instance.cwrap('mg_point_2d_y', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function copy(instance, mgPoint2d) {
        wrapped_fun = instance.cwrap('mg_point_2d_copy', 'i32', ['i32']);
        return MgPoint2D(wrappedFun(mgPoint2d.transferToWasm()));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_point_2d_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
        return this.#cPtr;
    }
};

export class MgPoint3D {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    function srid(instance) {
        wrapped_fun = instance.cwrap('mg_point_3d_srid', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function x(instance) {
        wrapped_fun = instance.cwrap('mg_point_3d_x', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function y(instance) {
        wrapped_fun = instance.cwrap('mg_point_3d_y', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function z(instance) {
        wrapped_fun = instance.cwrap('mg_point_3d_z', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function copy(instance, mgPoint2d) {
        wrapped_fun = instance.cwrap('mg_point_2d_copy', 'i32', ['i32']);
        return MgPoint3D(wrappedFun(mgPoint2d.transferToWasm()));
    }

    function destroy(instance) {
        wrapped_fun = instance.cwrap('mg_point_2d_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    function transferToWasm() {
        return this.#cPtr;
    }
};