//import instance from "../examples/out.js"

//todo implement MemoryRegistry
//todo add another abstraction layer to get rid of passing the instance object

export function mgclientVersion(instance) {
    let wrappedFun = instance.cwrap('mg_client_version', 'string');
    return wrappedFun();
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

    getType(instance) {
        wrappedFun = instance.cwrap('mg_value_get_type', 'i32', ['i32']);
        enumValuesArray = Object.keys(MgValueTypeEnum);
        return enumValuesArray[wrappedFun(this.#cPtr)];
    }

     isNull() {
        return this.#cPtr == 0;
    }

     getBool(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_BOOL.name) {
            throw "Underline type is not a bool";

        }
        wrapped_fun = instance.cwrap('mg_value_bool', 'i32', ['i32']);
        return new wrappedFun(this.#cPtr);
    }

     getInteger(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_INTEGER.name) {
            throw "Underline type is not an Integer";
        }
        wrapped_fun = instance.cwrap('mg_value_integer', 'i32', ['i32']);
        return new wrappedFun(this.#cPtr);
    }

     getFloat(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_FLOAT.name) {
            throw "Underline type is not a Float";
        }
        wrapped_fun = instance.cwrap('mg_value_float', 'i32', ['i32']);
        return new wrappedFun(this.#cPtr);
    }

     getMgString(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_STRING.name) {
            throw "Underline type is not a String";
        }
        wrapped_fun = instance.cwrap('mg_value_string', 'i32', ['i32']);
        return new MgString(wrappedFun(this.#cPtr));
    }

     getMgList(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_LIST.name) {
            throw "Underline type is not a MgList";
        }
        wrapped_fun = instance.cwrap('mg_value_list', 'i32', ['i32']);
        return new MgList(wrappedFun(this.#cPtr));
    }

     getMgMap(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_MAP.name) {
            throw "Underline type is not a MgMap";
        }
        wrapped_fun = instance.cwrap('mg_value_map', 'i32', ['i32']);
        return new MgMap(wrappedFun(this.#cPtr));
    }

     getMgNode(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_NODE.name) {
            throw "Underline type is not a MgNode";
        }
        wrapped_fun = instance.cwrap('mg_value_node', 'i32', ['i32']);
        return new MgNode(wrappedFun(this.#cPtr));
    }

     getMgRelationship(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_RELATIONSHIP.name) {
            throw "Underline type is not a MgRelationship";
        }
        wrapped_fun = instance.cwrap('mg_value_relationship', 'i32', ['i32']);
        return new MgRelationship(wrappedFun(this.#cPtr));
    }

     getMgUnboundRelationship(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_UNBOUND_RELATIONSHIP.name) {
            throw "Underline type is not a MgUnboundRelationship";
        }
        wrapped_fun = instance.cwrap('mg_value_unbound_relationship', 'i32', ['i32']);
        return new MgUnboundRelationship(wrappedFun(this.#cPtr));
    }

     getMgPath(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_PATH.name) {
            throw "Underline type is not a MgPath";
        }
        wrapped_fun = instance.cwrap('mg_value_path', 'i32', ['i32']);
        return new MgPath(wrappedFun(this.#cPtr));
    }

     getMgDate(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DATE.name) {
            throw "Underline type is not a MgDate";
        }
        wrapped_fun = instance.cwrap('mg_value_date', 'i32', ['i32']);
        return new MgDate(wrappedFun(this.#cPtr));
    }

     getMgTime(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_TIME.name) {
            throw "Underline type is not a MgTime";
        }
        wrapped_fun = instance.cwrap('mg_value_time', 'i32', ['i32']);
        return new MgTime(wrappedFun(this.#cPtr));
    }

     getMgLocalTime(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_LOCAL_TIME.name) {
            throw "Underline type is not a MgLocalTime";
        }
        wrapped_fun = instance.cwrap('mg_value_local_time', 'i32', ['i32']);
        return new MgLocalTime(wrappedFun(this.#cPtr));
    }

     getMgDateTime(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DATE_TIME.name) {
            throw "Underline type is not a MgDateTime";
        }
        wrapped_fun = instance.cwrap('mg_value_date_time', 'i32', ['i32']);
        return new MgDateTime(wrappedFun(this.#cPtr));
    }

     getMgDateTimeZoneId(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DATE_TIME_ZONE_ID.name) {
            throw "Underline type is not a MgDateTimeZoneId";
        }
        wrapped_fun = instance.cwrap('mg_value_date_time_zone_id', 'i32', ['i32']);
        return new MgDateTimeZoneId(wrappedFun(this.#cPtr));
    }

     getMgLocalDateTime(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_LOCAL_DATE_TIME.name) {
            throw "Underline type is not a MgLocalDateTime";
        }
        wrapped_fun = instance.cwrap('mg_value_local_date_time', 'i32', ['i32']);
        return new MgLocalDateTime(wrappedFun(this.#cPtr));
    }

     getMgDuration(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DURATION.name) {
            throw "Underline type is not a MgDuration";
        }
        wrapped_fun = instance.cwrap('mg_value_duration', 'i32', ['i32']);
        return new MgDuration(wrappedFun(this.#cPtr));
    }

     getPoint2D(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_POINT_2D.name) {
            throw "Underline type is not a MgPoint2D";
        }
        wrapped_fun = instance.cwrap('mg_value_point_2d', 'i32', ['i32']);
        return new MgPoint2D(wrappedFun(this.#cPtr));
    }

     getMgPoint3D(instance) {
        type = this.getType(instance);
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_POINT_3D.name) {
            throw "Underline type is not a MgDuration";
        }
        wrapped_fun = instance.cwrap('mg_value_point_3d', 'i32', ['i32']);
        return new MgLocalPoint3D(wrappedFun(this.#cPtr));
    }

     copy(instance) {
        wrapped_fun = instance.cwrap('mg_value_copy', 'i32', ['i32']);
        return new MgValue(wrappedFun(this.#cPtr));
    }

     destroy(instance) {
        wrapped_fun = instance.cwrap('mg_value_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     transferToWasm() {
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

    static make(instance, string) {
        wrapped_fun = instance.cwrap('mg_string_make', 'i32', ['string']);
        return MgString(wrappedFun(string));
    }

     toString(instance) {
        wrapped_fun = instance.cwrap('mg_string_data', 'i32');
        return wrappedFun(this.#cPtr);
    }

     copy(instance, mgString) {
        wrapped_fun = instance.cwrap('mg_string_copy', 'i32', ['i32']);
        return MgString(wrappedFun(mgString.transferToWasm()));
    }

     destory(instance) {
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
     make(instance, capacity) {
        wrapped_fun = instance.cwrap('mg_list_make_empty', 'i32');
        return MgList(wrappedFun(this.#cPtr));
    }

     size(instance) {
        wrapped_fun = instance.cwrap('mg_list_size', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    //todo check reference ownership here
     append(instance, mgValue) {
        wrapped_fun = instance.cwrap('mg_list_append', 'i32', ['i32', 'i32']);
        return wrappedFun(this.#cPtr, mgValue.transferToWasm());
    }

     at(instance, index) {
        wrapped_fun = instance.cwrap('mg_list_at', 'i32', ['i32']);
        return MgValue(wrappedFun(this.#cPtr));
    }

     copy(instance) {
        wrapped_fun = instance.cwrap('mg_list_copy', 'i32', ['i32']);
        return MgList(wrappedFun(this.#cPtr));
}

 destroy(instance) {
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
     make(instance, capacity) {
        wrapped_fun = instance.cwrap('mg_map_make_empty', 'i32');
        return MgMap(wrappedFun(this.#cPtr));
    }

     size(instance) {
        wrapped_fun = instance.cwrap('mg_map_size', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     insert(instance, keyString, mgValue) {
        wrapped_fun = instance.cwrap('mg_map_size', 'i32', ['i32', 'string', 'i32']);
        return wrappedFun(this.#cPtr, keyString, mgValue.transferToWasm());
    }

     insertWithMgStringKey(instance, mgStringKey, mgValue) {
        wrapped_fun = instance.cwrap('mg_map_size', 'i32', ['i32', 'int32', 'i32']);
        return wrappedFun(this.#cPtr, mgStringKey.transferToWasm(), mgValue.transferToWasm());
    }

    //todo check for insert unsafe

     at(instance, key) {
        wrapped_fun = instance.cwrap('mg_map_at', 'i32', ['i32']);
        return MgValue(wrappedFun(this.#cPtr));
    }

     copy(instance, mgMap) {
        wrapped_fun = instance.cwrap('mg_map_copy', 'i32', ['i32']);
        return MgMap(wrappedFun(mgMap.transferToWasm()));
    }

     destroy(instance) {
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

     id(instance) {
        wrapped_fun = instance.cwrap('mg_node_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     labelCount(instance) {
        wrapped_fun = instance.cwrap('mg_label_count', 'i32');
        return wrappedFun(this.#cPtr);
    }

     labelAtPos(instance, pos) {
        wrapped_fun = instance.cwrap('mg_node_label_at', 'i32', ['i32']);
        return MgString(wrappedFun(this.#cPtr, pos));
    }

    //todo check for insert unsafe

     properties(instance) {
        wrapped_fun = instance.cwrap('mg_node_properties', 'i32');
        return MgMap(wrappedFun(this.#cPtr));
    }

     copy(instance, mgNode) {
        wrapped_fun = instance.cwrap('mg_node_copy', 'i32', ['i32']);
        return MgNode(wrappedFun(mgNode.transferToWasm()));
    }

     destroy(instance) {
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

     id(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     startId(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_start_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     endId(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_end_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     type(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_type', 'i32', ['i32']);
        return MgString(wrappedFun(this.#cPtr));
    }

     properties(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_properties', 'i32', ['i32']);
        return MgMap(wrappedFun(this.#cPtr, pos));
    }

     copy(instance) {
        wrapped_fun = instance.cwrap('mg_relationship_copy', 'i32', ['i32']);
        return MgRelationship(wrappedFun(this.#cPtr));
    }

     destroy(instance) {
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

     id(instance) {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     type(instance) {
        wrapped_fun = instance.cwrap('mg_unbound_relationship', 'i32', ['i32']);
        return MgString(wrappedFun(this.#cPtr));
    }

     properties(instance) {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_properties', 'i32', ['i32']);
        return MgMap(wrappedFun(this.#cPtr, pos));
    }

     copy(instance) {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_copy', 'i32', ['i32']);
        return MgUnboundRelationship(wrappedFun(this.#cPtr));
    }

     destroy(instance) {
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

     length(instance) {
        wrapped_fun = instance.cwrap('mg_path_length', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     nodeAt(instance, pos) {
        wrapped_fun = instance.cwrap('mg_path_node_at', 'i32', ['i32', 'i32']);
        return MgNode(wrappedFun(this.#cPtr));
    }

     relationshipAt(instance, pos) {
        wrapped_fun = instance.cwrap('mg_path_relationship_at', 'i32', ['i32', 'i32']);
        return MgUnboundRelationship(wrappedFun(this.#cPtr, pos));
    }

     relationshipReversedAt(instance, pos) {
        wrapped_fun = instance.cwrap('mg_unbound_relationship_copy', 'i32', ['i32', 'i32']);
        return wrappedFun(this.#cPtr, pos);
    }

     copy(instance) {
        wrapped_fun = instance.cwrap('mg_path_copy', 'i32', ['i32']);
        return MgPath(this.#cPtr);
    }

     destroy(instance) {
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
     make(instance, days) {
        wrapped_fun = instance.cwrap('mg_date_make', 'i32', ['i32']);
        return MgDate(wrappedFun(days));
    }

     days(instance) {
        wrapped_fun = instance.cwrap('mg_date_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     copy(instance, mgDate) {
        wrapped_fun = instance.cwrap('mg_date_copy', 'i32', ['i32']);
        return MgDate(wrappedFun(mgDate.transferToWasm()));
    }

     destroy(instance) {
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

     nanoseconds(instance) {
        wrapped_fun = instance.cwrap('mg_time_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     tzOffsetSeconds(instance) {
        wrapped_fun = instance.cwrap('mg_time_tz_offset_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     copy(instance, mgTime) {
        wrapped_fun = instance.cwrap('mg_time_tz_copy', 'i32', ['i32']);
        return MgTime(wrappedFun(mgDate.transferToWasm()));
    }

     destroy(instance) {
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
     make(instance, days) {
        wrapped_fun = instance.cwrap('mg_local_time_make', 'i32');
        return MgLocalTime(wrappedFun(days));
    }

     days(instance) {
        wrapped_fun = instance.cwrap('mg_date_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     copy(instance, mgLocalTime) {
        wrapped_fun = instance.cwrap('mg_local_time_copy', 'i32', ['i32']);
        return MgDate(wrappedFun(mgLocalTime.transferToWasm()));
    }

     destroy(instance) {
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

     seconds(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     nanoseconds(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     tzOffsetMinutes(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_tz_offset_minutes', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     copy(instance, mgDateTime) {
        wrapped_fun = instance.cwrap('mg_date_time_copy', 'i32', ['i32']);
        return MgDateTime(wrappedFun(mgDateTime.transferToWasm()));
    }

     destroy(instance) {
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

     seconds(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     nanoseconds(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     id(instance) {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_tz_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     copy(instance, mgDateTime) {
        wrapped_fun = instance.cwrap('mg_date_time_zone_id_copy', 'i32', ['i32']);
        return MgDateTime(wrappedFun(mgDateTime.transferToWasm()));
    }

     destroy(instance) {
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
     make(instance, seconds, nanoseconds) {
        wrapped_fun = instance.cwrap('mg_local_date_time_make', 'i32', ['i32', 'i32']);
        return MgLocalDateTime(wrappedFun(seconds, nanoseconds));
    }

     seconds(instance) {
        wrapped_fun = instance.cwrap('mg_local_date_time_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     nanoseconds(instance) {
        wrapped_fun = instance.cwrap('mg_local_date_time_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     copy(instance, mgLocalDateTime) {
        wrapped_fun = instance.cwrap('mg_local_date_time_copy', 'i32', ['i32']);
        return MgLocalDateTime(wrappedFun(mgLocalDateTime.transferToWasm()));
    }

     destroy(instance) {
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
     make(instance, months, days, seconds, nanoseconds) {
        wrapped_fun = instance.cwrap('mg_duration_make', 'i32', ['i32', 'i32', 'i32', 'i32']);
        return MgDuration(wrappedFun(months, days, seconds, nanoseconds));
    }

     months(instance) {
        wrapped_fun = instance.cwrap('mg_duration_months', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     days(instance) {
        wrapped_fun = instance.cwrap('mg_duration_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     seconds(instance) {
        wrapped_fun = instance.cwrap('mg_duration_seconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     nanoseconds(instance) {
        wrapped_fun = instance.cwrap('mg_duration_nanoseconds', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     copy(instance, mgDuration) {
        wrapped_fun = instance.cwrap('mg_duration_copy', 'i32', ['i32']);
        return MgDuration(wrappedFun(mgDuration.transferToWasm()));
    }

     destroy(instance) {
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

     srid(instance) {
        wrapped_fun = instance.cwrap('mg_point_2d_srid', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     x(instance) {
        wrapped_fun = instance.cwrap('mg_point_2d_x', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     y(instance) {
        wrapped_fun = instance.cwrap('mg_point_2d_y', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     copy(instance, mgPoint2d) {
        wrapped_fun = instance.cwrap('mg_point_2d_copy', 'i32', ['i32']);
        return MgPoint2D(wrappedFun(mgPoint2d.transferToWasm()));
    }

     destroy(instance) {
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

     srid(instance) {
        wrapped_fun = instance.cwrap('mg_point_3d_srid', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     x(instance) {
        wrapped_fun = instance.cwrap('mg_point_3d_x', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     y(instance) {
        wrapped_fun = instance.cwrap('mg_point_3d_y', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     z(instance) {
        wrapped_fun = instance.cwrap('mg_point_3d_z', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     copy(instance, mgPoint2d) {
        wrapped_fun = instance.cwrap('mg_point_2d_copy', 'i32', ['i32']);
        return MgPoint3D(wrappedFun(mgPoint2d.transferToWasm()));
    }

     destroy(instance) {
        wrapped_fun = instance.cwrap('mg_point_2d_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

     transferToWasm() {
        return this.#cPtr;
    }
};

export class MgClient {
  #sessionPtr;  
  constructor(sessionPtr) {
    this.#sessionPtr = sessionPtr;
  }

  //todo expose ssl
  static async connect(instance, host, port) {
    let mgparamsPtr = instance._mg_session_params_make();
    let mgSessionParamsSetHost = instance.cwrap('mg_session_params_set_host', 'void', ['number', 'string']);
    mgSessionParamsSetHost(mgparamsPtr, host);
    instance._mg_session_params_set_port(mgparamsPtr, port);
    instance._mg_session_params_set_sslmode(mgparamsPtr, 0);

    let wrappedFun = instance.cwrap('mg_connect',
                                    'number',
                                    ['number', 'number'], { async : true });
    let ptr = instance._malloc(4);
    let ptrToPtr = instance._malloc(4);
    instance.setValue(ptrToPtr, ptr, 'i32'); 
    //todo cancel on error
    let maybeConnected = await wrappedFun(mgparamsPtr, ptrToPtr);
    if(maybeConnected < 0) {
      //clean up here
      return null;
    }
    let sessionPtr = instance.getValue(ptrToPtr, 'i32');
    instance._free(ptrToPtr);
    instance._mg_session_params_destroy(mgparamsPtr);
    return new MgClient(sessionPtr);
  }

   async execute(instance, query) {
    let mgSessionRun = instance.cwrap('mg_session_run', 
                                        'number', 
                                        ['number', 'string', 'number', 'number', 'number', 'number'], { async : true }); 
    //todo error handling
    let runResult = await mgSessionRun(this.#sessionPtr, query, null, null, null, null);
    if(runResult < 0 ) {
      return false;
    }
    return (this.pull(instance) < 0) ? false : true;
  }
  
   pull(instance) {
    let pullResult = instance._mg_session_pull(this.#sessionPtr, 0);
    return pullResult;
  }

   async fetchOne(instance) {
    let mgResult = instance._malloc(4);
    //todo probably remove this ptr (check memory model)
    let ptrMgResult = instance._malloc(4);
    instance.setValue(ptrMgResult, mgResult, 'i32');
    let wrappedFun = instance.cwrap('mg_session_fetch', 'number', ['number', 'number'], { async : true });
    //todo add error handling
    let result = await wrappedFun(this.#sessionPtr, ptrMgResult);
    //todo fix allocations
    if(result != 1) {
      return null;
    }
    
    let mgList = resultRow(instance);
    let arr = [];
    for(let i = 0; i < mgList.size(); ++i) {
        arr.push(mgList.at(i));
    }
    return arr;
  }

   async fetchAll(instance) {
    let arr = [];
    let result;
    while(result = await this.fetchOne(instance)) {
        if(result == null) {
          //clean up
          return null;
        }
        arr.push(result) 
    }
    return arr;
  }
  
   async discardAll(instance) { 
    while(await FetchOne(instance));
  }

   destroySession(instance) {
      instance._mg_session_destroy(this.#sessionPtr);
   }

   beginTransaction() { 
    //check async here
    let wrappedFun = instance.cwrap('mg_session_begin_transaction', 'number', ['number', 'number'], { async : true });
    return wrappedFun(this.#sessionPtr, null) == 0;
  } 

   commitTransaction() {
    let mgResult = instance._malloc(4);
    //todo probably remove this ptr (check memory model)
    let ptrMgResult = instance._malloc(4);
    let wrappedFun = instance.cwrap('mg_session_commit_transaction', 'number', ['number', 'number'], { async : true });
    return wrappedFun(this.#sessionPtr, ptrMgResult) == 0;
  }

   rollbackTransaction() { 
    let mgResult = instance._malloc(4);
    //todo probably remove this ptr (check memory model)
    let ptrMgResult = instance._malloc(4);
    let wrappedFun = instance.cwrap('mg_session_rollback_transaction', 'number', ['number', 'number'], { async : true });
    return wrappedFun(this.#sessionPtr, ptrMgResult) == 0;
  }

   rowToMgList(instance, mgResultPtr) {
    let wrapperFun = instance.cwrap('mg_connect',
                                    'number',
                                    ['number'], { async : true }); // argument types
    return MgList(wrappedFun(mgResultPtr));

  }

//   resultRow(instance) {
//    return this.#cacheResult;
//  }
//
//   resultColumns(instance) {
//    return this.#cacheResult;
//  }
//
//   resultSummary(instance) {
//    return this.#cacheResult;
//  }
};
