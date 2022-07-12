const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

//     const original = event.data.val();

exports.addCreationDateToPost = functions.firestore
.document("/app/{instance}/posts/{userId}")
.onCreate((snapshot, context) => {
    return snapshot.ref.update({dateOfCreation: Date.now(),
     likes: 0,
    userLiked: []});
});
