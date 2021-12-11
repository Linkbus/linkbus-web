const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const express = require('express');
const cors = require('cors')({origin: true});
const app = express();

const adminUserId = functions.config().linkbus.adminuserid

const now = () => { return admin.firestore.Timestamp.now() }

app.get('/alerts', async (req, res) => {
  const snapshot = await db.collection("alerts")
      .where('uid', '==', adminUserId)
      .where('active', '==', true)
      .where('start', '<=', now())
      .get()
  let alerts = processAlertsResponse(snapshot);
  const alertsJson = {alerts: alerts};
  res.status(200).send(JSON.stringify(alertsJson));
});

app.get('/routes', async (req, res) => {
  const snapshot = await db.collection("routes")
      .where('uid', '==', adminUserId)
      .get()
  let routes = processRoutesResponse(snapshot);
  const routesJson = {routes: routes};
  res.status(200).send(JSON.stringify(routesJson));
});

const processAlertsResponse = (snapshot) => {
  let docs = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    if( (data.end === "" || now() <= data.end) && !data.archived ) {
      const id = doc.id;
      docs.push({id, ...data});
    }
  });
  return docs;
}
const processRoutesResponse = (snapshot) => {
  let docs = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    const id = doc.id;
    docs.push({id, ...data});
  });
  return docs;
}
const processSchoolMessagesResponse = (snapshot) => {
  let docs = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    const id = doc.id;
    docs.push({id, ...data});
  });
  return docs;
}
app.get('/', async (req, res) => {
  const alertsSnapshot = await db.collection("alerts")
      .where('uid', '==', adminUserId)
      .where('active', '==', true)
      .where('start', '<=', now())
      .get()
  const routesSnapshot = await db.collection("routes")
      .where('uid', '==', adminUserId)
      .get()
  const schoolMessagesSnapshot = await db.collection("messages")
      .get()
  let alerts = processAlertsResponse(alertsSnapshot);
  let routes = processRoutesResponse(routesSnapshot);
  let messageSettings = processSchoolMessagesResponse(schoolMessagesSnapshot);
  const json = {alerts: alerts, routes: routes, schoolAlertsSettings: messageSettings}
  res.status(200).send(JSON.stringify(json));
});

app.use(cors);

exports.api = functions.https.onRequest(app);