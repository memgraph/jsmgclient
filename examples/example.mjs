import * as mg from '../modules/mgclient.mjs';

mg.factory().then(async (instance) => {
    console.log("Hello world, jsmgclient");
    mg.init(instance);
    console.log("version is " + mg.clientVersion());
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






