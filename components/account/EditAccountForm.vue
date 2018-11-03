<template>
  <form>

    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          Edit your Profile
        </p>
       
      </header>
      <div class="card-content">
        <div class="content">
          <label class="text-inherit">Display Name</label>
          <input class="mb-4 input is-fullwidth" type="email" placeholder="Display Name" v-model="newData.displayName" v-on:input="updateField('displayName')">
          <div class="upload__image">
            <label class="text-inherit">Profile image</label>
            <input id="fileInput" class="input is-fullwidth" type="file" accept="image/*" placeholder="Profile Image"   v-on:change="updateProfileImage" ref="fileInput">
            <a @click="handleUploadImageClick" type="file" accept="image/*" class="button is-link">
              <IconUpload class="icon icon-white mr-2"/>
              Upload your image</a>
          </div>
          
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapState } from "vuex";
import firebase from "firebase";
import { IconUpload } from "~/components/utils/icons";

export default {
  components: {
    IconUpload
  },
  computed: mapState(["user", "account"]),
  data() {
    return {
      newData: {
        displayName: "",
        image: ""
      },
      debounceTimer: setTimeout(() => {}),
      formError: "",
      formSuccess: ""
    };
  },
  mounted() {
    this.newData.displayName = this.account.displayName;
    this.newData.image = this.account.image;
  },
  methods: {
    resetFormMessages() {
      this.formSuccess = this.formError = "";
    },
    updateField(key) {
      this.resetFormMessages();
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        console.info("update field", key);
        this.$store
          .dispatch("userUpdate", this.newData)
          .then(() => {
            this.formSuccess = "Successfully updated your account details";
          })
          .catch(err => {
            this.formError = "Error saving the profile changes";
            console.error(err);
          });
      }, 500);
    },
    handleUploadImageClick() {
      this.$refs.fileInput.click();
    },
    updateProfileImage() {
      this.resetFormMessages();
      const file = this.$refs.fileInput.files[0];
      const ref = firebase.storage().ref(`accounts/profile/${this.user.uid}`);
      ref
        .put(file)
        .then(snapshot => {
          return this.$store.dispatch("userUpdateImage", snapshot.downloadURL);
        })
        .then(() => {
          this.formSuccess = "Successfully uploaded a new profile image";
          // reset the form input
          this.$refs.fileInput.value = null;
        })
        .catch(err => {
          this.formError = "Error uploading new profile image";
          console.error(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
#fileInput {
  display: none;
}
.upload__image {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
}
</style>
