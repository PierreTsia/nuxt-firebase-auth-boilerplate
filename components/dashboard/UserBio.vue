<template>
  <article class="tile is-child box">
    <div class="content">
      <div class="header__container">
        <div class="title">
          Bio
        </div>

        <div class="level-item dropDown__container">
          <div ref="dropDown_userBio" :class="{'dropdown': true,  'is-right':true, 'is-active': displayDropdown }">
            <div class="dropdown-trigger">
              <span>
                <IconDots @click.native="handleDropDownClick" class='icon icon-medium' aria-haspopup="true" aria-controls="dropdown-menu__userBio" />
              </span>
            </div>
            <div class="dropdown-menu" id="dropdown-menu__userBio" role="menu">
              <div class="dropdown-content">
                <a @click="handleEditClick('bio')" class="dropdown-item">
                  <IconPencil class="icon icon-small" />
                  <span>Edit your bio</span>
                </a>
                <a @click="handleEditClick('social')"  
                  class="dropdown-item">
                  <IconPlanet class="icon icon-small" />
                  <span> Manage your social accounts</span>
                </a>

                <hr class="dropdown-divider">
                <a href="#" class="dropdown-item">
                  <IconDelete class="icon icon-small" /> Delete your bio
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="subtitle">Tell a few words about yourself</p>
      <div class="content">
        <p v-if="!sectionIsEdited('bio') && userHasABio">{{bio}}</p>
        <p v-if="!sectionIsEdited('bio') && !userHasABio">Drop a few lines here...</p>

        <div v-else-if="sectionIsEdited('bio')" class="field">
          <div class="control">
            <textarea v-model="newUserBio" class="textarea is-small" placeholder="Small textarea"></textarea>
            <a @click="handleEditBioClick" class="button mt-2 is-small is-link is-rounded">
              <IconSave class='icon icon-white' />
              <small class="ml-1">Save</small>
            </a>
            <a @click="removeSectionFromEditMode('bio')" class="button mt-2 ml-1 is-small is-danger is-rounded">
              <IconCancel class='icon icon-white' />
              <small class="ml-1">Cancel</small>
            </a>
          </div>
        </div>
      </div>
    </div>
    <p class="subtitle">Social Profiles</p>
    <div class="content">
      
      <div v-if="sectionIsEdited('social')">
        <div class="field">
          <div class="control social__input__container">
            <IconGithub class="icon icon-medium" />
            <input class="input is-info" v-model="github" type="text" placeholder="your github account">
          </div>
        </div>

        <div class="field">
          <div class="control social__input__container">
            <IconGoogle class="icon icon-danger icon-medium" />
            <input class="input is-info" v-model="google" type="text" placeholder="your google account">
          </div>
        </div>

        <div class="field">
          <div class="control social__input__container">
            <IconTwitter class="icon icon-info icon-medium" />
            <input class="input is-info" v-model="twitter" type="text" placeholder="your twitter account">
          </div>
        </div>

          <div class="field">
          <div class="control social__input__container">
            <IconFacebook class="icon icon-info icon-medium" />
            <input class="input is-info" v-model="facebook" type="text" placeholder="your facebook account">
          </div>
        </div>

         <div class="field">
          <div class="control social__input__container">
            <IconInstagram class="icon icon-medium" />
            <input class="input is-info" v-model="instagram" type="text" placeholder="your instagram account">
          </div>
        </div>

        <div class="control">
            <a @click="handleEditSocialClick" class="button mt-2 is-small is-link is-rounded">
              <IconSave class='icon icon-white' />
              <small class="ml-1">Save</small>
            </a>
            <a @click="removeSectionFromEditMode('social')" class="button mt-2 ml-1 is-small is-danger is-rounded">
              <IconCancel class='icon icon-white' />
              <small class="ml-1">Cancel</small>
            </a>
        </div>
      </div>
      <div v-else>
        <div class="control">
          <div v-if="currentUserProfile.socials">
            <a :href="social.url" v-for="social in socialAccounts" class="button mt-2 ml-1  is-primary p-3">
              <IconGithub v-if="social.provider === 'github'" class='icon icon-medium icon-white' />
              <IconTwitter v-if="social.provider === 'twitter'" class='icon icon-medium icon-white' />
              <IconGoogle v-if="social.provider === 'google'" class='icon icon-medium icon-white' />
              <IconFacebook v-if="social.provider === 'facebook'" class='icon icon-medium icon-white' />
              <IconInstagram v-if="social.provider === 'instagram'" class='icon icon-medium icon-white' />
            </a>
          </div>
        </div>
      </div>
    </div>

  </article>

