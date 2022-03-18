import * as mg from '../modules/mgclient.mjs';

function cleanUp(mgClient) {
    mgClient.destroySession();
    mg.finalize();
}

mg.loadWasm().then(async () => {
    let mgClient = await mg.MgClient.connect("0.0.0.0", 7687);
    if (mgClient == null) {
        cleanUp(mgClient);
        throw "Could not connect to memgraph!";
    }

    let createQuery = "CREATE (n:Person {name: 'John'})-[e:KNOWS {from: 'Work'}]->(m:Person {name: 'Steve'}) RETURN n, e, m";
    let res = await mgClient.execute(createQuery);
    if (res == false) {
        cleanUp(mgClient);
        throw "Error while fetching the result";
    }
    await mgClient.discardAll();

    await mgClient.execute("MATCH (n) RETURN n");
    let row;
    while (row = await mgClient.fetchOne()) {
        console.log(row.at(0).getMgNode().properties().at("name").getMgString().toString());
    }

    await mgClient.execute("MATCH (n)-[r:KNOWS]-(m) RETURN r");
    while (row = await mgClient.fetchOne()) {
        console.log(row.at(0).getMgRelationship().properties().at("from").getMgString().toString());
    }

    cleanUp(mgClient);
});
