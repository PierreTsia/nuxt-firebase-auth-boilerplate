import Vuex from "vuex";
import auth from './modules/auth'
import messages from './modules/messages'
import profiles from './modules/profiles'
import { firebaseMutations } from "vuexfire";



const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth,
      messages,
      profiles
    },
    mutations: {
      ...firebaseMutations
    }
  });
};

export default createStore;
