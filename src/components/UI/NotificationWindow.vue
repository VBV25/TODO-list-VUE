<template>
  {{ alertText }}
  <section v-if="(alertText || responseTrueTaskStore) && !errorText && !responseServerError" class="notification-window">
    <div class="notification-window__container">
      <div class="notification-window__message">{{ alertText }}</div>
      <div class="notification-window__animation">
        <svg class="animate" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M 18 32.34 l -8.34 -8.34 -2.83 2.83 11.17 11.17 24 -24 -2.83 -2.83 z" stroke="#3da35a" fill="transparent" />
        </svg>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'notification-window',

  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      alertText: 'popupData/alertText',
      responseTrueTaskStore: 'taskStore/responseTrue',
      errorText: 'popupData/errorBtnPopup',
      responseServerError: 'taskStore/responseError',
    }),
  },
  methods: {
    ...mapActions({
      changeAlertText: 'popupData/getAlertText',
      changeResponseTrueSync: 'taskStore/changeResponseTrueSync',
    }),
  },

  updated() {
    if (this.alertText) {
      document.querySelector('body').classList.add('click-ban');
      setTimeout(() => {
        this.changeAlertText('');
        this.changeResponseTrueSync('');
        document.querySelectorAll('.drop-btn-group').forEach((element) => {
          element.classList.remove('drop-btn-group_visible');
        });
      }, 2600);
      setTimeout(() => {
        document.querySelector('body').classList.remove('click-ban');
      }, 3200);
    }
  },
};
</script>

<style></style>
