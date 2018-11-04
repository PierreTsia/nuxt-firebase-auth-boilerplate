<template>
  <div class="chatRoom">
    <div class="chatRoom__chatFeed container">
      <ChatFeed/>
    </div>
      <ChatInput/>
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
  max-height: 800px;
  overflow: auto;
}
</style>
