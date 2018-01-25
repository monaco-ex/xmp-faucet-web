'use strict'
const request = require('request-promise-lite');

const Bitcoin = require('bitcoinjs-lib');
const counterparty = require('counterparty-promise');
const coininfo = require('@monaco-ex/coininfo');
const mona = coininfo('MONA').toBitcoinJS();
mona.messagePrefix = '';
mona.dustThreshold = 0;

const monaOptions = {
  port: 4000,
  host: 'api.monaparty.me',
  user: 'rpc',
  pass: 'rpc'
};
const monaClient = new counterparty.Client(monaOptions);
const key = Bitcoin.ECKey.fromWIF(process.env.WIF, mona);

const addressCheck = (destination) => {
  const check = Bitcoin.Address.fromBase58Check(destination);
  if (check.version != 50 && check.version != 55) {
    throw new Error('Cannot parse address.');
  }
  return destination;
};

const send = (destination) => Promise.resolve(destination)
  .then(destination => addressCheck(destination))
  .then(destination => monaClient
    .createSend({
      source: key.pub.getAddress(mona).toString(),
      destination: destination,
      asset: 'XMP',
      quantity: 300000000,
      use_enhanced_send: true,
      fee: 225000}))
  .then(hex => {
    const tx  = Bitcoin.Transaction.fromHex(hex);
    tx.sign(0, key);
    return tx.toHex().toString();
  })
  .then(signed_hex =>
    (new request.Request('POST', 'https://mona.insight.monaco-ex.org/insight-api-monacoin/tx/send', {
      body: {
        rawtx: signed_hex
      },
      json: true
    })).run())
  .then(parsedBody => { console.dir(parsedBody.txid); return parsedBody.txid;});

module.exports = {send: send};
