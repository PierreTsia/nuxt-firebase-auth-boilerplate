<template>
  <div class="dashboard container">
    <div class="tile is-ancestor">
      <div v-if="userAccount" class="tile is-parent is-8">
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
        <article class="tile is-child box">
          <p class="title">Favorite categories</p>
          <p class="subtitle">With some content</p>
          <div class="content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
          </div>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-vertical is-8">
        <div class="tile">

          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Gallery box</p>
              <p class="subtitle">Caroussel</p>
              <figure class="image is-4by3">
                <img src="https://bulma.io/images/placeholders/640x480.png">
              </figure>
            </article>
          </div>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">Wide column</p>
            <p class="subtitle">Aligned with the right column</p>
            <div class="content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
            </div>
          </article>
        </div>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="content">
            <p class="title">Bio</p>
            <p class="subtitle">With some content</p>
            <div class="content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend, nunc dui porta orci, quis semper odio felis ut quam.</p>
              <p>Suspendisse varius ligula in molestie lacinia. Maecenas varius eget ligula a sagittis. Pellentesque interdum, nisl nec interdum maximus, augue diam porttitor lorem, et sollicitudin felis neque sit amet erat. Maecenas imperdiet felis nisi, fringilla luctus felis hendrerit sit amet. Aenean vitae gravida diam, finibus dignissim turpis. Sed eget varius ligula, at volutpat tortor.</p>
              <p>Integer sollicitudin, tortor a mattis commodo, velit urna rhoncus erat, vitae congue lectus dolor consequat libero. Donec leo ligula, maximus et pellentesque sed, gravida a metus. Cras ullamcorper a nunc ac porta. Aliquam ut aliquet lacus, quis faucibus libero. Quisque non semper leo.</p>
            </div>
          </div>
        </article>
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
import Avatar from "~/components/base/Avatar.vue";
import { IconUpload } from "~/components/utils/icons";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "dashboard",
  components: {
    UserCard,
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
    ...mapActions({ userUpdateImage: "userUpdateImage" }),
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
    ...mapGetters(["userAccount"]),
    isEdited() {
      return this.tempUserImageUrl.length;
    },
  },
  mounted() {
    this.tempUserImageUrl = "";
  },
};
</script>
<style lang="scss" scoped>
.dashboard {
  min-height: 95vh;
  padding-top: 10px;
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