</template>
<script>
import {
  IconDots,
  IconPencil,
  IconPlanet,
  IconDelete,
  IconSave,
  IconCancel,
  IconGoogle,
  IconGithub,
  IconTwitter,
  IconFacebook,
  IconInstagram
} from "~/components/utils/icons";

import _ from "lodash";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    IconDots,
    IconPencil,
    IconPlanet,
    IconDelete,
    IconSave,
    IconCancel,
    IconGoogle,
    IconGithub,
    IconTwitter,
    IconFacebook,
    IconInstagram
  },
  props: {
    bio: {
      type: String,
      default: "Enter your bio",
    },
    socialAccounts: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      displayDropdown: false,
      isEditMode: [],
      newUserBio: "",
      twitter:"",
      google:"",
      github:"",
      facebook: "",
      instagram: "" 
    };
  },
  methods: {
    ...mapActions(["updateUserBio", "createUserBio", "updateUserSocialAccount", "createUserSocialAccount"]),
    handleDropDownClick() {
      this.displayDropdown = !this.displayDropdown;
    },
    sectionIsEdited(section) {
      return this.isEditMode.includes(section);
    },
    removeSectionFromEditMode(section){
      if(this.isEditMode.includes(section)){
         this.isEditMode = _.remove(this.isEditMode, section);
      }
    },
    handleEditClick(section) {
      this.isEditMode.push(section);
    },
    handleEditBioClick() {
      if (this.newUserBio.length > 5) {
        if (this.userHasABio) {
          this.updateUserBio({
            userId: this.user.userId,
            bio: this.newUserBio,
          });
        } else {
          this.createUserBio({
            userId: this.user.userId,
            bio: this.newUserBio,
          });
        }
        this.removeSectionFromEditMode('bio')
      }
    },


    handleEditSocialClick(){
     const newSocialAccountData = _.reduce({ twitter: this.twitter, google: this.google, github: this.github, facebook: this.facebook, instagram: this.instagram }, (result, url, provider) => {
       if(url.length){
         // TODO handle validation rules here
         result.push({[provider]: url})
       }
       return result
     }, [])
      this.createUserSocialAccount(newSocialAccountData)
      this.removeSectionFromEditMode('social')
    }, 

    close(e) {
      e.stopPropagation();

      if (this.$refs.dropDown_userBio !== undefined) {
        if (!this.$refs.dropDown_userBio.contains(e.target)) {
          this.displayDropdown = false;
        }
      }
    },
  },
  computed: {
    ...mapGetters(["user", "currentUserProfile"]),
    userHasABio() {
      return this.currentUserProfile && this.currentUserProfile.bio;
    },
    userHasSocialAccounts(){
      return this.userSocialAccounts.length > 0
    },
   
  },
  watch: {
    socialAccounts: {
      immediate: true,
      deep: true, 
      handler(newVal){
        newVal.forEach(account => {
					console.log("​handler -> account", account)
          if(account.provider === 'facebook'){
            this.facebook = account.url
          }
          if(account.provider === 'google'){
            this.google = account.url
          }
          if(account.provider === 'twitter'){
             this.twitter = account.url
          }
          if(account.provider === 'github'){
            this.github = account.url
          }
           if(account.provider === 'instagram'){
            this.instagram = account.url
          }
        })
      }
    }
  },
  mounted() {
    if (this.currentUserProfile && this.currentUserProfile.bio) {
      this.newUserBio = this.currentUserProfile.bio;
    } 
   
    
    window.addEventListener("click", this.close);
  },
  beforeDestroy() {
    this.twitter="";
    this.google="";
    this.github="";
    this.facebook= "";
    this.instagram= ""; 
    
  },
};
</script>
<style lang="scss" scoped>
.header__container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  margin: 0px;
  .title {
    flex-grow: 1;
    margin-bottom: 0px;
    display: flex;
    align-items: center;
  }
}
.dropDown__container {
  .dropdown-item {
    transition: background-color 0.5s ease;
    display: flex;
    align-items: center;
    .icon {
      margin-right: 5px;
    }
  }
  .dropdown-item:hover {
    text-decoration: none;
    background-color: #229bee;
    color: white;
    .icon {
      fill: white;
    }
  }
}
.social__input__container {
  display: flex;
  align-items: center;
  .icon {
    margin-right: 5px;
  }
}
</style>
