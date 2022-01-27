import * as mg from './mgclient.mjs';
import factory from '../examples/out.js';

factory().then(async (instance) => {
    console.log("Hello world, jsmgclient");
    mg.init(instance);
    console.log("version is " + mg.mgclientVersion());
    let mgClient = await mg.MgClient.connect("0.0.0.0", 7687);
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
    mg.finalize();
});






