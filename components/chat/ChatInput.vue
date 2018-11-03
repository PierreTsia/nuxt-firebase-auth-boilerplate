<template>
  <div class="chatInput is-full p-4">
    <textarea v-model="messageText" class="textarea" placeholder="e.g. Hello world"></textarea>

    <input @click="handleSubmitMessage" class="mt-4 button is-primary is-large" type="submit" value="Send">

  </div>  
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: "ChatInput",
  data() {
    return {
      message: "chatInput",
      messageText: "",
    };
  },
  computed: {
    ...mapState(["user", "account"]),
  },
  methods: {
    ...mapActions(['postMessage']),
    handleSubmitMessage(){
      if(!this.messageText.length){
        return
      }
      this.postMessage(this.messageText)
      this.messageText = ''
      
    }
  }
};
</script>

<style scoped>
.chatInput {
  height: 100%;
  flex-grow: 1;
}
</style>
