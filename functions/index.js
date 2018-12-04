'use strict';


//  Declare all child functions here
const moderateChatFunction = require('./chat/moderateChat');
// const moderateImage = require('./images/moderateImage');


// Note: these tasks need to be initialized in index.js and
// NOT in child functions:
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = admin.initializeApp(functions.config().firebase);
const db = firebase.firestore()


exports.onCreateMessage = functions.firestore.document('messages/{messageId}').onCreate((snap, context) => {
  const message = snap.data();
  return moderateChatFunction.handler(message, db);
});


exports.onUpdateMessage = functions.firestore.document('messages/{messageId}').onUpdate((change, context) => {
  const message = change.after.data();
  return moderateChatFunction.handler(message, db);
});


/* exports.moderateImage = functions.storage.object().onFinalize((object) => {
  // ...
  return moderateImage.handler(object);

}); */