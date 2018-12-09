import * as firebase from 'firebase';
import 'firebase/firestore';
// import _ from "lodash";
import { firebaseAction } from "vuexfire";
import { fireDb } from '~/plugins/firebase'



function createNewAccount(user) {
  const { displayName, email, uid, photoURL } = user
  return fireDb.collection('accounts')
    .doc(`${uid}`)
    .set({
      displayName: displayName || email.split("@")[0],
      email: email,
      image: photoURL || "/images/default-profile.png",
      userId: uid,
    })
}


export default {
  state: {
    user: null,
    accounts: [],

  },
  getters: {
    isAuthenticated: state => !!state.user,
    user: state => state.user,
    userAccount: state => state.accounts.find(acc => acc.userId === state.user.userId)
  },
  mutations: {
    setUser(state, user) {
      const { uid } = user

      state.user = { userId: uid }

      // return this.dispatch("setAccountRef");
    },
  },
  actions: {
    setAccountsRef: firebaseAction(({ bindFirebaseRef }) => {
      const ref = fireDb.collection('accounts')
      bindFirebaseRef('accounts', ref)
    }),
    resetUser({ state }) {
      state.user = null;
    },
    userCreate({ state, commit }, account) {
      return firebase
        .auth()
        .createUserWithEmailAndPassword(account.email, account.password)
        .then(response => {
          createNewAccount(response.user);
          return commit("setUser", response.user);
        });
    },
    userGoogleLogin({ commit }) {
      firebase.auth().useDeviceLanguage();
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/plus.login");
      provider.setCustomParameters({
        login_hint: "user@example.com"
      });
      return firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          createNewAccount({
            newImage: result.additionalUserInfo.profile.picture,
            ...result.user
          });
          return commit("setUser", result.user);
        })
        .catch(error => {
          console.log(error);
        });
    },
    userGithubLogin({ commit }) {
      firebase.auth().useDeviceLanguage();
      const provider = new firebase.auth.GithubAuthProvider();
      provider.addScope("user:email");
      return firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          createNewAccount({
            newImage: result.additionalUserInfo.profile.avatar_url,
            ...result.user
          });
          return commit("setUser", result.user);
        })
        .catch(error => {
          console.log(error);
        });
    },
    userLogin({ state, commit }, account) {
      return firebase
        .auth()
        .signInWithEmailAndPassword(account.email, account.password)
        .then(user => {
          console.log("​userLogin -> user", user)
          return commit("setUser", user.user);
        });
    },
    userLogout({ state }) {
      return firebase
        .auth()
        .signOut()
        .then(() => {
          this.dispatch("resetUser");
        });
    },
    userUpdate({ state }, newUserData) {
      console.log("​userUpdate -> newUserData", newUserData)
      const { displayName, userId } = newUserData
      console.log("​userUpdate -> userId", userId)
      console.log("​userUpdate -> displayName", displayName)
      return fireDb
        .collection('accounts')
        .doc(userId)
        .update({ displayName })
    },
    userUpdateImage({ state }, image) {
      return firebase
        .database()
        .ref(`accounts/${state.user.uid}`)
        .update({
          image
        });
    },

  }
};