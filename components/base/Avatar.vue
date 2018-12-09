<template>
  <figure :class="['image', imgSize]">
    <img class="is-rounded" :src="imgUrl">
  </figure>
</template>
<script>
export default {
  props: {
    imgUrl: {
      type: String,
      default: "https://bulma.io/images/placeholders/128x128.png",
    },
    size: {
      type: String,
      default: "medium",
    },
  },
  methods: {},
  computed: {
    imgSize() {
      if (this.size === "x-small") {
        return "is-16x16";
      } else if (this.size === "small") {
        return "is-32x32";
      } else if (this.size === "medium") {
        return "is-64x64";
      } else if (this.size === "big") {
        return "is-128x128";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
