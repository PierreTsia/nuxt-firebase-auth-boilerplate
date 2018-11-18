<template>
  <div>
    <div class="chatMessage pl-4 pr-4 mt-2 mb-2">
      <div class="box">

        <article class="media">
          <div class="media-left">
            <figure class="image is-64x64">
              <img :src="message.authorImage" alt="Profile pic">
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <div>
                <div class="content__header">
                  <strong class="mr-2">{{message.authorName}}</strong>
                  <small>
                    {{formatDate(message.date)}} ago
                  </small>
                  <small v-if="message.moderated" class="ml-3">
                   Moderation : <span v-for="flag in message.flags" class="ml-1 tag is-danger">{{flag}}</span>
                  </small>
                </div>
                <br>
                <span v-if="!isEditing">
                
                  <span>
                    {{message.content}}
                  </span>
                  <div class="mt-1 mb-1" v-if="message.img && message.img.url.length">
                    <img @click="handleImageClick" class="messageImg" :src="message.img.url" alt="">
                  </div>
                </span>
                <span v-else>
                  <input v-model="newContent" class="input" type="text" placeholder="Text input">
                  <div class="mt-1 mb-1" v-if="message.img && message.img.url.length">
                    <img class="messageImg" :src="message.img.url" alt="">
                    <span @click="handleDeleteImageClick">
                      <IconDelete class="icon icon-normal" />
                    </span>
                  </div>
                </span>
              </div>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                <a @click="handleLikeClick(message.messageId)" class="level-item" aria-label="like">
                  <small v-if="likesCount > 0 " class="counter mr-1">{{likesCount}}</small>
                  <span class="icon is-small">
                    <IconLike :class="{
                      'icon': true,  
                      'icon-info': userAlreadyLiked, 
                      'icon-default': !userAlreadyLiked
                    }" />
                  </span>
                </a>
                <a @click="handleUnlikeClick(message.messageId)" class="level-item" aria-label="unlike">
                  <small v-if="dislikesCount > 0 " class="counter mr-1">{{dislikesCount}}</small>
                  <span class="icon is-small">
                    <IconUnlike :class="{
                       'icon': true,  
                       'icon-danger': this.userAlreadyDisliked, 
                       'icon-default': !this.userAlreadyDisliked
                     }" />
                  </span>
                </a>
                <a class="level-item" aria-label="reply">
                  <span class="icon is-small">
                    <IconComment class="icon icon-grey" />
                  </span>
                </a>

              </div>

              <div class="level-right">

                <a @click="handleEditClick" v-if="currentUserIsAuthor(message.authorId) && !isEditing" class="level-item" aria-label="edit">
                  <span class="icon">
                    <IconPencil class="icon icon-big" />
                  </span>
                </a>
                <a @click="handleDeleteClick" v-if="currentUserIsAuthor(message.authorId) && !isEditing" class="level-item" aria-label="edit">
                  <span class="icon">
                    <IconDelete class="icon icon-big" />
                  </span>
                </a>
                <a v-if="currentUserIsAuthor(message.authorId) && isEditing" class="level-item" aria-label="edit">
                  <span @click="handleConfirmClick" class="icon">
                    <IconCheck class="icon icon-big icon-success" />
                  </span>
                  <span @click="handleCancelClick" class="icon">
                    <IconClose class="icon icon-big icon-danger" />
                  </span>
                </a>
              </div>
            </nav>
          </div>
        </article>

        <div :class="{'modal': true, 'is-active': modalIsActive}">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Confirm Deletion</p>
              <button @click="cancelModalClick" class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
              <div class="card-content">
                <div class="content">
                  Do you really want to delete your message?
                </div>
              </div>
            </section>
            <footer class="modal-card-foot">
              <button @click="confirmDeleteClick" class="button is-danger">Confirm</button>
              <button @click="cancelModalClick" class="button is-success">Cancel</button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import { mapState, mapActions } from "vuex";
