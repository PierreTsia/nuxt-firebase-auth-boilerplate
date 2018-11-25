<template>
  <div class="chatRoom container">
      <ChatInput/>
    
    <div class="chatRoom__chatFeed">
      <ChatFeed/>
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
  mounted() {
    this.$store.dispatch("fetchMessages");
  }
};
</script>
<style lang="scss" scoped>
.chatRoom__chatFeed {
  overflow: auto;
}
</style>
