<template>
  <div class="dashboard container">
    <div class="tile is-ancestor">
      <div v-if="userAccount" class="tile is-parent is-5">
        <UserCard @onImageChange="handleDisplayImgModal" :user="userAccount" />
        <div :class="['modal', {'is-active': displayImgModal}]">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Change profile picture</p>
              <button @click="handleCloseModal" class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
              <div class="modal__avatar container">
                <Avatar v-if="!isEdited" :imgUrl="userAccount.image" size="big" />
                <Avatar v-else :imgUrl="tempUserImageUrl" size="big" />

                <a @click="handleUploadNewUserImageClick" class="button is-info is-rounded">
                  <span>Upload</span>
                  <IconUpload class="icon icon-normal icon-white" />
                  <input id="imageInput" class="input" type="file" accept="image/*" placeholder="Image" v-on:change="uploadNewUserImage" ref="imageInput">
                </a>
              </div>
            </section>
            <footer class="modal-card-foot">
              <button @click="handleConfirmNewUserImageClick" class="button is-success">Confirm</button>
              <button @click="handleCloseModal" class="button">Cancel</button>
            </footer>
          </div>
        </div>
      </div>

      <div class="tile is-parent">
        <UserCategories/>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-vertical is-8">
        <div class="tile">

          <div class="tile is-parent">
            <UserGallery/>
           <!--  <article class="tile is-child box">
              <p class="title">Gallery box</p>
              <p class="subtitle">Caroussel</p>
              <figure class="image is-4by3">
                <img src="https://bulma.io/images/placeholders/640x480.png">
              </figure>
            </article> -->
          </div>
        </div>
        <div class="tile is-parent is-12">
          <UserSuggestions/>
        </div>
      </div>
      <div class="tile is-parent is-vertical">
        <UserBio :bio="currentUserProfile.bio" :socialAccounts="userSocialAccounts" />
        <UserNotifications/>

      </div>

    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="title">Side column</p>
          <p class="subtitle">With some content</p>
          <div class="content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
          </div>
        </article>
      </div>
      <div class="tile is-parent is-8">
        <article class="tile is-child box">
          <p class="title">Main column</p>
          <p class="subtitle">With some content</p>
          <div class="content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
          </div>
        </article>
      </div>
    </div>
  </div>

</template>
<script>
import UserCard from "~/components/dashboard/UserCard.vue";
import UserBio from "~/components/dashboard/UserBio.vue";
import UserNotifications from "~/components/dashboard/UserNotifications.vue";
import UserSuggestions from "~/components/dashboard/UserSuggestions.vue";
import UserCategories from "~/components/dashboard/UserCategories.vue";
import UserGallery from "~/components/dashboard/UserGallery.vue";



import Avatar from "~/components/base/Avatar.vue";
import { IconUpload } from "~/components/utils/icons";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "dashboard",
  middleware: "bindProfilesRef",
  components: {
    UserCard,
    UserBio,
    UserCategories,
    UserNotifications,
    UserSuggestions,
    UserGallery,
    Avatar,
    IconUpload,
  },
  data() {
    return {
      displayImgModal: false,
      tempUserImageUrl: "",
    };
  },
  methods: {
    ...mapActions({
      userUpdateImage: "userUpdateImage",
      unbindCurrentUserProfile: "unbindCurrentUserProfile",
    }),
    handleDisplayImgModal() {
      this.displayImgModal = true;
    },
    handleCloseModal() {
      this.displayImgModal = false;
      this.tempUserImageUrl = "";
    },
    handleUploadNewUserImageClick() {
      this.$refs.imageInput.click();
    },
    uploadNewUserImage() {
      const img = this.$refs.imageInput.files[0];
      console.log("​uploadNewUserImage -> img", img);
      this.tempUserImageUrl = URL.createObjectURL(img);
      console.log(
        "​uploadNewUserImage -> this.tempUserImageUrl",
        this.tempUserImageUrl,
      );
    },
    handleConfirmNewUserImageClick() {
      this.userUpdateImage({
        image: this.$refs.imageInput.files[0],
        userId: this.userAccount.userId,
      });
      this.displayImgModal = false;
    },
  },
  computed: {
    ...mapGetters(["userAccount", "currentUserProfile", "userSocialAccounts"]),
    isEdited() {
      return this.tempUserImageUrl.length;
    },
  },
  mounted() {
    this.tempUserImageUrl = "";
  },
  beforeDestroy() {
    this.unbindCurrentUserProfile();
  },
};
</script>
<style lang="scss" scoped>
.dashboard {
  min-height: 95vh;
  padding-top: 10px;
  .is-ancestor {
  }
  .is-parent {
  }
}

.modal__avatar {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .button {
    margin-top: 20px;
  }
  #imageInput {
    display: none;
  }
}
</style>



