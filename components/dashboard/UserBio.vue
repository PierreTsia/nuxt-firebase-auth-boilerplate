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
                <a class="dropdown-item">
                  <IconPencil class="icon icon-small" />
                  <span>Edit your bio</span>
                </a>
                <a class="dropdown-item">
                  <IconPlanet class="icon icon-small" />
                  <span> Manage your social accounts</span>
                </a>
              
                <hr class="dropdown-divider">
                <a href="#" class="dropdown-item">
                  <IconDelete class="icon icon-small" />
                  Delete your bio
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      <p class="subtitle">Tell a few words about yourself</p>
      <div class="content">
        <p>{{bio}}</p>
      </div>
    </div>
    <p class="subtitle">Social Profiles</p>
    <div class="content">
      <p>Twitter, Instagram, Facebook</p>
    </div>
  </article>

</template>
<script>
import { IconDots, IconPencil, IconPlanet, IconDelete } from "~/components/utils/icons";
export default {
  components: {
    IconDots,
    IconPencil,
    IconPlanet,
    IconDelete
  },
  props: {
    bio: {
      type: String,
      default:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend, nunc dui porta orci, quis semper odio felis ut quam.",
    },
  },
  data() {
    return {
      displayDropdown: false,
    };
  },
  methods: {
    handleDropDownClick() {
      this.displayDropdown = !this.displayDropdown;
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
  mounted() {
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
