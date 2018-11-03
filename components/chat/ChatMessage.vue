<template>
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
              </div>
              <br>
             {{message.content}}
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
                    }"/>
                </span>
              </a>
              <a @click="handleUnlikeClick(message.messageId)" class="level-item" aria-label="unlike">
                 <small v-if="dislikesCount > 0 " class="counter mr-1">{{dislikesCount}}</small>
                 <span class="icon is-small">
                  <IconUnlike 
                     :class="{
                       'icon': true,  
                       'icon-danger': this.userAlreadyDisliked, 
                       'icon-default': !this.userAlreadyDisliked
                     }"/>
                </span>
              </a>
              <a class="level-item" aria-label="reply">
                <span class="icon is-small">
                  <IconComment class="icon icon-grey" />
                </span>
              </a>
       
            </div>
              
            <div class="level-right">
         
              <a v-if="currentUserIsAuthor(message.authorId)" class="level-item" aria-label="edit">
                <span class="icon">
                  <IconPencil class="icon icon-big" />
                </span>
              </a>
            </div>
              
            
          </nav>
        </div>
      </article>
    </div>
  </div>  
</template>
<script>
import { mapState, mapActions } from "vuex";
import _ from 'lodash'
import {
  IconLike,
  IconUnlike,
  IconComment,
  IconPencil
} from "~/components/utils/icons";
import { format, distanceInWordsToNow } from "date-fns";
export default {
  name: "ChatMessage",
  components: {
    IconLike,
    IconUnlike,
    IconComment,
    IconPencil
  },
  data() {
    return {};
  },
  props: {
    message: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  computed: {
    ...mapState(["user"]),
    likesUserIds(){
      return this.message.likes ? Object.values(this.message.likes) : []
    },

    dislikesUserIds(){
      return this.message.dislikes ? Object.values(this.message.dislikes) : []
    },

    likesCount(){
      return this.likesUserIds.length
    },

     dislikesCount(){
      return this.dislikesUserIds.length
    },

    userAlreadyLiked(){
      return this.likesUserIds.includes(this.user.uid)
    },

    userAlreadyDisliked(){
      return this.dislikesUserIds.includes(this.user.uid)
    }
  },
  methods: {
    ...mapActions(['likeMessage', 'removeLikeMessage', 'dislikeMessage', 'removeDislikeMessage']),

    formatDate(date) {
      return distanceInWordsToNow(date);
    },

    currentUserIsAuthor(authorId) {
      return authorId === this.user.uid;
    },

    handleLikeClick(messageId){
      if(this.userAlreadyDisliked){
        const dislikeId = Object.keys(_.pickBy(this.message.dislikes, (userId)=> userId === this.user.uid))[0]
        console.log("disl", dislikeId)
        this.removeDislikeMessage({messageId, dislikeId}) 
      }
      if(!this.userAlreadyLiked){
        this.likeMessage(messageId)
      } else {
       const likeId = Object.keys(_.pickBy(this.message.likes, (userId)=> userId === this.user.uid))[0]
       this.removeLikeMessage({messageId, likeId})
     }

    },


    handleUnlikeClick(messageId){
      if(this.userAlreadyLiked){
        const likeId = Object.keys(_.pickBy(this.message.likes, (userId)=> userId === this.user.uid))[0]
        this.removeLikeMessage({messageId, likeId}) 
      }
       if(!this.userAlreadyDisliked){
       this.dislikeMessage(messageId)
      } else {
        const dislikeId = Object.keys(_.pickBy(this.message.dislikes, (userId)=> userId === this.user.uid))[0]
        console.log("disl", dislikeId)
        this.removeDislikeMessage({messageId, dislikeId})
      }
      

      
    }
  },
  mounted() {
    console.log(this.message);
    console.log(format(new Date(), "[Today is a] dddd"));
  }
};
</script>

<style lang="scss" scoped>
.content__header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.counter{
  color: black;
  font-size: 11px;
}

</style>
