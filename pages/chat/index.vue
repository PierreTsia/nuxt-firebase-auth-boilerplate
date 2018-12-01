<template>
  <div class="chatRoom columns p-4">
      <div class="column is-half-desktop is-12-mobile">
        <ChatInput/>
      </div>          
      <div class="column is-half-desktop is-12-mobile chatRoom__chatFeed">
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
