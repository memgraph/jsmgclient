//import mgclient wasm here

//todo implement MemoryRegistry
//todo add another abstraction layer to get rid of passing the instance object

export function mgclientVersion(instance) {
    wrapped_fun = instance.cwrap('mg_client_version', 'string');
    returned wrapped_fun();
}

export function mgClientFinalize(instance) {
    return instance._mg_finalize();
}

export class MgValue {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgList {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgMap {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgNode {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgRelationship {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgPath {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgDate {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgTime {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgLocalTime {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgDateTime {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgDateTimeZoneId {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgLocalDateTime {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgDuration {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgPoint2D {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }
};

export class MgPoint3D {
    //add interface
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
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

//todo
export function MgMalueMakeString2(instance, str2) {
    //wrapped_fun = instance.cwrap('mg_value_make_string2', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakeList2(instance, mgList) {
    //wrapped_fun = instance.cwrap('mg_value_make_list', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakeMap(instance, mgMap) {
    //wrapped_fun = instance.cwrap('mg_value_make_map', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakeNode(instance, mgNode) {
    //wrapped_fun = instance.cwrap('mg_value_make_node', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakeRelationship(instance, mgRelationship) {
    //wrapped_fun = instance.cwrap('mg_value_make_relationship', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakeUnboundRelationship(instance, mgMalueMakeUnboundRelationship) {
    //wrapped_fun = instance.cwrap('mg_value_make_unbound_relationship', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakePath(instance, mgPath) {
    //wrapped_fun = instance.cwrap('mg_value_make_path', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakeDate(instance, mgDate) {
    //wrapped_fun = instance.cwrap('mg_value_make_date', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakeTime(instance, mgTime) {
    //wrapped_fun = instance.cwrap('mg_value_make_time', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakeLocalTime(instance, mgLocalTime) {
    //wrapped_fun = instance.cwrap('mg_value_make_local_time', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakeDateTime(instance, mgDateTime) {
    //wrapped_fun = instance.cwrap('mg_value_make_date_time', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakeTimeZoneId(instance, mgDateTimeZoneId) {
    //wrapped_fun = instance.cwrap('mg_value_make_date_time_zone_id', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakeLocalDateTime(instance, mgLocalDateTime) {
    //wrapped_fun = instance.cwrap('mg_value_make_local_date_time', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakeDuration(instance, mgDuration) {
    //wrapped_fun = instance.cwrap('mg_value_make_duration', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakePoint2d(instance, mgValueMakePoint2d) {
    //wrapped_fun = instance.cwrap('mg_value_make_point_2d', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgMalueMakePoint3d(instance, MgPoint3D) {
    //wrapped_fun = instance.cwrap('mg_value_make_date_time', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueGetType(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_get_type', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueBool(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_bool', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueInteger(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_integer', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueFloat(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_float', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueString(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_string', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueList(instance, mgValueList) {
    //wrapped_fun = instance.cwrap('mg_value_list', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueMap(instance, mgValueMap) {
    //wrapped_fun = instance.cwrap('mg_value_value_map', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueNode(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_value_node', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueRelationship(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_relationship', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueUnboundRelationship(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_get_type', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValuePath(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_path', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueDate(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_date', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueTime(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_time', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueLocalTime(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_local_time', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueGetType(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_get_type', 'i32', ['i32']);
    //wrap this through the interface
}

//todo
export function MgValueGetType(instance, mgValue) {
    //wrapped_fun = instance.cwrap('mg_value_get_type', 'i32', ['i32']);
    //wrap this through the interface
}