<template>
    <div class="signup columns">
      <div class=" column is-one-third centered">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              Signup
            </p>
            <nuxt-link class="card-header-icon"   to="/account/login">Log in</nuxt-link>
          </header>
          <div class="card-content">
            <div class="content">
              <SignupForm/>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import SignupForm from '~/components/account/SignupForm.vue'
import { mapState } from 'vuex'

export default {
  middleware: 'anonymous',
  components: {
    SignupForm
  },
  watch: {
    // firebase is sometimes slow so we need to account for
    // the user getting authenticated late in the game...
    user (to, from) {
      this.$router.push('/account')
    }
  },
  computed: mapState([
    'user'
  ])
}
</script>

<style lang="scss" scoped>
.signup {
  margin-top: 100px
}



</style>
