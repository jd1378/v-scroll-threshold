import directive from '@/v-scroll-threshold';

const install = function installVScrollThreshold(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.directive('VScrollThreshold', directive);
};

const plugin = {
  install,
};

// To auto-install when vue is found
// eslint-disable-next-line no-redeclare
/* global window, global */
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

directive.install = install;

export default directive;
