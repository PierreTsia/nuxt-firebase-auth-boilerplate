import firebase from "firebase";
import _ from "lodash";
import { firebaseMutations, firebaseAction } from "vuexfire";


export default {
  state: {
    messages: []
  },
  getters: {
    allMessages: state =>
      _.compact(Object.values(_.omit(state.messages, [".key"])))
  },
  mutations: {
    ...firebaseMutations,
    setMessages(state, messages) {
      state.messages = messages;
      return this.dispatch("setMessagesRef", "chat/messages");
    }

  },
  actions: {
    setMessagesRef: firebaseAction(({ bindFirebaseRef }, path) => {
      return bindFirebaseRef("messages", firebase.database().ref(path));
    }),

    async postMessage({ state, rootState, commit }, messageData) {
      console.log("​postMessage -> rootState", rootState)
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
          authorName: rootState.auth.account.displayName,
          authorId: rootState.auth.user.uid,
          content: messageData.text,
          authorImage: rootState.auth.account.image,
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

    likeMessage({ state, rootState, commit }, messageId) {
      return firebase
        .database()
        .ref("chat")
        .child(`messages/${messageId}/likes`)
        .push(rootState.auth.user.uid);
    },

    removeLikeMessage({ state, commit }, { messageId, likeId }) {
      return firebase
        .database()
        .ref("chat")
        .child(`messages/${messageId}/likes/${likeId}`)
        .remove();
    },

    dislikeMessage({ state, rootState, commit }, messageId) {
      return firebase
        .database()
        .ref("chat")
        .child(`messages/${messageId}/dislikes`)
        .push(rootState.auth.user.uid);
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
  }
};