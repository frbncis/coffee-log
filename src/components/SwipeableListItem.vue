<template>
  <swiper ref="mySwiper" :options="swiperOptions">
    <swiper-slide>
      <slot name="view-item" />
    </swiper-slide>

    <swiper-slide>
      <slot name="edit-item" />
    </swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

export default {
  name: 'carrousel',
  components: {
    Swiper,
    SwiperSlide,
  },
  directives: {
    swiper: directive,
  },
  data() {
    return {
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
        },
      },
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
};
</script>
