import { firebaseAction } from "vuexfire";
import { fireDb } from '~/plugins/firebase'
import * as firebase from 'firebase'
import _ from 'lodash'


export default {
  state: {
    messages: []
  },
  getters: {
    allMessages: state => state.messages,
    sortedMessages: state => state.messages.sort((msgA, msgB) => msgA.date < msgB.date ? 1 : -1),
  },
  mutations: {

  },
  actions: {
    setMessagesRef: firebaseAction(({ bindFirebaseRef }) => {
      const ref = fireDb.collection("messages")
      return bindFirebaseRef("messages", ref);
    }),

    async postMessage({ state, rootGetters, commit }, messageData) {
      console.log("​postMessage -> rootGetters", rootGetters)
      const ref = await fireDb.collection('messages').doc()
      await ref.set({
        authorName: rootGetters.userAccount.displayName,
        authorId: rootGetters.userAccount.userId,
        content: messageData.text,
        authorImage: rootGetters.userAccount.image,
        date: Date.now(),
        messageId: ref.id,
        likes: [],
        dislikes: []

      })


      if (messageData.img) {
        console.log("​postMessage -> messageData.img", messageData.img)
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

    async likeMessage({ state, rootGetters, commit }, messageId) {
      const userId = rootGetters.userAccount.userId
      const docRef = await fireDb.collection("messages")
        .doc(`/${messageId}`)
        .get()

      const existingLikes = docRef.data().likes

      return fireDb
        .collection("messages")
        .doc(`/${messageId}`)
        .update({ likes: _.concat(existingLikes, userId) })

    },

    async removeLikeMessage({ state, rootGetters, commit }, { messageId, likeId }) {
      const userId = rootGetters.userAccount.userId
      const docRef = await fireDb.collection("messages")
        .doc(`/${messageId}`)
        .get()

      const existingLikes = docRef.data().likes
      return fireDb
        .collection("messages")
        .doc(`/${messageId}`)
        .update({ likes: _.without(existingLikes, userId) })
    },

    async dislikeMessage({ state, rootGetters, commit }, messageId) {
      const userId = rootGetters.userAccount.userId
      const docRef = await fireDb.collection("messages")
        .doc(`/${messageId}`)
        .get()

      const existingDislikes = docRef.data().dislikes

      return fireDb
        .collection("messages")
        .doc(`/${messageId}`)
        .update({ dislikes: _.concat(existingDislikes, userId) })
    },

    async removeDislikeMessage({ state, rootGetters, commit }, { messageId, dislikeId }) {
      const userId = rootGetters.userAccount.userId
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