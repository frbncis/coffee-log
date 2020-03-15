<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import store from '../store';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  mounted() {
    store.commit('SET_TITLE', 'Home');
  },
};
</script>
