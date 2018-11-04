<template>
  <div class="loginForm">
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
      <p v-if="formError && formError.code === 'auth/wrong-password'" class="help is-danger"> 
        {{formError.message}}
      </p>
    </div>

    <div class="field emailPassword__button">
        <button @click="handleLoginWithEmailAndPassword" class="button is-fullwidth is-link">Submit</button>
    </div>

    <div class="loginForm__socialHeader">
    ...or sign-in with one of your accounts
    </div>

    <div class="field">
      <p class="control">
        <button @click="handleGithubSignIn" class="button  has-icon is-fullwidth is-dark">
          <span>Sign in with Github</span>
          <IconGithub class="icon icon-white"/>
        </button>
      </p>
      <p class="control">
        <button @click="handleGoogleSignIn"class="button has-icon is-fullwidth is-danger">
        <span>Sign in with Google</span>
          <IconGoogle class="icon icon-white"/>
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import IconGithub from "~/components/utils/icons/github.vue";
import IconGoogle from "~/components/utils/icons/google.vue";

export default {
  name: "LoginForm",
  components: {
    IconGithub,
    IconGoogle
  },
  data() {
    return {
      email: "",
      password: "",
      formError: null
    };
  },
  computed: {
    invalidEmail() {
      return this.formError && this.formError.code === "auth/invalid-email"; // !this.email.includes('@')
    },
    invalidPassword() {
      return this.formError && this.formError.code === "auth/wrong-password";
    }
  },
  methods: {
    handleLoginWithEmailAndPassword() {
      this.formError = "";
      this.$store
        .dispatch("userLogin", {
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$router.push("/account");
        })
        .catch(error => {
          console.log(error);
          this.formError = error;
        });
    },
    handleGithubSignIn() {
      this.$store.dispatch("userGithubLogin");
    },
    handleGoogleSignIn() {
      this.$store.dispatch("userGoogleLogin");
    },
    resetError() {
      this.formError = "";
    }
  }
};
</script>
<style lang="scss">
.loginForm__socialHeader {
  padding: 10px;
  text-align: center;
  margin: 10px 0px;
  font-weight: 800;
}

.loginForm {
  .emailPassword__button {
    margin: 20px 0px 0px 0px;
  }
  button.has-icon {
    span {
      margin: 0px 8px;
    }
  }
}
</style>
