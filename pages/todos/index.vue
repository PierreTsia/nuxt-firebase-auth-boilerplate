<template>
  <div class="chatRoom columns p-4">
    <span>todos</span>
    <input v-model="newTodo" type="text">
    <button @click="handleAddTodo" class="btn btn-danger"> add </button>
  </div>

</template>
<script>
export default {
  name: "todos",
  components: {},
  data() {
    return {
      newTodo: "",
    };
  },
  methods: {
    handleAddTodo() {
      if (this.newTodo.length) {
        this.$store.dispatch("addTodo", this.newTodo);
        this.newTodo = "";
      }
    },
  },
  mounted() {
    this.$store.dispatch("setTodosRef");
  },
};
</script>
<style lang="scss" scoped>
</style>
