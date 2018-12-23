<template>
  <div class="level-item dropDown__container">
    <div 
      ref="dropDown__menu" 
      :class="{
        'dropdown': true,
        'is-right':true, 
        'is-active': displayDropdown 
        }">
        <div class="dropdown-trigger">
          <span>
            <IconDots @click.native="handleDropDownClick" class='icon icon-medium' aria-haspopup="true" aria-controls="dropdown-menu" />
          </span>
        </div>
    </div>
    <div 
      class="dropdown-menu" 
      id="dropdown-menu" 
      role="menu">
      <div class="dropdown-content">
        <a class="dropdown-item">
          <span>Edit your bio</span>
        </a>
        <a class="dropdown-item">
          <span> Manage your social accounts</span>
        </a>

        <hr class="dropdown-divider">
        <a href="#" class="dropdown-item">
          <IconDelete class="icon icon-small" /> Delete your bio
        </a>
      </div>
    </div>
  </div>
  
</template>
<script>
import { IconDots } from "~/components/utils/icons";


export default {
  components: {
    IconDots
  },
  props: {
    name: {
      type: String, 
      default: "dropdown__default"
    }
  },
  data(){
    return {
      displayDropdown: false,
    }
  },
  methods: {
    handleDropDownClick(){
      this.displayDropdown = !this.displayDropdown
    },
  },
  computed: {
   
  },
};
</script>
<style lang="scss" scoped>
</style>
