'use strict';

/* eslint new-cap: "off" */

const bcoin = require('bcoin');
const assert = require('assert');

var async = require('async');
(async () => {
  // nulldata
  //https://insight.bitpay.com/api/tx/32899b5a549f61c01e32d1e6ca959dad5239b43324904e8cddd289c540ad2073
  var a = bcoin.Script.fromRaw("6a24aa21a9edf59d9829abec026f90c534956f52e950cf6b146ca4e55143a3e0104a51ff4282080000000000000000", "hex");
  console.error(a.isNulldata());
  // p2sh
  //https://insight.bitpay.com/api/tx/ba40af5068ae8e93a2fb6eb7a3cfa37b823be797c6250cde8e86d63936f73b5a
  // https://insight.bitpay.com/api/addr/3PbJsixkjmjzsjCpi4xAYxxaL5NnxrbF9B/utxo
  var b = bcoin.Script.fromRaw("a914f03e6bf9b389bbd5d5669ff55c4dba30de99553587", "hex");
  console.error(b.isScripthash());
  // p2kh
  //https://insight.bitpay.com/api/tx/4bc46e785882bfa35895ce875670a2aa1d5e2bbdc49d27c4bcd25ccd130e0229
  //https://insight.bitpay.com/api/addr/1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY/utxo
  var c = bcoin.Script.fromRaw("76a914c825a1ecf2a6830c4401620c3a16f1995057c2ab88ac", "hex");
  console.error(c.isPubkeyhash());
  // p2wkh
  //https://insight.bitpay.com/api/tx/8e7ed2e0c020c00662eebc58e96430cab4f4bdf226e8903e9312efe35c859954
  var d = bcoin.Script.fromRaw("00144a788177ee4a7f3376aef7e08fcc904966cfde3b", "hex");
  console.error(d.isWitnessPubkeyhash());
  //p2wsh
  //https://insight.bitpay.com/api/tx/98ae4ef53f6ee6e9e7eeb5eb1c802994a65b5e97bc4c8c0673a350f51b565d18
  //OUT 1
  var e = bcoin.Script.fromRaw("0020442bd9b9f255e362c7fa693e8724e28f8a87eeff9c31b4e56be36adead2212db", "hex");
  console.error(e.isWitnessScripthash());
  // p2sh 2-2 
  //https://insight.bitpay.com/api/tx/16d41d6a4421ebfc91f1a6fb5dc38839606ab551411a8407de00c77cf4daddb0
  //out 0
  var f = bcoin.Script.fromRaw("a914507776e8bee1af0d9d1314c7ae586b6b6c2b338087", "hex");
  console.error(f.isMultisig());

  // Our available coins.
  const coins = [];
  // Convert the coinbase output to a Coin
  // object and add it to our available coins.
  // In reality you might get these coins from a wallet.
  coins.push(new bcoin.Coin({
    height: 606396,
    hash: "7c2655bc7150130f5ca6873a34e0f640743581a7ccbdece97eb8ab10db61a79b",
    index: 0,
    value: 1271896809,
    script: bcoin.Script.fromRaw("76a914c825a1ecf2a6830c4401620c3a16f1995057c2ab88ac", "hex")
  }));

  coins.push(new bcoin.Coin({
    height: 606372,
    index: 1,
    hash: "6bee085f5206382733e0a8aa9ab5920fb01f237ceb7619a4eee9745c4ad4a238",
    value: 1283222123,
    script: bcoin.Script.fromRaw("76a914c825a1ecf2a6830c4401620c3a16f1995057c2ab88ac", "hex")
  }));

  // Create our redeeming transaction.
  const mtx = new bcoin.MTX();

  // Send 10,000 satoshis to ourself.
  mtx.addOutput({
    address: "3QN24NdHRn7NLaTCFLqLvyDKHLzhthdoMF",// keyring.getAddress(),
    value: 2583222123
  });

  // Now that we've created the output, we can do some coin selection (the
  // output must be added first so we know how much money is needed and also so
  // we can accurately estimate the size for fee calculation).

  // Select coins from our array and add inputs.
  // Calculate fee and add a change output.
  await mtx.fund(coins, {
    // Use a rate of 10,000 satoshis per kb.
    // With the `fullnode` object, you can
    // use the fee estimator for this instead
    // of blindly guessing.
    rate: 1000,
    // Send the change back to ourselves.
    changeAddress: "3EENzQdQS3BvvnkeJjC5uVwUKFuTczpnok"//keyring.getAddress()
  });
  console.log(mtx.toJSON())
  console.log(JSON.stringify(mtx))
  // Sign input 0
  //   mtx.sign(keyring);

  // The transaction should now verify.
  //   assert(mtx.verify());

  //   // Commit our transaction and make it immutable.
  //   // This turns it from an MTX into a TX.
  const tx = mtx.toTX();
  console.log(JSON.stringify(tx))
  //   // The transaction should still verify.
  //   // Regular transactions require a coin
  //   // viewpoint to be passed in.
  //   assert(tx.verify(mtx.view));

  //   console.log(mtx);
})().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
