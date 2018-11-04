<template>
  <div class="chatFeed mt-2">
    <div v-if="noMessages" class="no__message container">
      <div class="notification has-text-info has-text-centered">
        There are <strong>no messages</strong> yet!  Shoot the first one.
      </div>
    </div>
    <div ref="messagesFeed" v-else>
     <ChatMessage
      :id="message.messageId"  
      v-for="message in allMessages" 
      :key="message.messageId" 
      :message="message"/> 
    </div>
  </div>
</template>
<script>
import ChatMessage from "~/components/chat/ChatMessage.vue";
import { mapGetters } from "vuex";

// import { scroller } from "vue-scrollto/src/scrollTo";

export default {
  name: "ChatFeed",
  data() {
    return {
      lastChildDiv: null
    };
  },
  components: {
    ChatMessage
  },
  computed: {
    ...mapGetters(["allMessages"]),

    noMessages() {
      return !this.allMessages.length;
    }
  },
  watch: {
    allMessages(curr, old) {
      if (curr.length > old.length) {
        this.updateLastChildDiv();
      }
    }
  },
  updated() {
    // this.updateLastChildDiv();
    console.log(this.$el);
  },
  methods: {
    updateLastChildDiv() {
      if (this.$refs.messagesFeed) {
        this.$nextTick(() => {
          this.lastChildDiv = this.$refs.messagesFeed.lastChild;
          console.log(this.lastChildDiv);
          this.lastChildDiv.scrollIntoView();
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.chatFeed {
  .no__message {
    height: 50vh;
    padding: 20px;
  }
}

.title {
  position: absolute;
  top: 0px;
  border: 1px solid red;
  width: 100%;
}
</style>
