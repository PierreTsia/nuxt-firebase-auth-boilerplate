<template>
  <div class="login columns">
    <div class="column is-one-third centered">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Login
          </p>
          <nuxt-link 
            class="card-header-icon"
            to="/account/signup">
            Sign up
          </nuxt-link>
        </header>
        <div class="card-content">
          <div class="content">
            <LoginForm/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "~/components/account/LoginForm.vue";
import { mapState } from "vuex";

export default {
  middleware: "anonymous",
  components: {
    LoginForm
  },
  watch: {
    // firebase is sometimes slow so we need to account for
    // the user getting authenticated late in the game...
    user(to, from) {
      this.$router.push("/account");
    }
  },
  computed: mapState(["user"])
};
</script>
<style lang="css" scoped>
.login{
  margin-top: 100px;
}

</style>
