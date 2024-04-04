<template>
  <div v-if="errorText || responseServerError" class="error-popup-mini">
    {{ errorText ? errorText : responseServerError }}
  </div>
</template>
<!-- Cannot read properties of undefined (reading 'status') -->
<script>
import { mapActions, mapGetters } from 'vuex';
import globalTextStore from '@/utils/textStore.js';

export default {
  name: 'error-popup',

  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      errorText: 'popupData/errorBtnPopup',
      responseServerError: 'taskStore/responseError',
    }),
  },
  methods: {
    ...mapActions({
      changeError: 'popupData/getError',
      changeErrorPopup: 'taskStore/changeResponseErrorSync',
    }),
  },
  async updated() {
    const reloadWindowTextError1 = "Cannot read properties of undefined (reading 'status')";
    const reloadWindowTextError2 = 'The requested page does not exists';
    if (
      this.responseServerError.includes(reloadWindowTextError1) ||
      this.errorText.includes(reloadWindowTextError1) ||
      this.responseServerError.includes(reloadWindowTextError2) ||
      this.errorText.includes(reloadWindowTextError2) ||
      this.responseServerError.includes(globalTextStore.errorReloadPage) ||
      this.errorText.includes(globalTextStore.errorReloadPage)
    ) {
      this.changeErrorPopup(globalTextStore.errorReloadPage);
      //setTimeout(() => {
      //  this.changeError('');
      //  this.changeErrorPopup('');
      //}, 6000);
    } else {
      setTimeout(() => {
        this.changeError('');
        this.changeErrorPopup('');
      }, 3000);
    }
  },
};
</script>

<style lang="scss"></style>
