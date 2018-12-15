
import { firebaseAction } from "vuexfire";
import { fireDb } from '~/plugins/firebase'






export default {
  state: {
    profiles: [],
    currentUserProfile: {}
  },
  getters: {
    allProfiles: state => state.profiles,
    currentUserProfile: state => state.currentUserProfile
  },

  actions: {

    setProfilesRef: firebaseAction(({ bindFirebaseRef }) => {
      const ref = fireDb.collection('profiles')
      bindFirebaseRef('profiles', ref)
    }),

    setCurrentUserProfile: firebaseAction(({ bindFirebaseRef }, ref) => {
      console.log("​ref", ref)
      if (ref) {
        bindFirebaseRef('currentUserProfile', ref)
      }
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
        userProfile.set({ bio, userId })
      }
    },



  }

};