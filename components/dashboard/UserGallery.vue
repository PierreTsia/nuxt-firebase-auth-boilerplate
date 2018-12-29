<template>
   <article class="tile is-child box">
    <p class="title">Gallery box</p>
    <p class="subtitle">Caroussel</p>
    <figure class="image is-4by3">
    

    <no-ssr>
        <carousel>
          <slide>
              <img src="https://bulma.io/images/placeholders/640x480.png">
          </slide>
           <slide>
              <img src="https://bulma.io/images/placeholders/640x680.png">
          </slide>
        </carousel>
    </no-ssr>
   
    
    </figure>
  </article>
</template>
<script>
import { Carousel, Slide } from 'vue-carousel';
export default {
  props: {
   
  },
  components: {
    Carousel,
    Slide
  }
};
</script>
<style lang="scss" scoped>
</style>

