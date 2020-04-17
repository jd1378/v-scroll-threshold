<script>
import Vue from 'vue';
import VScrollThreshold from '@/v-scroll-threshold.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VScrollThreshold,
  },
});
</script>

<template>
  <div id="app">
    <v-scroll-threshold />
  </div>
</template>
