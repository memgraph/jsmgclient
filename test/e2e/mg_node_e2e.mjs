import assert from 'assert';
import * as mg from '../../modules/mgclient.mjs';
import {
    cleanUp
} from "../common/common.mjs"

describe('#MgNode', function() {
    it('', function() {
        mg.loadWasm().then(async () => {
            let mgClient = await mg.MgClient.connect("0.0.0.0", 7687);
            assert.notEqual(mgClient, null);
            let result = await mgClient.execute("CREATE (n:Person { name: 'Kostas', Age: '27' })");
            await mgClient.discardAll();
            await mgClient.execute("MATCH (n) RETURN n");
            let row = await mgClient.fetchOne();
            let node = row.at(0).getMgNode();
            assert.notEqual(node, null);
            assert.equal(node.properties().at("name").getMgString().toString(), "Kostas");
            assert.equal(node.labelCount(), 1);
            assert.equal(node.labelAtPos(0).toString(), "Person");
            await mgClient.discardAll();
            await cleanUp(mgClient, mg);
        });
    });
});
