import assert from 'assert';
import * as mg from '../modules/mgclient.mjs';

describe('#Interfaces and memory manager', function() {
    it('', function() {
        mg.loadWasm().then(() => {
            assert.equal("1.2.0", mg.clientVersion());

            //bool
            let mgValueBool = mg.MgValue.makeBool(true);
            assert.equal(mgValueBool.getBool(), true);
            assert.equal(mgValueBool.getInteger(), null);
            assert.equal(mg.resourcesTracked(), 1);

            //integer
            let mgValueInt = mg.MgValue.makeInteger(BigInt(10));
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
            mgValueBool = mg.MgValue.makeBool(true);
            assert.equal(mg.resourcesTracked(), 9);
            mgMap.insert(diamondHandsStr, mgValueBool);
            assert.equal(mg.resourcesTracked(), 8);
            assert.equal(mgMap.size(), 2);
            assert.equal(mgMap.at(diamondHandsStr).getBool(), true);

            let copiedMgMap = mgMap.copy();
            assert.equal(copiedMgMap.size(), 2);
            assert.equal(mg.resourcesTracked(), 9);

            //MgDate
            let mgDate = mg.MgDate.make(100n);
            assert.equal(mgDate.days(), 100);
            assert.equal(mg.resourcesTracked(), 10);
            let copyDate = mgDate.copy();
            assert.equal(mg.resourcesTracked(), 11);

            //MgDuration
            let mgDuration = mg.MgDuration.make(10n, 2n, 10n, 20n);
            assert.equal(mg.resourcesTracked(), 12);
            assert.equal(mgDuration.months(), 10);
            assert.equal(mgDuration.days(), 2);
            assert.equal(mgDuration.seconds(), 10);
            assert.equal(mgDuration.nanoseconds(), 20);
            let copyDuration = mgDuration.copy();
            assert.equal(mg.resourcesTracked(), 13);

            //MgLocalTime
            let mgLocalTime = mg.MgLocalTime.make(1000);
            assert.equal(mg.resourcesTracked(), 14);
            assert.equal(mgLocalTime.nanoseconds(), 1000);
            let copyLocalTime = mgLocalTime.copy();
            assert.equal(mg.resourcesTracked(), 15);

            //MgLocalDateTime
            let mgLocalDateTime = mg.MgLocalDateTime.make(10, 20);
            assert.equal(mg.resourcesTracked(), 16);
            assert.equal(mgLocalDateTime.seconds(), 10);
            assert.equal(mgLocalDateTime.nanoseconds(), 20);
            let copyLocalDateTime = mgLocalDateTime.copy();
            assert.equal(mg.resourcesTracked(), 17);
        });
    });
});