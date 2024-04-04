<template>
  <input :value="modelValue" @input="updateInput($event)" class="input password-input" type="password" />
</template>

<script>
export default {
  name: 'password-input',
  props: ['modelValue'],
  data() {
    return {};
  },

  methods: {
    updateInput(event) {
      this.$emit('update:modelValue', event.target.value);
    },
  },
};
</script>

<style lang="scss"></style>
