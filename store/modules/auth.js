import * as firebase from 'firebase';
import 'firebase/firestore';
// import _ from "lodash";
import { firebaseAction } from "vuexfire";
import { fireDb } from '~/plugins/firebase'



function createNewAccount(user) {
  fireDb.collection('accounts')
    .doc(`${user.uid}`)
    .set({
      displayName: user.displayName || user.email.split("@")[0],
      email: user.email,
      image: user.newImage || "/images/default-profile.png"
    })
}


export default {
  state: {
    user: null,
    accounts: [],
  },
  getters: {
    isAuthenticated: state => !!state.user,
    user: state => state.user
  },
  mutations: {
    setUser(state, user) {
      state.user = user;

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
    userCreate({ state }, account) {
      return firebase
        .auth()
        .createUserWithEmailAndPassword(account.email, account.password)
        .then(user => {
          return createNewAccount(user);
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
    userLogin({ state }, account) {
      return firebase
        .auth()
        .signInWithEmailAndPassword(account.email, account.password)
        .then(user => {
          return this.dispatch("setUser", user);
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
    userUpdate({ state }, newData) {
      return firebase
        .database()
        .ref(`accounts/${state.user.uid}`)
        .update({
          displayName: newData.displayName
        });
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