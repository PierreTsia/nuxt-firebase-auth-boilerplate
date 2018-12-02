import Vuex from "vuex";
import auth from './modules/auth'
import messages from './modules/messages'
import todos from './modules/todos'
import { firebaseMutations } from "vuexfire";



const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth,
      messages,
      todos
    },
    mutations: {
      ...firebaseMutations
    }
  });
};

export default createStore;
