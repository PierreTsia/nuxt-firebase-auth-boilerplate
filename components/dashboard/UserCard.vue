<template>
  <article class="tile is-child box">
    <p class="title">John Doe</p>
    <p class="subtitle">Member description editable</p>
  </article>

</template>
<script>
export default {
  name: "userCard",
  props: {
    user: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {};
  },
  components: {},
  computed: {},

  methods: {},
};
</script>
<style lang="scss" scoped>
</style>
