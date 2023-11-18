// vite.config.js
import Vuetify from 'vuetify';
import VuetifyPlugin from 'vite-plugin-vuetify';

export default {
  plugins: [
    VuetifyPlugin({
      // If you need to use a custom theme, you can import and use it here
      // Otherwise, you can remove this line
      vuetify: new Vuetify(),
    }),
  ],
};

