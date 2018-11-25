// const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')();
const vision = require('@google-cloud/vision')();
// const spawn = require('child-process-promise').spawn;
// const path = require('path');
// const os = require('os');
// const fs = require('fs');


exports.handler = function (object, database) {
  const messageId = object.name.split('/')[1]
  /*  [ 'chat', '-LSA4NJnRVmkwvy1LMuO', 'images', 'test.png' ] */

  const file = gcs.bucket(object.bucket).file(object.name);
  return vision.detectSafeSearch(file).then((data) => {
    const safeSearch = data[0];

    const msgRef = database.ref(`chat/message/${messageId}`)
    msgRef.once('value').then(snapshot => console.log(snapshot.DataSnapshot))
    msgRef.once('value').then(DataSnapshot => console.log(DataSnapshot))


    console.log('SafeSearch results on image', safeSearch);
    const flags = []

    for (let flag in safeSearch) {
      if (safeSearch[flag] === true) {
        flags.push(flag)
      }
    }

    if (flags.length) {
      return database
        .ref("chat")
        .child(`messages/${messageId}`)
        .update({
          imgModerated: true,
          imgFlags: flags.join('/'),
        })
      // return blurImage(object.name, object.bucket, object.metadata);
    }
    return database
      .ref("chat")
      .child(`messages/${messageId}`)
      .update({
        imgModerated: true,
        imgFlags: "",
      })
  });

}


/**
 * Blurs the given image located in the given bucket using ImageMagick.
 */
/* function blurImage(filePath, bucketName, metadata) {
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const bucket = gcs.bucket(bucketName);

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    console.log('Temporary directory has been created', tempLocalDir);
    // Download file from bucket.
    return bucket.file(filePath).download({ destination: tempLocalFile });
  }).then(() => {
    console.log('The file has been downloaded to', tempLocalFile);
    // Blur the image using ImageMagick.
    return spawn('convert', [tempLocalFile, '-channel', 'RGBA', '-blur', '0x8', tempLocalFile]);
  }).then(() => {
    console.log('Blurred image created at', tempLocalFile);
    // Uploading the Blurred image.
    return bucket.upload(tempLocalFile, {
      destination: filePath,
      metadata: { metadata: metadata }, // Keeping custom metadata.
    });
  }).then(() => {
    console.log('Blurred image uploaded to Storage at', filePath);
    fs.unlinkSync(tempLocalFile);
    return console.log('Deleted local file', filePath);
  });
} */