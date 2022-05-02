import loadWasmMgclient from "../mgclient/build/mgclient.js";

/**
 *  Simple class that handles WASM resources. Every Mg datatype is allocated internally 
 *  by the C runtime. Therefore, these resources must be deallocated at the end of execution.
 *  Although this simple construct is used as a global resource manager it can be easily extended 
 *  by adding scoped resource capabilities. Howerver, unless proven in practice that this is needed,
 *  it suffices to rely on this simple utility.
 */
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

/**
 * Helper function that returns null if the Mg* internal pointer points to the memory address 0(NULL) or
 * otherwise pushes the reference to the ResourceManager and returns back the reference.
 * @param {All Mg* data types} value.
 * @return {MgValue}.
 */
function errorOrPushToResourceManager(value) {
    if (value.transferToWasm() == 0) {
        return null
    }
    resourceManager.push(value);
    return value;
}

let instance = null;

/**
 * Initializes mgclient. Users shall call this function before using any of the module exports.
 * @param  {module} wasmInstance. The instance object retrieved from calling factory().then( instance => {} )
 * @return {bool}. Returns true on success, false on failure.
 */
function init(wasmInstance) {
    if (instance != null) {
        return null;
    }
    instance = wasmInstance;
    return (instance._mg_init() == 0) ? true : false;
}

/**
 * Function that initializes the wasm runtime. Must be called before
 * anything else.
 *
 * @return {
 */
export function loadWasm() {
    return loadWasmMgclient().then((instance) => {
        init(instance);
    });
}

/**
 * Returns the mgclient version.
 * @return {string} 
 */
export function clientVersion() {
    let wrappedFun = instance.cwrap('mg_client_version', 'string');
    return wrappedFun();
}

/**
 * Releases the internal memory allocated by the wasm mgclient.
 */
function releaseAll() {
    resourceManager.releaseAll();
}

/**
 * Finalizes and releases the internal resources. must be called by the users
 * before the program executes.
 */
export function finalize() {
    resourceManager.releaseAll();
    instance._mg_finalize();
}

/**
 * Returns the total memory resources held. Users shall not use this function.
 * @return {int}
 */
export function resourcesTracked() {
    return resourceManager.resourcesTracked();
}

/**
 * Enum representing the possible data types an MgValue can hold.
 */
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
        new MgValueTypeEnum("MG_VALUE_TYPE_DATE_TIME_ZONE_ID");
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

/**
 * Datatype to represent a variant of values defined in MgValueTypeEnum.
 */
