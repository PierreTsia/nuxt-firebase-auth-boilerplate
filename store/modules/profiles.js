
import { firebaseAction } from "vuexfire";
import { fireDb } from '~/plugins/firebase';

export default {
  state: {
    profiles: [],
    currentUserProfile: {},
    socialAccounts: [],
  },
  getters: {
    allProfiles: state => state.profiles,
    currentUserProfile: state => state.currentUserProfile,
    userSocialAccounts: state => state.socialAccounts,
  },

  actions: {

    setProfilesRef: firebaseAction(({ bindFirebaseRef }) => {
      const ref = fireDb.collection('profiles')
      bindFirebaseRef('profiles', ref)
    }),

    setCurrentUserProfile: firebaseAction(({ bindFirebaseRef }, ref) => {
      if (ref) {
        bindFirebaseRef('currentUserProfile', ref)
      }
    }),

    setSocialAccounts: firebaseAction(({ bindFirebaseRef }, ref) => {
      bindFirebaseRef('socialAccounts', ref)
    }),

    unbindCurrentUserProfile: firebaseAction(({ unbindFirebaseRef }) => {
      console.log("unbinding")
      unbindFirebaseRef('currentUserProfile')
    }),

    async updateUserBio({ state }, newProfileData) {
      const { userId, bio } = newProfileData
      const userProfile = await fireDb
        .collection('profiles')
        .doc(userId)

      if (userProfile) {
        userProfile.update({ bio })
      }
    },

    async createUserBio({ state }, newProfileData) {
      const { userId, bio } = newProfileData
      const userProfile = await fireDb
        .collection('profiles')
        .doc(userId)

      if (userProfile) {
        userProfile.update({ bio, userId })
      }
    },

    async createUserSocialAccount({ rootGetters }, socialAccountData) {
      const userId = rootGetters.user.userId

      socialAccountData.forEach(account => {
        const provider = Object.keys(account)[0]
        const url = account[provider]

        fireDb
          .collection('profiles')
          .doc(userId)
          .collection('socials')
          .doc(provider)
          .set({ provider, url })
      })
    },

    async updateUserTags({ rootGetters }, tags) {
      const { newTags, existingTags } = tags
      console.log("​updateUserTags -> existingTags", existingTags)
      console.log("​updateUserTags -> newTags", newTags)
      const savedTags = []
      for (let tag of newTags) {
        const existingTagsRef = await fireDb.collection('tags').get()
        console.log("​updateUserTags -> existingTagsRef", existingTagsRef)
        for (let doc of existingTagsRef.docs) {
          const existingTag = doc.data()
          if (existingTag.label === tag.label) {
            console.log(`${tag.label} already exists dude!`)
            savedTags.push(existingTag)
            console.log('savedTags', savedTags)
          } else {
            const newTagRef = await fireDb.collection('tags').doc()
            savedTags.push({ ...tag, tagId: newTagRef.id })
            newTagRef.set({ ...tag, tagId: newTagRef.id })

          }
        }
      }

      const allTags = existingTags.concat(savedTags)
      console.log("​updateUserTags -> allTags", allTags)
      const userId = rootGetters.user.userId

      await fireDb.collection('profiles').doc(userId).update({ tags: allTags })

    }

  }

};