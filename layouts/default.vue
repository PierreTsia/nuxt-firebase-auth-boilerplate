<template>
  <div class="container-fluid">
    <nav class="navbar is-info" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item" to="/">
          <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
        </nuxt-link>

        <a role="button" @click="toggleNavBar" :class="{'navbar-burger': true, 'burger': true,  'is-active': this.navBarActive}" aria-label="menu" aria-expanded="false" data-target="defaultLayout__navbar">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="defaultLayout__navbar" :class="{'navbar-menu': true, 'is-active': navBarActive }" refs="navbar-menu">
        <div class="navbar-start">
          <nuxt-link class="navbar-item" to="/">Home</nuxt-link>
          <nuxt-link v-if="isAuthenticated" class="navbar-item" to="/chat">Chat</nuxt-link>
          <nuxt-link v-if="isAuthenticated" class="navbar-item" to="/account">Profile</nuxt-link>
        </div>

        <div class="navbar-end">
          <div v-if="isAuthenticated" class="navbar-item">
            <div class="user__avatar">
              <img v-if="this.account" class="avatar--pic" :src="this.account.image" />
              <span v-if="this.account" class="avatar--name">{{this.account.displayName}}</span>
            </div>
          </div>
          <div class="navbar-item">

            <div class="buttons">
              <nuxt-link v-if="!isAuthenticated" class="button is-danger" to="/account/signup">Sign Up</nuxt-link>
              <nuxt-link v-if="!isAuthenticated" class="button is-primary" to="/account/login">Login</nuxt-link>
              <button @click="signOut" v-else class="button is-rounded is-primary" to="/account/login">
                <span>Log out </span>
                <IconLogout class="icon-normak icon-white" />
              </button>

            </div>
          </div>
        </div>
      </div>
    </nav>

    <nuxt/>

  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { IconLogin, IconLogout } from "~/components/utils/icons";

export default {
  components: {
    IconLogin,
    IconLogout,
  },
  data() {
    return {
      navBarActive: false,
    };
  },
  methods: {
    toggleNavBar() {
      this.navBarActive = !this.navBarActive;
    },
    signOut() {
      console.log("poeut");
      this.$store
        .dispatch("userLogout")
        .then(() => {
          this.$router.push("/account/login");
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  computed: {
    ...mapState(["user", "account"]),
    ...mapGetters(["isAuthenticated"]),
    navBarIsActive() {
      return this.navBarActive;
    },
  },
};
</script>

<style lang="scss">
.navbar {
  padding: 10px;
  height: 80px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);
  .user__avatar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .avatar--pic {
      height: 28px;
      width: 28px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
}

.icon {
  cursor: pointer;
}
</style>
