<template>
  <textarea :value="modelValue" @input="updateTextarea($event)" class="input textarea-input" id="textarea-input"></textarea>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'textarea-input',
  data() {
    return {
      modelValue: '',
    };
  },

  computed: {
    ...mapGetters({
      descriptionValueInput: 'popupData/descriptionValueInput',
    }),
  },

  methods: {
    ...mapActions({
      changeDescriptionValueInput: 'popupData/getDescriptionValueInput',
    }),

    updateTextarea(event) {
      this.modelValue = event.target.value;
      this.changeDescriptionValueInput(event.target.value);
      this.$emit('update:model-value', event.target.value);
    },
  },

  created() {
    this.modelValue = this.descriptionValueInput;
    this.$emit('update:model-value', this.descriptionValueInput);
    return;
  },
};
</script>

<style lang="scss">
.textarea-input {
  height: 120px;
  resize: none;
}
</style>