export class MgValue {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }


    /**
     * Returns a string representing the underlyine datatype of the variant.
     * @return {string}
     */
    getType() {
        let wrappedFun = instance.cwrap('mg_value_get_type', 'i32', ['i32']);
        let enumValuesArray = Object.keys(MgValueTypeEnum);
        let val = wrappedFun(this.#cPtr);
        return enumValuesArray[val];
    }

    /**
     * Returns if the variant is empty.
     * @return {bool}
     */
    isNull() {
        return this.#cPtr == 0;
    }

    /**
     * Returns the bool value held in the variant or otherwise null.
     * @return {bool, null}.
     */
    getBool() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_BOOL.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_bool', 'i32', ['i32']);
        return (wrappedFun(this.#cPtr) == 0) ? false : true;
    }

    /**
     * Returns the integer held in the variant or otherwise null.
     * @return {integer, null}.
     */
    getInteger() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_INTEGER.name) {
            return null
        }
        let wrappedFun = instance.cwrap('mg_value_integer', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    /**
     * Returns the float held in the variant or otherwise null.
     * @return {float, null}.
     */
    getFloat() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_FLOAT.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_float', 'double', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    /**
     * Returns the string held in the variant or otherwise null.
     * @return {string, null}.
     */
    getMgString() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_STRING.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_string', 'i32', ['i32']);
        return new MgString(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgList held in the variant or otherwise null.
     * @return {MgList, null}.
     */
    getMgList() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_LIST.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_list', 'i32', ['i32']);
        return new MgList(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgMap held in the variant or otherwise null.
     * @return {MgMap, null}.
     */
    getMgMap() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_MAP.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_map', 'i32', ['i32']);
        return new MgMap(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgNode held in the variant or otherwise null.
     * @return {MgNode, null}.
     */
    getMgNode() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_NODE.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_node', 'i32', ['i32']);
        return new MgNode(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgRelationship held in the variant or otherwise null.
     * @return {MgRelationship, null}.
     */
    getMgRelationship() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_RELATIONSHIP.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_relationship', 'i32', ['i32']);
        return new MgRelationship(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgUnboundRelationship held in the variant or otherwise null.
     * @return {MgUnboundRelationship, null}.
     */
    getMgUnboundRelationship() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_UNBOUND_RELATIONSHIP.name) {
            return null;
        }
        let wrappedFun =
            instance.cwrap('mg_value_unbound_relationship', 'i32', ['i32']);
        return new MgUnboundRelationship(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgPath held in the variant or otherwise null.
     * @return {MgPath, null}.
     */
    getMgPath() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_PATH.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_path', 'i32', ['i32']);
        return new MgPath(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgDate held in the variant or otherwise null.
     * @return {MgDate, null}.
     */
    getMgDate() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DATE.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_date', 'i32', ['i32']);
        return new MgDate(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgTime held in the variant or otherwise null.
     * @return {MgTime, null}.
     */
    getMgTime() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_TIME.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_time', 'i32', ['i32']);
        return new MgTime(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgLocalTime held in the variant or otherwise null.
     * @return {MgLocalTime, null}.
     */
    getMgLocalTime() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_LOCAL_TIME.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_local_time', 'i32', ['i32']);
        return new MgLocalTime(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgDateTime held in the variant or otherwise null.
     * @return {MgDateTime, null}.
     */
    getMgDateTime() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DATE_TIME.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_date_time', 'i32', ['i32']);
        return new MgDateTime(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgDateTimeZoneId held in the variant or otherwise null.
     * @return {MgDateTimeZoneId, null}.
     */
    getMgDateTimeZoneId() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DATE_TIME_ZONE_ID.name) {
            return null;
        }
        let wrappedFun =
            instance.cwrap('mg_value_date_time_zone_id', 'i32', ['i32']);
        return new MgDateTimeZoneId(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgLocalDateTime held in the variant or otherwise null.
     * @return {MgLocalDateTime, null}.
     */
    getMgLocalDateTime() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_LOCAL_DATE_TIME.name) {
            return null;
        }
        let wrappedFun =
            instance.cwrap('mg_value_local_date_time', 'i32', ['i32']);
        return new MgLocalDateTime(wrappedFun(this.#cPtr));
    }

    /**
     * Returns the MgDuration held in the variant or otherwise null.
     * @return {MgDuration, null}.
     */
    getMgDuration() {
        let type = this.getType();
        if (type != MgValueTypeEnum.MG_VALUE_TYPE_DURATION.name) {
            return null;
        }
        let wrappedFun = instance.cwrap('mg_value_duration', 'i32', ['i32']);
        return new MgDuration(wrappedFun(this.#cPtr));
    }

    copy() {
        let wrappedFun = instance.cwrap('mg_value_copy', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(this.#cPtr));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Destructs the memory allocated by the C runtime.
     * This function is used by the ResourceManager to destruct at the end of execution.
     */
    destroy() {
        let wrappedFun = instance.cwrap('mg_value_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    /**
     * This function shall not be used by this module's consumers.
     *
     * Internal function to pass the MgValue to the underlyine wasm mgclient.
     * @return {int}. Memory address of the underlyine object.
     */
    transferToWasm() {
        return this.#cPtr;
    }

    /**
     * Constructs an empty MgValue.
     * @return {MgValue}.
     */
    static makeNull() {
        let result = new MgValue(instance._mg_value_make_null());
        return errorOrPushToResourceManager(result);
    }

    /**
     * Constructs an MgValue holding a bool with value val.
     * @param {bool} val.
     * @return {MgValue}.
     */
    static makeBool(val) {
        let bool = (val == false) ? 0 : 1;
        let result = new MgValue(instance._mg_value_make_bool(1));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Constructs an MgValue holding an integer with value val.
     * @param {integer} val.
     * @return {MgValue}.
     */
    static makeInteger(val) {
        let wrappedFun = instance.cwrap('mg_value_make_integer', 'i64', ['number']);
        let result = new MgValue(wrappedFun(BigInt(val)));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Constructs an MgValue holding a float with value val.
     * @param {float} val.
     * @return {MgValue}.
     */
    static makeFloat(val) {
        let wrappedFun = instance.cwrap('mg_value_copy', 'i32', ['double']);
        let result = new MgValue(instance._mg_value_make_float(val));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Constructs an MgValue holding a string with value str.
     * @param {string} str.
     * @return {MgValue}.
     */
    static makeString(str) {
        let wrappedFun =
            instance.cwrap('mg_value_make_string', 'i32', ['string']);
        let result = new MgValue(wrappedFun(str));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Constructs an MgValue holding a copy of the mgString with value mgString.
     * @param {MgString} mgString.
     * @return {MgValue}.
     */
    static makeString2(mgString) {
        let wrappedFun = instance.cwrap('mg_value_make_string', 'i32', ['string']);
        let result = new MgValue(wrappedFun(mgString.toString()));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Helper function that decorates errorOrPushToResourceManager by also stop managing the mgType.
     * @param {All Mg* data types} value.
     * @param {All Mg* data types} stopManagingValue.
     * @return {the Mg datatype, null}
     */
    errorOrStopManagingAndPushToResourceManager(value, stopManagingValue) {
        let maybeValue = errorOrPushToResourceManager(value);
        if (maybeValue != null) {
            resourceManager.stopManaging(stopManagingValue);
        }
        return maybeValue;
    }

    /**
     * Constructs an MgValue holding an MgList.
     * @param {float} val.
     * @return {MgValue}.
     */
    static makeList(mgList) {
        let wrappedFun = instance.cwrap('mg_value_make_list', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgList.transferToWasm()));
        return errorOrStopManagingAndPushToResourceManager(result, mgList);
    }

    /**
     * Constructs an MgValue holding an MgMap.
     * @param {MgMap} mgMap.
     * @return {MgValue}.
     */
    static makeMap(mgMap) {
        let wrappedFun = instance.cwrap('mg_value_make_map', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgMap.transferToWasm()));
        return errorOrStopManagingAndPushToResourceManager(result, mgMap);
    }

    /**
     * Constructs an MgValue holding an MgNode.
     * @param {MgNode} mgNode.
     * @return {MgValue}.
     */
    static makeNode(mgNode) {
        let wrappedFun = instance.cwrap('mg_value_make_node', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgNode.transferToWasm()));
        return errorOrStopManagingAndPushToResourceManager(result, mgNode);
    }

    /**
     * Constructs an MgValue holding an MgRelationship.
     * @param {MgRelationship} mgRelationship.
     * @return {MgValue}.
     */
    static makeRelationship(mgRelationship) {
        let wrappedFun =
            instance.cwrap('mg_value_make_relationship', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgRelationship.transferToWasm()));
        return errorOrStopManagingAndPushToResourceManager(result, mgRelationship);
    }

    /**
     * Constructs an MgValue holding an MgUnboundRelationship.
     * @param {MgValueUnboundRelationship} mgValueUnboundRelationship.
     * @return {MgValue}.
     */
    static makeUnboundRelationship(mgValueUnboundRelationship) {
        let wrappedFun =
            instance.cwrap('mg_value_make_unbound_relationship', 'i32', ['i32']);
        let result = new MgValue(
            wrappedFun(mgValueMakeUnboundRelationship.transferToWasm()));
        return errorOrStopManagingAndPushToResourceManager(result, mgValueUnboundRelationship);
    }

    /**
     * Constructs an MgValue holding an MgPath.
     * @param {MgPath} mgPath.
     * @return {MgValue}.
     */
    static makePath(mgPath) {
        let wrappedFun = instance.cwrap('mg_value_make_path', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgPath.transferToWasm()));
        return errorOrStopManagingAndPushToResourceManager(result, mgPath);
    }

    /**
     * Constructs an MgValue holding an MgDate.
     * @param {MgPath} mgDate.
     * @return {MgValue}.
     */
    static makeDate(mgDate) {
        let wrappedFun = instance.cwrap('mg_value_make_date', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgDate.transferToWasm()));
        return errorOrStopManagingAndPushToResourceManager(result, mgDate);
    }

    /**
     * Constructs an MgValue holding an MgLocalTime.
     * @param {MgLocalTime} mgLocalTime.
     * @return {MgValue}.
     */
    static makeLocalTime(mgLocalTime) {
        let wrappedFun =
            instance.cwrap('mg_value_make_local_time', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgLocalTime.transferToWasm()));
        return errorOrStopManagingAndPushToResourceManager(result, mgLocalTime);
    }

    /**
     * Constructs an MgValue holding an MgLocalDateTime.
     * @param {MgLocalDateTime} mgLocalDateTime.
     * @return {MgValue}.
     */
    static makeLocalDateTime(mgLocalDateTime) {
        let wrappedFun =
            instance.cwrap('mg_value_make_local_date_time', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgLocalDateTime.transferToWasm()));
        return errorOrStopManagingAndPushToResourceManager(result, mgLocalDateTime);
    }

    /*
     * Constructs an MgValue holding an MgDuration.
     * @param {MgDuration} mgDuration.
     * @return {MgValue}.
     */
    static makeDuration(mgDuration) {
        let wrappedFun = instance.cwrap('mg_value_make_duration', 'i32', ['i32']);
        let result = new MgValue(wrappedFun(mgDuration.transferToWasm()));
        return errorOrStopManagingAndPushToResourceManager(result, mgDuration);
    }
};

export class MgString {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    /*
     * Constructs an MgString (allocates memory with the C runtime).
     * @param {string} str.
     * @return {MgString}.
     */
    static make(str) {
        let wrappedFun = instance.cwrap('mg_string_make', 'i32', ['string']);
        let result = new MgString(wrappedFun(str));
        return errorOrPushToResourceManager(result);
    }

    /*
     * Returns a JS string representation of the MgString.
     * @return {string}.
     */
    toString() {
        let wrappedFun = instance.cwrap('mg_string_data', 'i32', ['i32']);
        let data = wrappedFun(this.#cPtr);
        let size = instance._mg_string_size(this.#cPtr);
        return instance.UTF8ToString(data, size);
    }

    /*
     * Copies the underlyine MgString (allocates memory with the C runtime).
     * @return {MgString}.
     */
    copy() {
        let wrappedFun = instance.cwrap('mg_string_copy', 'i32', ['i32']);
        let result = new MgString(wrappedFun(this.#cPtr));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Destructs the memory allocated by the C runtime.
     * This function is used by the ResourceManager to destruct at the end of execution.
     */
    destroy() {
        let wrappedFun = instance.cwrap('mg_string_destroy', 'void', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    /**
     * This function shall not be used by this module's consumers.
     *
     * Internal function to pass the MgValue to the underlyine wasm mgclient.
     * @return {int}. Memory address of the underlyine object.
     */
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
        return errorOrPushToResourceManager(result);
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

    /**
     * Returns a copy of the MgList (allocates memory on the C runtime)
     * @return {MgList, null}. null is returned if the allocation fails.
     */
    copy() {
        let wrappedFun = instance.cwrap('mg_list_copy', 'i32', ['i32']);
        let result = new MgList(wrappedFun(this.#cPtr));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Destructs the memory allocated by the C runtime.
     * This function is used by the ResourceManager to destruct at the end of execution.
     */
    destroy() {
        let wrappedFun = instance.cwrap('mg_list_destroy', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    /**
     * This function shall not be used by this module's consumers.
     *
     * Internal function to pass the MgValue to the underlyine wasm mgclient.
     * @return {int}. Memory address of the underlyine object.
     */
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
        return errorOrPushToResourceManager(result);
    }

    size() {
        let wrappedFun = instance.cwrap('mg_map_size', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    insert(mgString, mgValue) {
        let wrappedFun =
            instance.cwrap('mg_map_insert', 'i32', ['i32', 'string', 'i32']);
        let result = wrappedFun(this.#cPtr, mgString.toString(), mgValue.transferToWasm());
        if (result != 0) {
            return null;
        }
        resourceManager.stopManaging(mgValue);
        return result;
    }

    at(str) {
        let wrappedFun = instance.cwrap('mg_map_at', 'i32', ['i32', 'string']);
        let result;
        if (str instanceof MgString) {
            result = wrappedFun(this.#cPtr, str.toString());
        } else {
            result = wrappedFun(this.#cPtr, str);
        }
        return (result == 0) ? null : new MgValue(result);
    }

    /**
     * Returns a copy of the MgMap (allocates memory on the C runtime)
     * @return {MgMap, null}. null is returned if the allocation fails.
     */
    copy() {
        let wrappedFun = instance.cwrap('mg_map_copy', 'i32', ['i32']);
        let result = new MgMap(wrappedFun(this.#cPtr));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Destructs the memory allocated by the C runtime.
     * This function is used by the ResourceManager to destruct at the end of execution.
     */
    destroy() {
        let wrappedFun = instance.cwrap('mg_map_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    /**
     * This function shall not be used by this module's consumers.
     *
     * Internal function to pass the MgValue to the underlyine wasm mgclient.
     * @return {int}. Memory address of the underlyine object.
     */
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
        let wrappedFun = instance.cwrap('mg_node_id', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    labelCount() {
        let wrappedFun = instance.cwrap('mg_node_label_count', 'i32', ['i32']);
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

    /**
     * Returns a copy of the MgNode (allocates memory on the C runtime)
     * @return {MgNode, null}. null is returned if the allocation fails.
     */
    copy() {
        let wrappedFun = instance.cwrap('mg_node_copy', 'i32', ['i32']);
        let result = MgNode(wrappedFun(this.#cPtr));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Destructs the memory allocated by the C runtime.
     * This function is used by the ResourceManager to destruct at the end of execution.
     */
    destroy() {
        let wrappedFun = instance.cwrap('mg_map_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    /**
     * This function shall not be used by this module's consumers.
     *
     * Internal function to pass the MgValue to the underlyine wasm mgclient.
     * @return {int}. Memory address of the underlyine object.
     */
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
        let wrappedFun = instance.cwrap('mg_relationship_properties', 'i32', ['i32']);
        return new MgMap(wrappedFun(this.#cPtr));
    }

    /**
     * Returns a copy of the MgRelationship (allocates memory on the C runtime)
     * @return {MgRelationship, null}. null is returned if the allocation fails.
     */
    copy() {
        let wrappedFun = instance.cwrap('mg_relationship_copy', 'i32', ['i32']);
        let result = MgRelationship(wrappedFun(this.#cPtr));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Destructs the memory allocated by the C runtime.
     * This function is used by the ResourceManager to destruct at the end of execution.
     */
    destroy() {
        let wrappedFun = instance.cwrap('mg_relationship_destroy', 'void',
            ['i32']);
        wrappedFun(this.#cPtr);
    }

    /**
     * This function shall not be used by this module's consumers.
     *
     * Internal function to pass the MgValue to the underlyine wasm mgclient.
     * @return {int}. Memory address of the underlyine object.
     */
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
        let wrappedFun = instance.cwrap('mg_unbound_relationship_type', 'i32', ['i32']);
        return new MgString(wrappedFun(this.#cPtr));
    }

    properties() {
        let wrappedFun =
            instance.cwrap('mg_unbound_relationship_properties', 'i32', ['i32']);
        return new MgMap(wrappedFun(this.#cPtr));
    }

    /**
     * Returns a copy of the MgUnboundRelationship (allocates memory on the C runtime)
     * @return {MgUnboundRelationship, null}. null is returned if the allocation fails.
     */
    copy() {
        let wrappedFun =
            instance.cwrap('mg_unbound_relationship_copy', 'i32', ['i32']);
        let result = new MgUnboundRelationship(wrappedFun(this.#cPtr));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Destructs the memory allocated by the C runtime.
     * This function is used by the ResourceManager to destruct at the end of execution.
     */
    destroy() {
        let wrappedFun = instance.cwrap('mg_unbound_relationship_destroy', 'void',
            ['i32']);
        wrappedFun(this.#cPtr);
    }

    /**
     * This function shall not be used by this module's consumers.
     *
     * Internal function to pass the MgValue to the underlyine wasm mgclient.
     * @return {int}. Memory address of the underlyine object.
     */
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
        return new MgUnboundRelationship(wrappedFun(this.#cPtr, pos));
    }

    relationshipReversedAt(pos) {
        let wrappedFun =
            instance.cwrap('mg_path_relationship_reversed_at', 'i32', ['i32', 'i32']);
        return wrappedFun(this.#cPtr, pos);
    }

    /**
     * Returns a copy of the MgPath (allocates memory on the C runtime)
     * @return {MgPath, null}. null is returned if the allocation fails.
     */
    copy() {
        let wrappedFun = instance.cwrap('mg_path_copy', 'i32', ['i32']);
        let result = new MgPath(this.#cPtr);
        return errorOrPushToResourceManager(result);
    }

    /**
     * Destructs the memory allocated by the C runtime.
     * This function is used by the ResourceManager to destruct at the end of execution.
     */
    destroy() {
        let wrappedFun = instance.cwrap('mg_path_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    /**
     * This function shall not be used by this module's consumers.
     *
     * Internal function to pass the MgValue to the underlyine wasm mgclient.
     * @return {int}. Memory address of the underlyine object.
     */
    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgDate {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static make(days) {
        let wrappedFun = instance.cwrap('mg_date_make', 'i32', ['i64']);
        let result = new MgDate(wrappedFun(days));
        return errorOrPushToResourceManager(result);
    }

    days() {
        let wrappedFun = instance.cwrap('mg_date_days', 'i32', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    /**
     * Returns a copy of the MgDate (allocates memory on the C runtime)
     * @return {MgDate, null}. null is returned if the allocation fails.
     */
    copy() {
        let wrappedFun = instance.cwrap('mg_date_copy', 'i32', ['i32']);
        let result = new MgDate(wrappedFun(this.#cPtr));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Destructs the memory allocated by the C runtime.
     * This function is used by the ResourceManager to destruct at the end of execution.
     */
    destroy() {
        let wrappedFun = instance.cwrap('mg_map_destroy', 'i32', ['i32']);
        wrappedFun(this.#cPtr);
    }

    /**
     * This function shall not be used by this module's consumers.
     *
     * Internal function to pass the MgValue to the underlyine wasm mgclient.
     * @return {int}. Memory address of the underlyine object.
     */
    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgLocalTime {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static make(nanoseconds) {
        let wrappedFun = instance.cwrap('mg_local_time_make', 'i32', ['i64']);
        let result = new MgLocalTime(wrappedFun(BigInt(nanoseconds)));
        return errorOrPushToResourceManager(result);
    }

    nanoseconds() {
        let wrappedFun = instance.cwrap('mg_local_time_nanoseconds', 'i64', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    /**
     * Returns a copy of the MgLocalTime (allocates memory on the C runtime)
     * @return {MgLocalTime, null}. null is returned if the allocation fails.
     */
    copy() {
        let wrappedFun = instance.cwrap('mg_local_time_copy', 'i32', ['i32']);
        let result = new MgLocalTime(wrappedFun(this.#cPtr));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Destructs the memory allocated by the C runtime.
     * This function is used by the ResourceManager to destruct at the end of execution.
     */
    destroy() {
        let wrappedFun = instance.cwrap('mg_local_time_destroy', 'void', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    /**
     * This function shall not be used by this module's consumers.
     *
     * Internal function to pass the MgValue to the underlyine wasm mgclient.
     * @return {int}. Memory address of the underlyine object.
     */
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
            instance.cwrap('mg_local_date_time_make', 'i32', ['i64', 'i64']);
        let result = new MgLocalDateTime(wrappedFun(BigInt(seconds), BigInt(nanoseconds)));
        return errorOrPushToResourceManager(result);
    }

    seconds() {
        let wrappedFun =
            instance.cwrap('mg_local_date_time_seconds', 'i64', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    nanoseconds() {
        let wrappedFun =
            instance.cwrap('mg_local_date_time_nanoseconds', 'i64', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    /**
     * Returns a copy of the MgLocalDateTime (allocates memory on the C runtime)
     * @return {MgLocalDateTime, null}. null is returned if the allocation fails.
     */
    copy() {
        let wrappedFun =
            instance.cwrap('mg_local_date_time_copy', 'i32', ['i32']);
        let result =
            new MgLocalDateTime(wrappedFun(this.#cPtr));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Destructs the memory allocated by the C runtime.
     * This function is used by the ResourceManager to destruct at the end of execution.
     */
    destroy() {
        let wrappedFun =
            instance.cwrap('mg_local_date_time_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    /**
     * This function shall not be used by this module's consumers.
     *
     * Internal function to pass the MgValue to the underlyine wasm mgclient.
     * @return {int}. Memory address of the underlyine object.
     */
    transferToWasm() {
        return this.#cPtr;
    }
};

export class MgDuration {
    #cPtr;
    constructor(cPtr) {
        this.#cPtr = cPtr;
    }

    static make(months, days, seconds, nanoseconds) {
        let wrappedFun = instance.cwrap('mg_duration_make', 'i32', ['i64', 'i64', 'i64', 'i64']);
        let result = new MgDuration(instance._mg_duration_make(BigInt(months), BigInt(days), BigInt(seconds), BigInt(nanoseconds)));
        return errorOrPushToResourceManager(result);
    }

    months() {
        let wrappedFun = instance.cwrap('mg_duration_months', 'number', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    days() {
        let wrappedFun = instance.cwrap('mg_duration_days', 'number', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    seconds() {
        let wrappedFun = instance.cwrap('mg_duration_seconds', 'number', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    nanoseconds() {
        let wrappedFun =
            instance.cwrap('mg_duration_nanoseconds', 'i64', ['i32']);
        return wrappedFun(this.#cPtr);
    }

    /**
     * Returns a copy of the MgDuration (allocates memory on the C runtime)
     * @return {MgDuration, null}. null is returned if the allocation fails.
     */
    copy() {
        let wrappedFun = instance.cwrap('mg_duration_copy', 'i32', ['i32']);
        let result = new MgDuration(wrappedFun(this.#cPtr));
        return errorOrPushToResourceManager(result);
    }

    /**
     * Destructs the memory allocated by the C runtime.
     * This function is used by the ResourceManager to destruct at the end of execution.
     */
    destroy() {
        let wrappedFun = instance.cwrap('mg_duration_destroy', 'void', ['i32']);
        wrappedFun(this.#cPtr);
    }

    /**
     * This function shall not be used by this module's consumers.
     *
     * Internal function to pass the MgValue to the underlyine wasm mgclient.
     * @return {int}. Memory address of the underlyine object.
     */
    transferToWasm() {
        return this.#cPtr;
    }
};

/**
 * Helper class to dealloacate resources in one call.
 */
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

    manage(ptr) {
        this.#memArray.push(ptr);
    }

    deallocAll() {
        // deallocate in reverse order
        this.#memArray.slice().reverse().forEach(element => {
            instance._free(element);
        });
    }
};

/**
 * Main class used by the module consumers.
 * This class is the interface between the jsclient and Memgraph database.
 */
export class MgClient {
    #sessionPtr;
    constructor(sessionPtr) {
        this.#sessionPtr = sessionPtr;
    }

    /**
     * This function connects the client to the memgraph instance. On success returns an object of this class.
     * On failure it returns null.
     * @param {string} host. The host address of the memgraph instance.
     * @param {port} port. The port address of the memgraph instance.
     * @return {MgClient, null}.
     */
    static async connect(host, port) {
        let memoryHandle = new MemoryHandle();

        let mgparamsPtr = instance._mg_session_params_make();
        let mgSessionParamsSetHost = instance.cwrap('mg_session_params_set_host',
            'void', ['number', 'number']);
        let hostPtr = instance.allocateUTF8(host);
        memoryHandle.manage(hostPtr);
        mgSessionParamsSetHost(mgparamsPtr, hostPtr);
        instance._mg_session_params_set_port(mgparamsPtr, port);

        let wrappedFun = instance.cwrap('mg_connect', 'number',
            ['number', 'number'], {
                async: true
            });

        let ptrToPtr = memoryHandle.alloc(4);

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

    /**
     * This function executes a query on the connected instance. 
     * @param {string} host. The host address of the memgraph instance.
     * @param {port} port. The port address of the memgraph instance.
     * @return {bool}. On success true, false otherwise.
     */
    async execute(query) {
        let mgSessionRun = instance.cwrap(
            'mg_session_run', 'number',
            ['number', 'string', 'number', 'number', 'number', 'number'], {
                async: true
            });
        let runResult =
            await mgSessionRun(this.#sessionPtr, query, null, null, null, null);
        if (runResult < 0) {
            return false;
        }
        return (this.#pull(instance) < 0) ? false : true;
    }

    #pull() {
        let pullResult = instance._mg_session_pull(this.#sessionPtr, 0);
        return pullResult;
    }

    /**
     * This function fetches a row from the executed query result.
     * Do not hold references of subsequent fetches because the underlyine C objects are deallocated.
     * If you want to keep the results, perform a deep copy of the result mgList by calling the member 
     * method copy().
     * @return {mgList, null}. null when no results are available.
     */
    async fetchOne() {
        let memoryHandle = new MemoryHandle();
        let ptrMgResult = memoryHandle.alloc(4);
        let wrappedFun = instance.cwrap('mg_session_fetch', 'i32',
            ['i32', 'i32'], {
                async: true
            });
        let result = await wrappedFun(this.#sessionPtr, ptrMgResult);
        if (result != 1) {
            memoryHandle.deallocAll();
            return null;
        }
        let ptrRes = instance.getValue(ptrMgResult, 'i32');
        let mgList = this.#resultRow(ptrRes);
        memoryHandle.deallocAll();
        return mgList;
    }


    /**
     * Discards all the available results.
     */
    async discardAll() {
        while (await this.fetchOne())
        ;
    }

    /**
     * Destroys the session. Must be called at the end of program execution.
     */
    destroySession() {
        instance._mg_session_destroy(this.#sessionPtr);
    }

    /**
     * Begins a new transaction which must be manually commited to the memgraph instance.
     * Calls to execute() will not commit unless explicitly done.
     */
    async beginTransaction() {
        // check async here
        let wrappedFun = instance.cwrap('mg_session_begin_transaction', 'number',
            ['number', 'number'], {
                async: true
            });
        return wrappedFun(this.#sessionPtr, null) == 0;
    }

    /**
     * Commits the transaction on the memgraph instance.
     */
    async commitTransaction() {
        let memoryHandle = new MemoryHandle();
        let ptrMgResult = memoryHandle.alloc(4);
        let wrappedFun = instance.cwrap('mg_session_commit_transaction', 'number',
            ['number', 'number'], {
                async: true
            });
        let result = wrappedFun(this.#sessionPtr, ptrMgResult) == 0;
        memoryHandle.deallocAll();
        return result;
    }

    /**
     * Rollbacks the transaction on the memgraph instance.
     */
    async rollbackTransaction() {
        let memoryHandle = new MemoryHandle();
        let ptrMgResult = memoryHandle._malloc(4);
        let wrappedFun = instance.cwrap('mg_session_rollback_transaction', 'number',
            ['number', 'number'], {
                async: true
            });

        let result = wrappedFun(this.#sessionPtr, ptrMgResult) == 0;
        memoryHandle.deallocAll();
        return result;
    }

    #resultRow(mgResult) {
        let wrappedFun =
            instance.cwrap('mg_result_row', 'number', ['number']);
        let result = instance._mg_result_row(mgResult);
        return new MgList(result);
    }

    #resultColumns(mgResult) {
        let wrappedFun = instance.cwrap('mg_result_columns', 'number', ['number']);
        return new MgList(wrappedFun(mgResult));
    }

    #resultSummary(mgResult) {
        let wrappedFun =
            instance.cwrap('mg_result_summary', 'number', ['number']);
        return new MgMap(wrappedFun(mgResult));
    }
};
