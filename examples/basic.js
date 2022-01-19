var factory = require('./mgclient.js');

factory().then(async (instance) => {
    // These shall be handled by libraries such taht the user does not have to do allocations/deallocations
    const host_raw = new TextEncoder().encode('0.0.0.0');
    let ptr = instance._malloc(host_raw.length);
    let chunk = instance.HEAPU8.subarray(ptr, ptr + host_raw.length);
    chunk.set(host_raw);

    // pointer to pointer allocation -- yikes! 
    // will be abstracted away with library support
    let ptr2 = instance._malloc(4); // 2)
    let ptr3 = instance._malloc(4);
    let chunk3 = instance.HEAPU8.subarray(ptr3, ptr3 + 4); // 3A)
    instance.setValue(ptr3, ptr2, 'i32');

    // query parameters 
    const query = new TextEncoder().encode('CREATE (n:Person { name: \'Kostas\', Age: \'27\' })'); // 1)
    let q_ptr = instance._malloc(query.length); // 2)
    let chunk2 = instance.HEAPU8.subarray(q_ptr, q_ptr + query.length); // 3A)
    chunk2.set(query); //3b

    // main
    var maybeError = instance._mg_init();
    console.log("Called to mg_init with result: " + maybeError);
    var mgparamsPtr = instance._mg_session_params_make();
    var port = 7687;
    instance._mg_session_params_set_host(mgparamsPtr, chunk.byteOffset);
    instance._mg_session_params_set_port(mgparamsPtr, port);
    instance._mg_session_params_set_sslmode(mgparamsPtr, 0);

    // Call C from JavaScript
    var mg_connect = instance.cwrap('mg_connect', // name of C function
                                    'number', // return type
                                    ['number', 'number'], { async : true }); // argument types
    var maybeConnected = await mg_connect(mgparamsPtr, ptr3);

    var session_ptr = instance.getValue(ptr3, 'i32');
    console.log("Session_ptr: " + session_ptr);
    var mg_session_run = instance.cwrap('mg_session_run', 
                                        'number', 
                                        ['number', 'number', 'number', 'number', 'number', 'number'], { async : true }); 

    var run_result = await mg_session_run(session_ptr, chunk2.byteOffset, null, null, null, null);
    var pull = instance._mg_session_pull(session_ptr, 0);

    let mg_result = instance._malloc(4);
    let ptr_mg_result = instance._malloc(4);
    instance.setValue(ptr_mg_result, mg_result, 'i32');
    let mg_session_fetch = instance.cwrap('mg_session_fetch', 'number', ['number', 'number'], { async : true });
    while(true) {
      let res = await mg_session_fetch(session_ptr, ptr_mg_result);
      if(res != 1) {
        break;
      }
    }

  instance._mg_session_destroy(session_ptr);
  instance._mg_finalize();
});
