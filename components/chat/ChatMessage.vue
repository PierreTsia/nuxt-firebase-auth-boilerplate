<template>
  <div>
    <div class="chatMessage  mb-2">
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
                  <small v-if="messageTextFlags.length" class="text_flags ml-3">
                    Moderation :
                    <span v-for="(flag, index) in messageTextFlags" :key="index" class="ml-1 tag is-danger">{{flag}}</span>
                  </small>
                  <div v-if="imgFlags.length" class="switch field ml-5">

                    <toggle-button :value="true" :sync="true" :labels="{checked: 'ON', unchecked: 'OFF'}" :name="'Offensive image filter'" :color="{checked: '#26c55b', unchecked: '#ff2f57'}" v-model="hideImage" />

                  </div>
                </div>
                <br>
                <span v-if="!isEditing">

                  <span style="white-space: pre-line;">
                    {{message.content}}
                  </span>
                  <div class="mt-1 mb-1" v-if="message.img && message.img.fullPath.length">

                    <img v-show="!imgFlags.length || !hideImage" @click="handleImageClick" class="messageImg" :src="message.img.url" alt="">
                    <div class="img_filter" v-show="imgFlags.length && hideImage">
                      <small class="ml-3">
                        <span class="block">
                          <span class="flags__container">
                            <span v-for="(flag, index) in imgFlags" :key="index" class="ml-1 tag is-danger img_flags">
                              {{flag}}
                            </span>
                          </span>
                        </span>
                      </small>

                    </div>

                  </div>
                </span>
                <span v-else>
                  <textarea v-model="newContent" class="input" type="text" placeholder="Text input"></textarea>
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
import { mapGetters, mapActions } from "vuex";
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
  IconView,
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
    IconView,
  },
  data() {
    return {
      newContent: "",
      isEditing: false,
      modalIsActive: false,
      hideImage: true,
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
    ...mapGetters(["user"]),
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

    messageTextFlags() {
      return this.message.flags ? [...this.message.flags] : [];
    },
    imgFlags() {
      return this.message.imgFlags && this.message.imgFlags.split("/").length
        ? [...this.message.imgFlags.split("/")]
        : [];
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
      this.$emit("imageClick", this.message.img.url);
    },
  },
};
</script>

<style lang="scss" scoped>
.chatMessage {
  .content {
    @media screen and(max-width: 800px) {
      font-size: 10px;
    }
  }
}

.text_flags {
  display: flex;
  align-items: center;
  @media screen and (max-width: 800px) {
    font-size: 6px;
    .tag {
      font-size: 0.6em;
      max-width: 35px;
    }
  }
}

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
  max-width: 200px;
  max-height: auto;
  cursor: pointer;
  @media screen and(max-width: 800px) {
    max-width: 100px !important;
  }
}

.img_filter {
  .block {
    display: flex;
    background-color: grey;
    height: 100px;
    width: 200px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media screen and(max-width: 800px) {
      max-width: 100px !important;
    }
  }
  .flags_container {
    display: flex;
    justify-content: center;
    align-items: center;

    .img_flags {
      max-width: 55px;
    }
  }
}

.switch {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  alogn-items: center;
}
</style>
