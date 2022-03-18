import * as mg from '../modules/mgclient.mjs';

mg.loadWasm().then(async () => {
    console.log("Hello world, jsmgclient");
    console.log("version is " + mg.clientVersion());
    let mgClient = await mg.MgClient.connect("0.0.0.0", 7687);
    if (mgClient == null) {
        throw "Could not connect to memgraph!";
    }
    let result = await mgClient.execute("CREATE (n:Person { name: 'Kostas', Age: '27' })");
    await mgClient.discardAll();
    result = await mgClient.execute("MATCH (n) return n");
    let totalRows = 0;
    let row;
    while (row = await mgClient.fetchOne()) {
        ++totalRows;
    }
    console.log("total rows " + totalRows);
    mgClient.destroySession();
    mg.finalize();
});