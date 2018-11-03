<template>
  <div class="chatFeed">
    <ChatMessage v-if="!noMessages" v-for="message in displayMessages" :key="message.messageId" :message="message"/>
    <div v-else class="no__message container">
      <div class="notification has-text-info has-text-centered">
        There are <strong>no messages</strong> yet!  Shoot the first one.
      </div>
    </div> 
    
    
  </div>
</template>
<script>
import ChatMessage from "~/components/chat/ChatMessage.vue";
import { mapState } from 'vuex';
import _ from 'lodash'

export default {
  name: "ChatFeed",
  data(){
    return {
    }
  },
  components: {
    ChatMessage
  },
  computed: {
    ...mapState(['messages']),
    displayMessages(){
      return _.omit(this.messages, ['.key'])
    },
    noMessages(){
      return this.messages['.value'] === null
    }
  },
 
};
</script>
<style lang="scss" scoped>
.chatFeed {
  width: 100%;
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: inset 0px 0px 10px rgba(0,0,0,0.3);
  .no__message{
    height: 50vh;
    padding: 20px
  } 
}

.title {
  position: absolute;
  top: 0px;
  border: 1px solid red;
  width: 100%;
}
</style>
