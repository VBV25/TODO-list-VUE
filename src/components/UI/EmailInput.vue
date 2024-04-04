<template>
  <input :value="modelValue" @input="updateInput($event)" class="input email-input" type="email" />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'email-input',
  props: {
    modelValue: {
      type: String,
    },
  },

  data() {
    return {};
  },

  methods: {
    ...mapActions({
      findUsersByEmail: 'userStore/findUsersByEmail',
    }),

    updateInput(event) {
      this.$emit('update:modelValue', event.target.value);

      if (event.target.closest('.administration__add-user')) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.findUsersByEmail({ email: event.target.value });
        }, 1500);
      }
    },
  },
};
</script>

<style lang="scss"></style>
