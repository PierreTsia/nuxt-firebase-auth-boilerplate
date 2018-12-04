const capitalizeSentence = require('capitalize-sentence');
const Filter = require('bad-words');
const badWordsFilter = new Filter();
const frenchBadWords = require('french-badwords-list')
badWordsFilter.addWords(frenchBadWords.array)

exports.handler = function (message, db) {

  console.log("retrieved message", message)

  if (message) {
    // Run moderation checks on on the message and moderate if needed.
    const moderatedMessage = moderateMessage(message);

    // Update the Firebase DB with checked message.
    console.log('Message has been moderated. Saving to DB: ', moderatedMessage);
    return db.collection('messages').doc(message.messageId).update({
      content: moderatedMessage.content,
      moderated: moderatedMessage.flags.length > 0,
      flags: moderatedMessage.flags || []
    });
  }
  return null;
}

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
    flags.push('Caps Lock')
  }

  // Moderate if the user uses SwearWords.
  if (containsSwearwords(message.content)) {
    console.log('User is swearing. moderating...');
    message.content = moderateSwearwords(message.content);
    flags.push('Bad Words')

  }
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
