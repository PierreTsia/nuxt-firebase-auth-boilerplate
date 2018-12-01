import Vuex from "vuex";
import auth from './modules/auth'
import messages from './modules/messages'


const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth,
      messages
    }
  });
};

export default createStore;