// import firebase from "firebase";
import _ from "lodash";
import {
  IconLike,
  IconUnlike,
  IconComment,
  IconPencil,
  IconCheck,
  IconClose,
  IconDelete,
  IconStop,
} from "~/components/utils/icons";
import { distanceInWordsToNow } from "date-fns";
export default {
  name: "ChatMessage",
  components: {
    IconLike,
    IconUnlike,
    IconComment,
    IconPencil,
    IconCheck,
    IconClose,
    IconDelete,
    IconStop,
  },
  data() {
    return {
      newContent: "",
      isEditing: false,
      modalIsActive: false,
    };
  },
  props: {
    message: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  computed: {
    ...mapState(["user"]),
    likesUserIds() {
      return this.message.likes ? Object.values(this.message.likes) : [];
    },

    dislikesUserIds() {
      return this.message.dislikes ? Object.values(this.message.dislikes) : [];
    },

    likesCount() {
      return this.likesUserIds.length;
    },

    dislikesCount() {
      return this.dislikesUserIds.length;
    },

    userAlreadyLiked() {
      return this.likesUserIds.includes(this.user.uid);
    },

    userAlreadyDisliked() {
      return this.dislikesUserIds.includes(this.user.uid);
    },
  },
  methods: {
    ...mapActions([
      "likeMessage",
      "removeLikeMessage",
      "dislikeMessage",
      "removeDislikeMessage",
      "updateMessage",
      "deleteMessage",
      "deleteMessageImg",
    ]),

    formatDate(date) {
      return distanceInWordsToNow(date);
    },

    currentUserIsAuthor(authorId) {
      return authorId === this.user.uid;
    },

    handleDeleteClick() {
      this.modalIsActive = true;
    },

    cancelModalClick() {
      this.modalIsActive = !this.modalIsActive;
    },

    confirmDeleteClick() {
      this.deleteMessage(this.message.messageId);
    },

    handleEditClick() {
      this.isEditing = !this.isEditing;
      this.newContent = this.message.content;
    },

    handleCancelClick() {
      this.isEditing = false;
    },

    handleConfirmClick() {
      if (this.newContent.length) {
        this.updateMessage({
          messageId: this.message.messageId,
          content: this.newContent,
        }).then(() => {
          this.isEditing = false;
        });
      }
    },

    handleLikeClick(messageId) {
      if (this.userAlreadyDisliked) {
        const dislikeId = Object.keys(
          _.pickBy(this.message.dislikes, userId => userId === this.user.uid),
        )[0];
        this.removeDislikeMessage({ messageId, dislikeId });
      }
      if (!this.userAlreadyLiked) {
        this.likeMessage(messageId);
      } else {
        const likeId = Object.keys(
          _.pickBy(this.message.likes, userId => userId === this.user.uid),
        )[0];
        this.removeLikeMessage({ messageId, likeId });
      }
    },

    handleUnlikeClick(messageId) {
      if (this.userAlreadyLiked) {
        const likeId = Object.keys(
          _.pickBy(this.message.likes, userId => userId === this.user.uid),
        )[0];
        this.removeLikeMessage({ messageId, likeId });
      }
      if (!this.userAlreadyDisliked) {
        this.dislikeMessage(messageId);
      } else {
        const dislikeId = Object.keys(
          _.pickBy(this.message.dislikes, userId => userId === this.user.uid),
        )[0];
        this.removeDislikeMessage({ messageId, dislikeId });
      }
    },
    handleDeleteImageClick() {
      this.deleteMessageImg({
        messageId: this.message.messageId,
        path: this.message.img.fullPath,
      });
    },
    handleImageClick() {
      console.log("child");
      this.$emit("imageClick", this.message.img.url);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.content__header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.counter {
  color: black;
  font-size: 11px;
}
.messageImg {
  max-width: 100px;
  max-height: auto;
  cursor: pointer;
}
</style>
