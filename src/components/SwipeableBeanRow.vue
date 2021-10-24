<template>
  <div>
    <swiper ref="recentBeanSwiper" :options="recentBeanSwiperOptions">
      <swiper-slide
        v-for="bean in beans"
        :key="'bean-cell-' + bean.id"
      >
        <v-col class="pl-0 ml-0" cols='12'>
          <v-skeleton-loader
            class="mx-auto"
            type="card"
            :loading="loading"
          >
            <v-card
              @click.stop="() => $emit('bean-clicked', bean.id)"
            >
              <v-img
                :src="bean.imageUrl"
                class="align-end"
                aspect-ratio="1"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5" />
                  </v-row>
                </template>
              </v-img>
              <v-card-title class="subtitle-2" v-text="bean.name" />
            </v-card>
          </v-skeleton-loader>
        </v-col>
      </swiper-slide>
    </swiper>
    <v-row>
      <v-col cols=12 class="swiper-pagination pt-0 mt-0" slot="pagination"/>
    </v-row>
  </div>
</template>

<script lang="ts">
import Bean from '@/models/beans';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper';
import SwiperClass from 'swiper';
import { Prop, Ref } from 'vue-property-decorator';
import 'swiper/css/swiper.css';

@Component({
  components: {
    Swiper,
    SwiperSlide,
  },
  directives: {
    swiper: directive,
  },
})
export default class SwipeableBeanRow extends Vue {
  @Prop()
  beans!: Bean[];

  get loading() {
    return this.beans === null;
  }

  recentBeanSwiperOptions = {
    slidesPerView: 2,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Ref() readonly recentBeanSwiper!: any;

  get swiper() {
    return this.recentBeanSwiper.$swiper as SwiperClass;
  }
}
</script>
