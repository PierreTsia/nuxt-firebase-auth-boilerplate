<template>
  <div class="chatInput is-full p-4">
    <textarea v-model="messageText" class="mb-4 textarea" placeholder="e.g. Hello world"></textarea>
    <img class="imgPreview" v-if="img.url.length" :src="img.url" alt="">
    <div class="columns">
      <div class="column">
        <input @click="handleSubmitMessage" class="button is-primary is-large" type="submit" value="Send">
      </div>
      <div class="column">
        <input id="imageInput" class="input" type="file" accept="image/*" placeholder="Image" v-on:change="uploadMessageImage" ref="imageInput">
        <a @click="handleUploadImageClick" type="file" accept="image/*" :class="{'button': true,  'is-large': true,  'is-link': true, 'is-loading': isLoading}">
          <IconUpload v-if="!isLoading" class="icon icon-white" />
        </a>
      </div>
    </div>

  </div>
</template>
<script>
import firebase from "firebase";
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
      if (!this.messageText.length) {
        return;
      }
      this.postMessage({
        text: this.messageText,
        img: {
          url: this.img.url.length ? this.img.url : null,
          fullPath: this.img.fullPath.length ? this.img.fullPath : null,
        },
      });
      this.messageText = "";
      this.img.url = "";
      this.$refs.imageInput.value = null;
    },
    handleUploadImageClick() {
      this.$refs.imageInput.click();
    },
    uploadMessageImage() {
      // this.resetFormMessages();
      this.isLoading = true;
      const img = this.$refs.imageInput.files[0];
      console.log("​uploadMessageImage -> img", img);
      const ref = firebase.storage().ref(`chat/${this.user.uid}/`);
      ref
        .child(`images/${img.name}`)
        .put(img)
        .then(snapshot => {
          console.log(snapshot);
          this.img.url = snapshot.downloadURL;
          this.img.fullPath = snapshot.ref.fullPath;
          this.isLoading = false;
        })

        .catch(err => {
          console.warn("Error uploading new profile image");
          console.error(err);
        });
    },
  },
};
</script>

<style lang="scss"scoped>
.chatInput {
  height: 100%;
  flex-grow: 1;
}

#imageInput {
  display: none;
}

.imgPreview {
  max-width: 70px;
  max-height: auto;
}
</style>
