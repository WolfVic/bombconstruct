'use strict';

const express = require('express');
const url = process.env.MONGODB_URI;
const SocketServer = require('ws').Server;
const path = require('path');
const MongoClient = require("mongodb").MongoClient;
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (msg) => {
    console.log('received: %s', msg)
    let res = requete(msg).then(exist => exist)
    ws.send(msg)
  })
  ws.on('close', () => console.log('Client disconnected'));
});

var requete = async mot => {
  try {
    var motExist = -1;
    var db = await MongoClient.connect(url);
    console.log("OPEN");
    var dbo = await db.db("lexique3");
    var query = { mot: mot };
    motExist = await dbo
      .collection("lexique")
      .find(query)
      .count();
    db.close();
    console.log("motExist : " + motExist);
    return motExist;
  } catch (e) {
    console.log("erreur: ", e);
  }
};
