<template>
  <div class="chatInput is-full">
    <h1>{{message}}</h1>  
  </div>  
</template>
<script>
export default {
  name: "ChatInput",
  data() {
    return {
      message: "chatInput"
    };
  }
};
</script>

<style scoped>
.chatInput {
  height: 100%;
  border: 1px solid orange;
  flex-grow: 1;
}
</style>
