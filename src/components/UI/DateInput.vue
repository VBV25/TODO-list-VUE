<template>
  <label class="input-label">
    Date:
    <input :value="modelValue" @input="updateInput($event)" class="input date-input" type="date" />
  </label>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'date-input',

  data() {
    return {
      modelValue: '',
    };
  },

  computed: {
    ...mapGetters({
      dateValueInput: 'popupData/dateValueInput',
    }),
  },

  methods: {
    ...mapActions({
      changeDateValueInput: 'popupData/getDateValueInput',
    }),

    updateInput(event) {
      this.modelValue = event.target.value;
      this.changeDateValueInput(event.target.value);
      this.$emit('update:modelValue', event.target.value);
    },
  },

  created() {
    const data = this.dateValueInput.split('T')[0];
    this.modelValue = data;
    this.$emit('update:model-value', this.dateValueInput);
  },
};
</script>

<style lang="scss"></style>
