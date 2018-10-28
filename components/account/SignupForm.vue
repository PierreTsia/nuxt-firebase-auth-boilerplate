<template>
  <div>
     <div class="field">
     <label class="label">Email</label>
      <div class="control has-icons-left">
        <span class="icon is-left">
          <i class="material-icons md-18">email</i>
        </span>
        <input :class="{'input': true, 'is-danger': invalidEmail}" type="email" v-model="email" placeholder="john@doe.com">
      </div>
       <p v-if="formError && formError.code === 'auth/invalid-email'" class="help is-danger">{{formError.message}}</p>
    </div>

    <div class="field">
      <label class="label">Password</label>
      <div class="control has-icons-left">
        <input v-model="password" :class="{'input': true, 'is-danger': invalidPassword}" type="password" placeholder="Password" >
        <span class="icon is-small is-left">
            <i class="material-icons md-18">lock</i>
        </span>
      </div>
      <p v-if="invalidPassword" class="help is-danger"> 
        {{formError.message}}
      </p>
    </div>

    <div class="field">
      <label class="label">Confirm Password</label>
      <div class="control has-icons-left">
        <input v-model="password2" :class="{'input': true, 'is-danger': invalidPassword}" type="password" placeholder="Password" >
        <span class="icon is-small is-left">
            <i class="material-icons md-18">lock</i>
        </span>
      </div>
      <p v-if="invalidPassword" class="help is-danger"> 
        {{formError.message}}
      </p>
    </div>

    <div class="field emailPassword__button">
        <button @click="handleSignUpWithLoginAndPassword" class="button is-fullwidth is-link">Submit</button>
    </div>

    <div class="loginForm__socialHeader">
    ...or sign-up with one of your accounts
    </div>

    <div class="field">
      <p class="control">
        <button @click="handleGithubSignUp" class="button  has-icon is-fullwidth is-dark">
          <span>Sign up with Github</span>
          <IconGithub class="icon icon-white"/>
        </button>
      </p>
      <p class="control">
        <button @click="handleGoogleSignUp"class="button has-icon is-fullwidth is-danger">
        <span>Sign up with Google</span>
          <IconGoogle class="icon icon-white"/>
        </button>
      </p>
    </div>





<!-- 
    <form v-on:submit.prevent="signup">
      <div class="form-group">
        <label>Email</label>
        <div class="control">
          <input class="form-control" v-bind:class="{ 'is-danger': invalidEmail }" type="email" placeholder="New Account Email" v-model="email">
        </div>
        <p class="help is-danger" v-if="invalidEmail">This email is invalid</p>
      </div>

      <div class="form-group">
        <label>Password</label>
        <div class="control">
          <input class="form-control" v-bind:class="{ 'is-danger': invalidPassword }" type="password" placeholder="New Account Password" v-model="password">
        </div>
        <p class="help is-danger" v-if="invalidPassword">This password is invalid</p>
      </div>

      <div class="form-checkbox">
        <label>
          <input type="checkbox" name="terms">
          <span>I accept the terms and conditions</span>
        </label>
      </div>

      <div class="form-group">
        <p><nuxt-link to="/account/login">I already have an account</nuxt-link></p>
      </div>

      <div class="form-group">
        <div class="flash flash-error" v-if="formError.length > 0" v-text="formError"></div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Sign Up</button>
      </div>

      <div class="form-actions mt-2">
        <GoogleButton label="Sign Up With Google" />
      </div>

      <div class="form-actions mt-2">
        <GithubButton label="Sign Up With Github" />
      </div>
    </form> -->
  </div>
</template>

<script>
import IconGithub from "~/components/utils/icons/github.vue"
import IconGoogle from "~/components/utils/icons/google.vue"

export default {
  name: 'SignupForm',
  components: {
    IconGithub,
    IconGoogle
  },
  data () {
    return {
      email: '',
      password: '',
      password2:'',
      formError: ''
    }
  },
  computed: {
    invalidEmail () {
       return this.formError && this.formError.code === "auth/invalid-email";
    },
    invalidPassword () {
      return this.formError && (this.formError.code === "auth/wrong-password" || this.formError.code === 'auth/weak-password')
    },
  },
  methods: {
    passwordsMatch(){
      return this.password === this.password2
    },
     handleGithubSignUp(){
      this.$store.dispatch('userGithubLogin')
    },
    handleGoogleSignUp(){
      this.$store.dispatch('userGoogleLogin')
    },
    handleSignUpWithLoginAndPassword () {
      this.formError = ''
     if(!this.passwordsMatch()){
        this.formError = {
          message: "The two passwords don't match",
          code: "auth/wrong-password"
        }
      } else { 
          this.$store.dispatch('userCreate', {
            email: this.email,
            password: this.password
          })
          .then(() => {
            this.$router.push('/account')
          })
          .catch((error) => {
            console.log(error)
            this.formError = error
        })
      }
    }
  }
}
</script>
