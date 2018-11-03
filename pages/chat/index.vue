<template>
  <div class="chatRoom container is-fluid">
    <div class="chatRoom__feed">
      <ChatFeed/>
    </div>
    <div class="chatRoom__input">
      <ChatInput/>
    </div>
  </div>
  
</template>
<script>
import ChatInput from "~/components/chat/ChatInput.vue";
import ChatFeed from "~/components/chat/ChatFeed.vue";

export default {
  name: "chat",
  components: {
    ChatInput,
    ChatFeed
  },
  data() {
    return {
      message: "Welcome in chat room"
    };
  },
  mounted(){
    this.$store.dispatch('fetchMessages')
  }
};
</script>
<style scoped>
.chatRoom {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}
.chatRoom__feed {
  height: 850px;
}
.chatRoom__input {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
