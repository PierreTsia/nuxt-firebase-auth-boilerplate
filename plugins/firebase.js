import firebase from 'firebase/app'
import 'firebase/firestore'
if (!firebase.apps.length) {
  const config = {
    apiKey: "AIzaSyARCCQ-Kg_zzifXQFxFukT4ToJUwnPODEs",
    authDomain: "meet-my-candidate.firebaseapp.com",
    databaseURL: "https://meet-my-candidate.firebaseio.com",
    projectId: "meet-my-candidate",
    storageBucket: "meet-my-candidate.appspot.com",
    messagingSenderId: "252978082077"
  }
  firebase.initializeApp(config)
  firebase.firestore().settings({ timestampsInSnapshots: true })
}
const fireDb = firebase.firestore()
export { fireDb }