import assert from 'assert';
import * as mg from '../modules/mgclient.mjs';
import { cleanUp } from "./common/common.mjs"

describe('#MgPath && MgUnboundRelationship', function() {
  it('', function() {
    mg.loadWasm().then(async () => {
      let mgClient = await mg.MgClient.connect("0.0.0.0", 7687);
      assert.notEqual(mgClient, null);
      let result = await mgClient.execute("CREATE p = (n {name: 'Benjo'})-[:FRIENDS_WITH {from: 'work'}]->(v {name: 'Jure'}) return p");
      let row = await mgClient.fetchOne();
      let path = row.at(0).getMgPath();
      assert.notEqual(path, null);
      let n = path.nodeAt(0);
      assert.notEqual(n, null);
      assert.equal(n.properties().at("name").getMgString().toString(), "Benjo");
      assert.equal(path.relationshipReversedAt(0), false);
      let uRel = path.relationshipAt(0);
      assert.equal(uRel.type().toString(), "FRIENDS_WITH");
      assert.equal(uRel.properties().at("from").getMgString().toString(), "work");

      await mgClient.discardAll();
      await cleanUp(mgClient, mg);  
    });
  });
});

