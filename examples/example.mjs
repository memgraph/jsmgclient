import * as mg from './mgclient.mjs';
import factory from '../examples/out.js';
//let mg = require('./mgclient.mjs');

factory().then(async (instance) => {
    console.log("Hello world");
    console.log("version is " + mg.mgclientVersion(instance));
    mg.mgInit(instance);
    let mgClient = await mg.MgClient.connect(instance, "0.0.0.0", 7687);
    if(mgClient == null) {
      throw "Could not connect to memgraph!";
    }
    let result = await mgClient.execute("CREATE (n:Person { name: 'Kostas', Age: '27' })");
    let res = await mgClient.fetchAll();
    if(res == null) {
      throw "Error while fetching the result";
    }
    console.log("Total rows " + res.length);
    mgClient.destroySession();
    mg.mgClientFinalize(instance);
});






