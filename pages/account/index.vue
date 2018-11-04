<template>
  <div>
    <section v-if="account" class="hero is-info">
      <div class="hero-body columns centered">
         <div class="column is-one-fifth">
            <div class="heroAvatar centered">
              <a v-bind:href="account.image" class="d-inline-block" target="_blank" title="Click To View">
                <img :src="account.image" width="150" height="150" v-bind:alt="imageAlt" />
              </a>
            </div>
         </div>
        <div class="hero__title column is-four-fifth">
          <h1 class="title">
            {{account.displayName}}
          </h1>
          <h2 class="subtitle">
           View and Manage your account
          </h2>
          <a @click="toggleEditForm" class="button has-icon is-info is-inverted">
            <IconPencil class="icon icon-info"/>
            <span>
              Edit your profile
            </span>
          </a>
        </div>
      </div>
    </section>
    <div class="container">
      <div class="is-half column centered" v-if="editing" v-cloak>
        <EditAccountForm />
      </div>
      <div class="is-fullwidth column centered" v-else>
        <div v-if="account" v-cloak>
          <h4 class="mt-4 title is-4">Information pulled from the firebase <code>/account</code> dataset</h4>
          <pre v-text="`${JSON.stringify(account, null, 2)}`"></pre>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EditAccountForm from "~/components/account/EditAccountForm.vue";
import { IconPencil } from "~/components/utils/icons";

export default {
  // middleware: 'authenticated', // checking if auth'd with firebase kinda sucks as the middleware is triggered before firebase is ready
  components: {
    EditAccountForm,
    IconPencil
  },
  computed: {
    ...mapState(["user", "account"]),
    imageAlt() {
      return `Profile image for ${this.account.displayName}`;
    }
  },
  data() {
    return {
      editing: false
    };
  },
  methods: {
    toggleEditForm() {
      this.editing = !this.editing;
    },
    signOut() {
      this.$store
        .dispatch("userLogout")
        .then(() => {
          this.$router.push("/account/login");
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.heroAvatar {
  display: flex;
  justify-content: flex-end;
  img {
    border-radius: 50%;
  }
  .has-icon {
    span {
      margin-right: 8px;
    }
  }
}

.hero__title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  a {
    text-decoration: none;
  }
}
</style>
