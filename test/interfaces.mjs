import assert from 'assert';
import * as mg from '../modules/mgclient.mjs';

describe('#Interfaces and memory manager', function() {
    it('', function() {
        mg.factory().then((instance) => {
            mg.init(instance);
            assert.equal("1.2.0", mg.clientVersion());

            //bool
            let mgValueBool = mg.MgValue.makeBool(true);
            assert.equal(mgValueBool.getBool(), true);
            assert.equal(mgValueBool.getInteger(), null);
            assert.equal(mg.resourcesTracked(), 1);

            //integer
            let mgValueInt = mg.MgValue.makeInteger(10);
            assert.equal(mgValueInt.getInteger(), 10);
            assert.equal(mgValueInt.getFloat(), null);
            assert.equal(mg.resourcesTracked(), 2);

            //float
            let mgValueFloat = mg.MgValue.makeFloat(2.24);
            assert.equal(mgValueFloat.getFloat(), 2.24);
            assert.equal(mgValueFloat.getInteger(), null);
            assert.equal(mg.resourcesTracked(), 3);

            //string
            let mgValueStr = mg.MgValue.makeString("Hello world");
            assert.equal(mgValueStr.getMgString().toString(), "Hello world");
            assert.equal(mgValueStr.getInteger(), null);
            assert.equal(mg.resourcesTracked(), 4);

            let mgValueStr2 = mg.MgValue.makeString2(mgValueStr.getMgString());
            assert.equal(mgValueStr2.getMgString().toString(), "Hello world");
            assert.equal(mgValueStr2.getInteger(), null);
            assert.equal(mg.resourcesTracked(), 5);

            //MgString
            let diamondHandsStr = mg.MgString.make("Diamond hands");
            assert.equal(diamondHandsStr.toString(), "Diamond hands");
            assert.equal(mg.resourcesTracked(), 6);
            let copiedDiamondHandsStr = diamondHandsStr.copy();
            assert.equal(copiedDiamondHandsStr.toString(), "Diamond hands");
            assert.equal(mg.resourcesTracked(), 7);

            //MgList
            let mgList = mg.MgList.make(1);
            assert.equal(mg.resourcesTracked(), 8);
            assert.equal(mgList.size(), 0);
            mgList.append(mgValueFloat);

            //memory ownership transfered, ref count should drop
            assert.equal(mg.resourcesTracked(), 7);
            assert.equal(mgList.at(0).getFloat(), 2.24);
            assert.equal(mgList.at(10), null);
            assert.equal(mgList.size(), 1);
            assert.equal(mgList.append(mgValueBool), null);
            let copiedMgList = mgList.copy();
            assert.equal(copiedMgList.size(), 1);
            assert.equal(mg.resourcesTracked(), 8);

            //MgMap
            let mgMap = mg.MgMap.make(2);
            assert.equal(mg.resourcesTracked(), 9);
            assert.equal(mgMap.size(), 0);
            mgMap.insert("Kostas", mgValueInt);
            //memory ownership transfered, ref count should drop
            assert.equal(mg.resourcesTracked(), 8);
            assert.equal(mgMap.at("Kostas").getInteger(), 10);
            assert.equal(mgMap.size(), 1);
            mgMap.insert(diamondHandsStr.toString(), mgValueBool);
            assert.equal(mg.resourcesTracked(), 7);
            assert.equal(mgMap.size(), 2);
            //check this
            //console.log("Value: " + mgMap.insertWithMgStringKey(diamondHandsStr, mgValueBool));
            //assert.equal(mg.resourcesTracked(), 6);
            //assert.equal(mgMap.at("Hello world").getBool(), true);
            assert.equal(mgMap.at(diamondHandsStr.toString()).getBool(), true);
            let copiedMgMap = mgMap.copy();
            assert.equal(copiedMgMap.size(), 2);
            assert.equal(mg.resourcesTracked(), 8);

            //MgNode
            //let mgNode = mg.MgNode.make(1, labels, props);
            //assert.equal(mgNode.id(), 1);
            //assert.equal(mgNode.labelCount(), expectedCount);
            //assert.equal(mgNode.labelAtPos(pos), expected);
            //assert.equal(mgNode.properties(pos), expected);
            //assert.equal(mgNode.copy(pos), expected);
            //MgRelationship
            //MgUnboundRelationship
            //MgDate
            //MgLocalTime
            //MgLocalDateTime
            //MgDuration
        });
    });
});