import assert from 'assert';
import * as mg from '../../modules/mgclient.mjs';
import {
    cleanUp
} from "../common/common.mjs"

describe('#MgRelationship', function() {
    it('', function() {
        mg.loadWasm().then(async () => {
            let mgClient = await mg.MgClient.connect("0.0.0.0", 7687);
            assert.notEqual(mgClient, null);
            let result = await mgClient.execute("CREATE (n {name: 'Benjo'})-[:FRIENDS_WITH {from: 'work'}]->(v {name: 'Jure'})");
            await mgClient.discardAll();
            await mgClient.execute("MATCH (n)-[r]-(v) RETURN r");
            let row = await mgClient.fetchOne();
            let rel = row.at(0).getMgRelationship();
            assert.notEqual(rel, null);
            assert.equal(rel.properties().at("from").getMgString().toString(), "work");
            assert.equal(rel.type().toString(), "FRIENDS_WITH");
            await mgClient.discardAll();
            await cleanUp(mgClient, mg);
        });
    });
});
