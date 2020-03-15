<template>
  <PostLogin v-if="user.loggedIn"/>
  <Login v-else />
</template>

<script>
import { mapGetters } from 'vuex';
import Login from '@/components/Login.vue';
import PostLogin from '@/components/PostLogin.vue';

export default {
  components: {
    Login,
    PostLogin,
  },
  computed: {
    ...mapGetters({
      user: 'user',
    }),
  },
  props: {
  },
  data: () => ({
  }),
};
</script>
