<template>
  <div class="chatRoom container">
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
  border: 1px solid green;
  height: 900px;
}
.chatRoom__input {
  border: 1px solid yellow;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
