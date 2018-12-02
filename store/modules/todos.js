
import { firebaseAction } from "vuexfire";
import { fireDb } from '~/plugins/firebase'






export default {
  state: {
    todos: []
  },
  getters: {
    allTodos: state => state.todos
  },

  actions: {
    async addTodo({ commit }, newTodo) {
      const ref = await fireDb.collection('todos').doc()
      const todo = { data: Date.now(), text: newTodo, id: ref.id, done: false }
      await ref.set({ todo })
    },
    setTodosRef: firebaseAction(({ bindFirebaseRef }) => {
      const ref = fireDb.collection('todos')
      console.log("​ref", ref)

      bindFirebaseRef('todos', ref)
      /* */


    }),
  }
};