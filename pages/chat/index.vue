<template>
  <div class="p-6">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="title">Stats</p>
          <p class="subtitle">Some numbers</p>
        </article>
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-12">
        <div class="tile">
          <div class="tile is-parent is-vertical is-2">
            
            <article class="tile is-child box">
              <p class="title">Users</p>
              <p class="subtitle">Subtitle</p>
              <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend, nunc dui porta orci, quis semper odio felis ut quam.</p>
              </div>
            </article>
          </div>
          <div class="tile is-8 is-vertical">
            <div class="tile">
              <div class="tile is-parent">
                <article class="tile is-child box">
                  <ChatInput/>
                </article>
              </div>
             
            </div>
            <div class="tile is-parent">
              <article class="tile is-child">
                <ChatFeed/>
              </article>
            </div>
          </div>
            <div class="tile is-2 is-vertical">
              <div class="tile">
                <div class="tile is-parent">
                  <article class="tile is-child box">
                    <p class="title">Options</p>
                    <p class="subtitle">Subtitle</p>
                     <div class="content">
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend, nunc dui porta orci, quis semper odio felis ut quam.</p>
                    </div>
                  </article>
                </div>
              </div>
          </div>
        </div>
        <div class="tile">
        
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Footer</p>
              <p class="subtitle">Subtitle</p>
              <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChatInput from "~/components/chat/ChatInput.vue";
import ChatFeed from "~/components/chat/ChatFeed.vue";


export default {
  name: "chat",
  middleware: "bindMessagesRef",
  components: {
    ChatInput,
    ChatFeed,
  },
  data() {
    return {
      message: "Welcome in chat room",
    };
  },
};
</script>
<style lang="scss" scoped>
.chatRoom__chatFeed {
  overflow: auto;
}
</style>
