<template>
  <article class="tile is-child box">
    <nav class="level avatar__block">

      <div class="level-item">
        <div class="avatarAndName">
          <Avatar :imgUrl="user.image" size="big" />
          <h1 v-if="!userNameEdited" class="title has-text-info">{{user.displayName}}</h1>
          <div v-else class="field">
            <div class="control newUserName">
              <input v-model="newUserName" class="input" type="text" placeholder="Info input">
              <IconCheck @click.native="confirmUpdateName" class="icon icon-medium icon-success" />
              <IconClose class="icon icon-medium icon-danger" />

            </div>
          </div>
        </div>
      </div>
      <div class="level-item dropDown__container">
        <div ref="dropDown_userCard" :class="{'dropdown': true,  'is-right':true, 'is-active': displayDropdown}">
          <div class="dropdown-trigger">
            <span>
              <IconDots @click.native="handleDropDownClick" class='icon icon-medium' aria-haspopup="true" aria-controls="dropdown-menu6" />
            </span>
          </div>
          <div class="dropdown-menu" id="dropdown-menu6" role="menu">
            <div class="dropdown-content">
              <a @click="handleDropDownItemClick('userImg')" class="dropdown-item">
                <IconAccount class="icon icon-small" />
                <span>Edit Profile Picture</span>
              </a>
              <a @click="handleDropDownItemClick('userName')" class="dropdown-item">
                <IconPencil class="icon icon-small" />
                <span> Edit User Name</span>
              </a>
              <a href="#" class="dropdown-item">
                <IconCog class="icon icon-small" />
                <span> Preferences </span>
              </a>
              <a href="#" class="dropdown-item">
                Other dropdown item
              </a>
              <hr class="dropdown-divider">
              <a href="#" class="dropdown-item">
                With a divider
              </a>
            </div>
          </div>

        </div>
      </div>

    </nav>

    <nav class="level">

      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Tweets</p>
          <p class="title">3,456</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Following</p>
          <p class="title">123</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Followers</p>
          <p class="title">456K</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Likes</p>
          <p class="title">789</p>
        </div>
      </div>
    </nav>

    <!--   
    
    <p class="title">{{user.displayName}}</p>
    <p class="subtitle">Member description editable</p> -->
  </article>

</template>
<script>
import { mapActions } from "vuex";
import Avatar from "~/components/base/Avatar.vue";
import {
  IconChevronUp,
  IconChevronDown,
  IconDots,
  IconAccount,
  IconPencil,
  IconCog,
  IconCheck,
  IconClose,
} from "~/components/utils/icons";
export default {
  name: "userCard",
  components: {
    IconChevronUp,
    IconChevronDown,
    IconDots,
    Avatar,
    IconAccount,
    IconPencil,
    IconCog,
    IconCheck,
    IconClose,
  },
  props: {
    user: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      displayDropdown: false,
      userNameEdited: false,
      newUserName: "",
    };
  },

  computed: {},

  methods: {
    ...mapActions({ userUpdate: "userUpdate" }),
    handleDropDownClick() {
      console.log("pouet");
      this.displayDropdown = !this.displayDropdown;
    },
    handleDropDownItemClick(change) {
      console.log("from parent", change);
      switch (change) {
        case "userImg":
          this.handleImageUpdate();
          break;
        case "userName":
          this.handleUserNameUpdate();
          break;
      }
    },
    handleImageUpdate() {
      console.log("chnage Image");
    },

    handleUserNameUpdate() {
      this.userNameEdited = !this.userNameEdited;
    },

    confirmUpdateName() {
      if (
        this.newUserName.length < 2 ||
        this.newUserName === this.user.displayName
      ) {
        this.userNameEdited = false;
      } else {
        const newUserData = {
          displayName: this.newUserName,
          userId: this.user.userId,
        };
        console.log("​confirmUpdateName -> newUserData", newUserData);
        this.userUpdate(newUserData);
        this.userNameEdited = false;
      }
    },

    close(e) {
      e.stopPropagation();

      if (this.$refs.dropDown_userCard !== undefined) {
        if (!this.$refs.dropDown_userCard.contains(e.target)) {
          this.displayDropdown = false;
        }
      }
    },
  },
  mounted() {
    window.addEventListener("click", this.close);
    if (this.user.displayName) {
      this.newUserName = this.user.displayName;
    }
  },
};
</script>
<style lang="scss" scoped>
.level {
  padding: 20px 0px;
  margin-bottom: 0px;
  flex-direction: row;
  align-items: flex-start;
}

.avatar__block {
  flex-direction: row;
  align-items: flex-start;

  .dropDown__container {
    display: flex;
    justify-content: flex-end;
  }
  .avatarAndName {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  h1,
  input {
    margin-top: 10px;
  }
  input {
    min-width: 300px;
    max-width: 300px;
  }
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

  .newUserName {
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      margin-left: 10px;
    }
  }
}
</style>
