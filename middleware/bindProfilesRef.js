import { fireDb } from '~/plugins/firebase'

export default async function ({ store }) {

  const isAuthenticated = store => {
    return store && store.state.auth && store.state.auth.user;
  };

  if (isAuthenticated(store)) {
    const userId = store.state.auth.user.userId
    console.log("​userId", userId)
    fireDb.collection('profiles').doc(userId).get()
      .then(snapshot => {
        store.dispatch('setCurrentUserProfile', snapshot.ref)
      })

    const socialsRef = await fireDb.collection('profiles').doc(userId).collection('socials')
    store.dispatch('setSocialAccounts', socialsRef)





    // store.dispatch('setCurrentUserProfile', profileId)
    // store.dispatch('setProfilesRef')
  }


}
