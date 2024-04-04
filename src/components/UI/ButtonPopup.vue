<template>
  <div class="popup__btn-container">
    <button class="popup__form-btn">Enter</button>
    <div class="popup__error-text-block">{{ errorBtnText ? errorBtnText : responseServerError }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'button-popup',

  data() {
    return {};
  },

  computed: {
    ...mapGetters({
      errorBtnText: 'popupData/errorBtnPopup',
      responseServerError: 'taskStore/responseError',
    }),
  },

  methods: {},
};
</script>

<style lang="scss"></style>
