import Vuex from "vuex";
import firebase from "firebase";
import { firebaseMutations, firebaseAction } from "vuexfire";
import _ from "lodash";

function createNewAccount(user) {
  return firebase
    .database()
    .ref(`accounts/${user.uid}`)
    .set({
      displayName: user.displayName || user.email.split("@")[0],
      email: user.email,
      image: user.newImage || "/images/default-profile.png"
    });
}

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: null,
      account: null,
      messages: []
    },
    getters: {
      isAuthenticated: state => !!state.user,
      allMessages: state =>
        _.compact(Object.values(_.omit(state.messages, [".key"])))
    },
    actions: {
      // User
      setAccountRef: firebaseAction(({ bindFirebaseRef }, path) => {
        return bindFirebaseRef("account", firebase.database().ref(path));
      }),
      resetUser({ state }) {
        state.user = null;
      },
      userCreate({ state }, account) {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(account.email, account.password)
          .then(user => {
            console.log("TCL: userCreate -> user", user);
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

      // chat
      setMessagesRef: firebaseAction(({ bindFirebaseRef }, path) => {
        return bindFirebaseRef("messages", firebase.database().ref(path));
      }),

      async postMessage({ state, commit }, messageData) {
        console.log("​postMessage -> messageData", messageData)
        const newPostKey = firebase
          .database()
          .ref()
          .child("message")
          .push().key;

        firebase
          .database()
          .ref("chat")
          .child(`messages/${newPostKey}`)
          .set({
            authorName: state.account.displayName,
            authorId: state.user.uid,
            content: messageData.text,
            authorImage: state.account.image,
            date: Date.now(),
            messageId: newPostKey
          });

        if (messageData.img) {
          // const img = {}
          const storageRef = firebase.storage().ref(`chat/${newPostKey}/`);
          const storedImg = await storageRef
            .child(`images/${messageData.img.name}`)
            .put(messageData.img)

          console.log("​postMessage -> storedImg", storedImg)

          const img = { url: storedImg.downloadURL, fullPath: storedImg.ref.fullPath }
          console.log("​postMessage -> img", img)

          firebase
            .database()
            .ref("chat")
            .child(`messages/${newPostKey}`)
            .update({
              img,
              imgModerated: false
            });

        }



      },

      fetchMessages({ state, commit }) {
        return firebase
          .database()
          .ref("messages")
          .on("value", snapshot => {
            console.log(snapshot.val())
            return commit("setMessages", snapshot.val());
          });
      },

      likeMessage({ state, commit }, messageId) {
        return firebase
          .database()
          .ref("chat")
          .child(`messages/${messageId}/likes`)
          .push(state.user.uid);
      },

      removeLikeMessage({ state, commit }, { messageId, likeId }) {
        return firebase
          .database()
          .ref("chat")
          .child(`messages/${messageId}/likes/${likeId}`)
          .remove();
      },

      dislikeMessage({ state, commit }, messageId) {
        return firebase
          .database()
          .ref("chat")
          .child(`messages/${messageId}/dislikes`)
          .push(state.user.uid);
      },

      removeDislikeMessage({ state, commit }, { messageId, dislikeId }) {
        console.log("store", dislikeId);
        return firebase
          .database()
          .ref("chat")
          .child(`messages/${messageId}/dislikes/${dislikeId}`)
          .remove();
      },

      updateMessage({ state, commit }, { messageId, content }) {
        console.log("TCL: updateMessage -> content", content);
        console.log("TCL: updateMessage -> messageId", messageId);
        return firebase
          .database()
          .ref("chat")
          .child(`messages/${messageId}`)
          .update({ content, flags: false })
      },

      deleteMessageImg({ state, commit }, { messageId, path }) {
        console.log("​deleteMessageImg -> messageId", messageId)
        return firebase
          .database()
          .ref('chat')
          .child(`messages/${messageId}/img`)
          .remove()
          .then(() => {
            const ref = firebase.storage().ref(path)
            ref.delete()
              .then(snapshot => console.log(snapshot))
          })
      },

      deleteMessage({ store, commit }, messageId) {
        return firebase
          .database()
          .ref("chat")
          .child(`messages/${messageId}`)
          .remove();
      }
    },
    mutations: {
      ...firebaseMutations,
      setUser(state, user) {
        state.user = user;
        return this.dispatch("setAccountRef", `accounts/${state.user.uid}`);
      },
      setMessages(state, messages) {
        state.messages = messages;
        return this.dispatch("setMessagesRef", "chat/messages");
      }
    }
  });
};

export default createStore;
