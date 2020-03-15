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
          v-model="beanModel.varietal"
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

        <v-btn
          @click="saveBean"
          block
          color="red"
          dark
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

export default Vue.extend({
  name: 'CreateBeans',
  data: () => ({
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
    varieties: [
      'Bourbon',
      'Catuai',
      'Red',
    ],
  }),
  methods: {
    saveBean() {
      console.log('Save bean!', JSON.stringify(this.beanModel));
    },
  },
});
</script>
