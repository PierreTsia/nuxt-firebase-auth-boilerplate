import { firebaseAction } from "vuexfire";
import { fireDb } from '~/plugins/firebase'
import * as firebase from 'firebase'
import _ from 'lodash'


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
        messageId: ref.id,
        likes: [],
        dislikes: []

      })


      if (messageData.img) {
        const storageRef = firebase.storage().ref(`chat/${ref.id}/`);
        const storedImg = await storageRef
          .child(`images/${messageData.img.name}`)
          .put(messageData.img)

        const url = await storageRef.child(`images/${messageData.img.name}`).getDownloadURL()
        const img = await { url, fullPath: storedImg.ref.fullPath }
        const messageRef = await fireDb.collection('messages').doc(ref.id)

        await messageRef
          .update({
            img,
            imgModerated: false
          })

      }
    },

    async likeMessage({ state, rootState, commit }, messageId) {
      const userId = rootState.auth.user.uid
      const docRef = await fireDb.collection("messages")
        .doc(`/${messageId}`)
        .get()

      const existingLikes = docRef.data().likes

      return fireDb
        .collection("messages")
        .doc(`/${messageId}`)
        .update({ likes: _.concat(existingLikes, userId) })

    },

    async removeLikeMessage({ state, rootState, commit }, { messageId, likeId }) {
      const userId = rootState.auth.user.uid
      const docRef = await fireDb.collection("messages")
        .doc(`/${messageId}`)
        .get()

      const existingLikes = docRef.data().likes
      return fireDb
        .collection("messages")
        .doc(`/${messageId}`)
        .update({ likes: _.without(existingLikes, userId) })
    },

    async dislikeMessage({ state, rootState, commit }, messageId) {
      const userId = rootState.auth.user.uid
      const docRef = await fireDb.collection("messages")
        .doc(`/${messageId}`)
        .get()

      const existingDislikes = docRef.data().dislikes

      return fireDb
        .collection("messages")
        .doc(`/${messageId}`)
        .update({ dislikes: _.concat(existingDislikes, userId) })
    },

    async removeDislikeMessage({ state, rootState, commit }, { messageId, dislikeId }) {
      const userId = rootState.auth.user.uid
      const docRef = await fireDb.collection("messages")
        .doc(`/${messageId}`)
        .get()

      const existingDislikes = docRef.data().dislikes
      return fireDb
        .collection("messages")
        .doc(`/${messageId}`)
        .update({ dislikes: _.without(existingDislikes, userId) })
    },

    updateMessage({ state, commit }, { messageId, content }) {
      return fireDb
        .collection('messages')
        .doc(messageId)
        .update({ content, flags: false })
    },

    deleteMessageImg({ state, commit }, { messageId, path }) {
      return fireDb
        .collection('messages')
        .doc(messageId)
        .update({ img: firebase.firestore.FieldValue.delete(), imgModerated: firebase.firestore.FieldValue.delete() })
    },

    deleteMessage({ store, commit }, messageId) {
      return fireDb
        .collection('messages')
        .doc(messageId)
        .delete();
    }
  }
};