<template>
  <div class="theme-switcher">
    <div class="theme-switcher__title-container">
      <div class="theme-switcher__title">Theme</div>
      <div class="theme-switcher__subtitle">{{ textSwitcher }}</div>
    </div>
    <div class="theme-switcher__button-switch-container">
      <input type="checkbox" id="theme-switcher-checkbox" v-model="darkTheme" @change="updateTheme" />
      <div class="theme-switcher__button-front"></div>
      <div @click="toggleTheme" class="theme-switcher__button-back"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'theme-switcher',
  data() {
    return {
      darkTheme: false,
      textSwitcher: 'Light',
    };
  },
  methods: {
    toggleTheme() {
      this.darkTheme = !this.darkTheme;
      this.updateTheme();
    },
    updateTheme() {
      if (this.darkTheme) {
        this.textSwitcher = 'Dark';
        document.body.classList.add('dark-theme');
        localStorage.setItem('darkThemeCheckboxState', true);
      } else {
        this.textSwitcher = 'Light';
        document.body.classList.remove('dark-theme');
        localStorage.removeItem('darkThemeCheckboxState');
      }
    },
  },

  mounted() {
    this.darkTheme = localStorage.getItem('darkThemeCheckboxState') ;
    this.updateTheme()
  },
};
</script>

<style lang="scss"></style>
