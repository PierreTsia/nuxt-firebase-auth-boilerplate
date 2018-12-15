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
                <a class="dropdown-item">
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
            <a @click="handleCancelBioClick" class="button mt-2 ml-1 is-small is-danger is-rounded">
              <IconCancel class='icon icon-white' />
              <small class="ml-1">Cancel</small>
            </a>
          </div>
        </div>
      </div>
    </div>
    <p class="subtitle">Social Profiles</p>
    <div class="content">
      <p>Twitter, Instagram, Facebook</p>
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
  },
  props: {
    bio: {
      type: String,
      default: "Enter your bio",
    },
  },
  data() {
    return {
      displayDropdown: false,
      isEditMode: [],
      newUserBio: "",
    };
  },
  methods: {
    ...mapActions(["updateUserBio", "createUserBio"]),
    handleDropDownClick() {
      this.displayDropdown = !this.displayDropdown;
    },
    sectionIsEdited(section) {
      return this.isEditMode.includes(section);
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
        this.isEditMode = _.remove(this.isEditMode, "bio");
      }
    },

    handleCancelBioClick() {
      if (this.isEditMode.includes("bio")) {
        this.isEditMode = _.remove(this.isEditMode, "bio");
      }
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
  },
  mounted() {
    if (this.currentUserProfile && this.currentUserProfile.bio) {
      this.newUserBio = this.currentUserProfile.bio;
    }
    window.addEventListener("click", this.close);
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
</style>
