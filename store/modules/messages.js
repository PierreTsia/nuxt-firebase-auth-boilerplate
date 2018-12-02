import { firebaseAction } from "vuexfire";
import { fireDb } from '~/plugins/firebase'
import * as firebase from 'firebase'


export default {
  state: {
    messages: []
  },
  getters: {
    allMessages: state => state.messages
  },
  mutations: {

  },
  actions: {
    setMessagesRef: firebaseAction(({ bindFirebaseRef }) => {
      const ref = fireDb.collection("messages")
      return bindFirebaseRef("messages", ref);
    }),

    async postMessage({ state, rootState, commit }, messageData) {
      const ref = await fireDb.collection('messages').doc()
      await ref.set({
        authorName: rootState.auth.user.displayName,
        authorId: rootState.auth.user.uid,
        content: messageData.text,
        authorImage: rootState.auth.user.photoURL,
        date: Date.now(),
        messageId: ref.id
      })


      if (messageData.img) {
        const storageRef = firebase.storage().ref(`chat/${ref.id}/`);
        const storedImg = await storageRef
          .child(`images/${messageData.img.name}`)
          .put(messageData.img)

        const url = await storageRef.child(`images/${messageData.img.name}`).getDownloadURL()

        const img = await { url, fullPath: storedImg.ref.fullPath }

        const messageRef = await fireDb.collection('messages').doc(ref.id)
        await messageRef.update({
          img,
          imgModerated: false
        })

      }
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