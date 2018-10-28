import firebaseConfig from "~/firebase";
import firebase from "firebase";

if (!firebaseConfig) {
  throw new Error("missing firebase.json config.");
}

export default function({ store, redirect, route }) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  return firebase.auth().onAuthStateChanged(user => {
    if (user) {
      store.commit("setUser", user);
    }
  });
}
