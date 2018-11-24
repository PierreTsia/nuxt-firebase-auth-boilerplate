const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const capitalizeSentence = require('capitalize-sentence');
const Filter = require('bad-words');
const badWordsFilter = new Filter();
const frenchBadWords = require('french-badwords-list')
badWordsFilter.addWords(frenchBadWords.array)

admin.initializeApp();





// Moderates messages by lowering all uppercase messages and removing swearwords.
exports.moderator = functions.database.ref('chat/messages/{messageId}').onWrite((change) => {
  console.log("french", frenchBadWords)
  const message = change.after.val();

  if (message) {
    // Retrieved the message values.
    console.log('Retrieved message content: ', message);
    console.log(badWordsFilter)

    // Run moderation checks on on the message and moderate if needed.
    const moderatedMessage = moderateMessage(message);


    // Update the Firebase DB with checked message.
    console.log('Message has been moderated. Saving to DB: ', moderatedMessage);
    return change.after.ref.update({
      content: moderatedMessage.content,
      moderated: moderatedMessage.flags.length > 0,
      flags: moderatedMessage.flags || []

    });
  }
  return null;
});

// Moderates the given message if appropriate.
function moderateMessage(message) {
  const flags = []
  if (message.flags) {
    flags.push(...message.flags)
  }

  // Re-capitalize if the user is Shouting.

  if (isShouting(message.content)) {
    console.log('User is shouting. Fixing sentence case...');
    message.content = stopShouting(message.content);
    flags.push('shouting')
  }

  // Moderate if the user uses SwearWords.
  if (containsSwearwords(message.content)) {
    console.log('User is swearing. moderating...');
    message.content = moderateSwearwords(message.content);
    flags.push('swearing')

  }

  console.log('message', message)
  return { content: message.content, flags };
}

// Returns true if the string contains swearwords.
function containsSwearwords(message) {
  return message !== badWordsFilter.clean(message);
}

// Hide all swearwords. e.g: Crap => ****.
function moderateSwearwords(message) {
  return badWordsFilter.clean(message);
}

// Detect if the current message is shouting. i.e. there are too many Uppercase
// characters or exclamation points.
function isShouting(message) {
  return message.replace(/[^A-Z]/g, '').length > message.length / 2 || message.replace(/[^!]/g, '').length >= 3;
}

// Correctly capitalize the string as a sentence (e.g. uppercase after dots)
// and remove exclamation points.
function stopShouting(message) {
  return capitalizeSentence(message.toLowerCase()).replace(/!+/g, '.');
}


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
