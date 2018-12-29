<template>
  <div class="columns column is-12 chatInput mt-2">
    <div class="column is-half">
      <textarea v-model="messageText" class="mb-4 textarea" placeholder="e.g. Hello world"></textarea>
    </div>
    <div class="column is-one-fourth">
      <div id="preview">
        <img v-if="tempUrl" :src="tempUrl" />
      </div>
    </div>
    <div class="column is-one-fourth">
      <input @click="handleSubmitMessage" class="mb-2 button is-primary is-large is-fullwidth" type="submit" value="Send">
      <input id="imageInput" class="input" type="file" accept="image/*" placeholder="Image" v-on:change="uploadMessageImage" ref="imageInput">
      <a @click="handleUploadImageClick" type="file" accept="image/*" :class="{'button': true,  'is-large': true,  'is-link': true, 'is-loading': false, 'is-fullwidth': true}">
        <IconUpload class="icon icon-white" />
      </a>
    </div>
  </div>

  </div>
</template>
<script>
// import firebase from "firebase";
import { mapState, mapActions } from "vuex";
import { IconUpload } from "~/components/utils/icons";

export default {
  name: "ChatInput",
  components: {
    IconUpload,
  },
  data() {
    return {
      message: "chatInput",
      messageText: "",
      isLoading: false,
      tempUrl: null,
      img: {
        url: "",
        fullPath: "",
      },
    };
  },
  computed: {
    ...mapState(["user", "account"]),
  },
  methods: {
    ...mapActions(["postMessage"]),
    handleSubmitMessage() {
      if (!this.messageText.length && !this.$refs.imageInput.value) {
        return;
      }
      const img = this.$refs.imageInput.files[0] || null;
      // console.log("exact link", tempRef.child(`images/${img.name}`));
      console.log("​handleSubmitMessage -> this.", this.messageText);

      this.postMessage({
        text: this.messageText,
        img,
      });

      this.messageText = "";
      this.tempUrl = "";
      this.$refs.imageInput.value = null;
    },
    handleUploadImageClick() {
      this.$refs.imageInput.click();
    },
    uploadMessageImage() {
      // this.resetFormMessages();
      this.isLoading = true;
      const img = this.$refs.imageInput.files[0];
      this.tempUrl = URL.createObjectURL(img);
    
    },
  },
};
</script>

<style lang="scss"scoped>
.chatInput {
  height: 100%;
  background-color: white;
 
}

#imageInput {
  display: none;
}

.imgPreview {
  max-width: 70px;
  max-height: auto;
}
</style>
