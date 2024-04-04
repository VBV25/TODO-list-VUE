<template>
  <input :value="modelValue" @input="updateInput($event)" class="input text-input" id="text-input" type="text" />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'text-input',
  props: {
    modelValue: {
      type: String,
    },
  },
  data() {
    return {
      modelValue: '',
    };
  },

  computed: {
    ...mapGetters({
      nameValueInput: 'popupData/nameValueInput',
    }),
  },

  methods: {
    ...mapActions({
      changeNameValueInput: 'popupData/getNameValueInput',
    }),

    updateInput(event) {
      this.modelValue = event.target.value;
      this.changeNameValueInput(event.target.value);
      this.$emit('update:model-value', event.target.value);
    },
  },

  created() {
    this.modelValue = this.nameValueInput;
    this.$emit('update:model-value', this.nameValueInput);
  },
};
</script>

<style lang="scss"></style>
