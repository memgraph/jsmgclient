import * as mg from '../modules/mgclient.mjs';
import factory from './out.js';
//let mg = require('./mgclient.mjs');

factory().then(async (instance) => {
    console.log("Hello world");
    console.log("version is " + mg.mgclientVersion(instance));
    mg.mgInit(instance);
    let mgClient = await mg.MgClient.connect(instance, "0.0.0.0", 7687);
    if(mgClient == null) {
      throw "Could not connect to memgraph!";
    }
    let query = "CREATE (n:Person { name: 'Kostas', Age: '27' })";
    let result = await mgClient.execute(instance, query);
    let res = await mgClient.fetchAll(instance);
    if(res == null) {
      throw "Error while fetching the result";
    }
    console.log("Total rows " + res.length);
    mgClient.destroySession(instance);
    mg.mgClientFinalize(instance);
});






