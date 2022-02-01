import * as mg from '../modules/mgclient.mjs';

function cleanUp(mgClient) {
    mgClient.destroySession();
    mg.finalize();
}

mg.factory().then(async (instance) => {
    mg.init(instance);
    let mgClient = await mg.MgClient.connect("0.0.0.0", 7687);
    if (mgClient == null) {
        cleanUp(mgClient);
        throw "Could not connect to memgraph!";
    }

    let createQuery = "CREATE (n:Person {name: 'John'})-[e:KNOWS {from: 'Work'}]->(m:Person {name: 'Steve'}) RETURN n, e, m";
    await mgClient.execute(createQuery);
    let res = await mgClient.fetchAll();
    if (res == null) {
        cleanUp(mgClient);
        throw "Error while fetching the result";
    }

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
