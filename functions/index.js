'use strict';

//  Declare all child functions here
const moderateChatFunction = require('./chat/moderateChat');
const moderateImage = require('./images/moderateImage');


// Note: these tasks need to be initialized in index.js and
// NOT in child functions:
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const database = admin.database();

exports.moderateChatFunction = functions.database.ref('chat/messages/{messageId}').onWrite((change) => {
  // Pass whatever tasks to child functions so they have access to it
  return moderateChatFunction.handler(change, database);
});

exports.moderateImage = functions.storage.object().onFinalize((object) => {
  // ...
  return moderateImage.handler(object, database);

});