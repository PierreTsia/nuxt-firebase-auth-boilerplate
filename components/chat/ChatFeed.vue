<template>
  <div class="chatFeed">
    <h4>{{message}}</h4>
  </div>
</template>
<script>
export default {
  name: "ChatFeed",
  data() {
    return {
      message: "chat room!"
    };
  }
};
</script>
<style scoped>
.chatFeed {
  width: 100%;
  padding: 0;
  border: 1px solid red;
  height: 100%;
}
</style>
