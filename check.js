'use strict';

const pgp = require('@monaco-ex/pg-promise')({});
const db = pgp(process.env.DATABASE_URL);

const registeredAddress = (addr) => db
  .oneOrNone('select address from sent where address = $1', [ addr ])
  .then(result => {
    if (result) {
      throw new Error('Already sent to your address.');
    } else {
      console.log(`${addr} is not registered.`);
    }});


const registeredTwitterID = (id_str) => db
  .oneOrNone('select id_str from sent where id_str = $1', [ id_str ])
  .then(result => {
    if (result) {
      throw new Error('Already sent to your Twitter account.');
    } else {
      console.log(`${id_str} is not registered.`);
    }});

const register = (id_str, addr) => db
  .none('insert into sent (id_str, address) values ($1, $2)', [id_str, addr]);

module.exports = {
  address: registeredAddress,
  twitterID: registeredTwitterID,
  register: register
};
