<template>
  <v-container>
    <v-row class="mx-2">
      <v-col cols="12">
        <v-text-field
          v-model="beanModel.name"
          placeholder="Name"
          outlined
        />

        <v-combobox
          v-model="beanModel.roaster"
          :items="roasters"
          placeholder="Roaster"
          outlined
        />

        <v-combobox
          v-model="beanModel.varietal"
          :items="varieties"
          label="Varietal"
          outlined
          item-value="text"
        />

        <v-combobox
          v-model="beanModel.process"
          :items="process"
          label="Process"
          outlined
          item-value="text"
        />

        <v-combobox
          v-model="beanModel.originCountry"
          :items="originCountries"
          label="Origin"
          outlined
          item-value="text"
        />

        <v-text-field
          v-model="beanModel.originRegion"
          outlined
          placeholder="Origin Region"
        />

        <v-file-input
          id="bag-image-upload"
          label="Bag"
          outlined
          prepend-icon="mdi-camera"
          @change="bagImageChanged"
        />

        <v-btn
          @click="saveBean"
          block
          color="success"
          dark
          :loading="saving"
          large>
            Save
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Bean from '@/models/beans';
import { beansCollection, storage } from '@/services/firebase';
import { mapGetters } from 'vuex';
import store from '@/store';

export default Vue.extend({
  name: 'CreateBeans',
  computed: {
    ...mapGetters({
      user: 'user',
    }),
  },
  data: () => ({
    beanImageFile: undefined,
    beanModel: new Bean(),
    roasters: [
      'Transcend Coffee & Roastery',
      '49th Parallel Coffee Roasters',
      'Detour Coffee Roasters',
      'Pallet Coffee Roasters',
    ].sort(),
    originCountries: [
      'Brazil',
      'Ethiopia',
      'Burundi',
      'Kenya',
      'Costa Rica',
      'Guatamula',
      'Honduras',
      'Panama',
    ].sort(),
    process: [
      'Washed',
      'Natural',
      'Honey',
    ],
    saving: false,
    varieties: [
      'Bourbon',
      'Catuai',
      'Red',
    ],
  }),
  mounted() {
    store.commit('SET_TITLE', 'Add Beans');
  },
  methods: {
    bagImageChanged(imageFile: File) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      this.beanImageFile = imageFile;
    },
    async saveBean() {
      this.saving = true;

      console.log('Save bean!', JSON.stringify(this.beanModel));
      const beanImageUrl = await this.uploadBeanImageFile();

      console.log('Image uploaded', beanImageUrl);

      this.beanModel.imageUrl = beanImageUrl;

      await beansCollection.add({ ...this.beanModel });

      this.$router.push({ name: 'Beans' });
    },
    async uploadBeanImageFile(): Promise<string> {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const file = this.beanImageFile!;

      const storageRef = storage.ref(`images/${file.name}`);

      await storageRef.put(file);

      const imageUrl = storageRef.getDownloadURL();

      return imageUrl;
    },
  },
});
</script>
