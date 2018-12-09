<template>
  <article class="tile is-child box">
    <div class="content">
      <p class="title">Notifications</p>
      <p class="subtitle">With some content</p>
      <div class="content">
        <p>{{randomText}}</p>
      </div>
    </div>
  </article>

</template>
<script>
export default {
  props: {
    randomText: {
      type: String,
      default:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend, nunc dui porta orci, quis semper odio felis ut quam.",
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
