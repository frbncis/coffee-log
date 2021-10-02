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
          :items="roasterNames"
          placeholder="Roaster"
          outlined
        />

        <v-combobox
          v-model="beanModel.tastingNotes"
          multiple
          placeholder="Tasting Notes"
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

        <v-textarea
          v-model="beanModel.story"
          outlined
          placeholder="Story"
        />

        <v-file-input
          id="bag-image-upload"
          v-if="beanModel.imageUrl == ''"
          label="Bag"
          outlined
          prepend-icon="mdi-camera"
          @change="bagImageChanged"
        />

        <v-card
          v-else
          class="mb-5"
        >
          <v-img
            height="125"
            :src="beanModel.imageUrl"
          />
        </v-card>

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
import {
  mapGetters,
  mapActions,
  mapMutations,
  mapState,
} from 'vuex';
import store from '@/store';
import Roaster from '@/models/roaster';

export default Vue.extend({
  name: 'CreateBeans',
  computed: {
    ...mapGetters({
      user: 'user',
    }),
    ...mapState({
      roasters: 'roasters',
    }),
    roasterNames(): string[] {
      return this.roasters.map((roaster: Roaster) => roaster.name).sort();
    },
  },
  data: () => ({
    beanImageFile: undefined,
    beanModel: new Bean(),
    originCountries: [
      'Brazil',
      'Ethiopia',
      'Burundi',
      'Kenya',
      'Costa Rica',
      'Guatamula',
      'Honduras',
      'Panama',
      'Peru',
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
      'Heirloom',
      'Red',
      'Pacas',
      'Various',
    ],
  }),
  async created() {
    this.setTopNavigation([]);

    if (this.$route.query.beanId) {
      const { beanId } = this.$route.query;
      store.commit('SET_TITLE', 'Edit Beans');

      this.beanModel = await this.getBeanById(beanId);
    } else {
      store.commit('SET_TITLE', 'Add Beans');
    }
  },
  methods: {
    ...mapMutations({
      setTopNavigation: 'SET_TOP_NAVIGATION',
    }),
    ...mapActions({
      getBeanById: 'getBeanById',
    }),
    bagImageChanged(imageFile: File) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      this.beanImageFile = imageFile;
    },
    async saveBean() {
      this.saving = true;

      if (this.beanImageFile) {
        const beanImageUrl = await this.uploadBeanImageFile();

        this.beanModel.imageUrl = beanImageUrl;
      }

      if (this.beanModel.id) {
        await beansCollection.doc(this.beanModel.id).set({ ...this.beanModel });
      } else {
        const createdBeanDocument = await beansCollection.add({ ...this.beanModel });
        this.beanModel.id = createdBeanDocument.id;

        await beansCollection.doc(this.beanModel.id).set({ ...this.beanModel });
      }

      this.$router.push({ name: 'Beans' });
    },
    async uploadBeanImageFile(): Promise<string> {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const file = this.beanImageFile! as File;

      const storageRef = storage.ref(`images/${file.name}`);

      await storageRef.put(file);

      const imageUrl = storageRef.getDownloadURL();

      return imageUrl;
    },
  },
});
</script>
