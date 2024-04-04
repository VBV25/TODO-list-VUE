<template>
  <section class="login-page">
    <h1 class="login-page__title-page">Welcome to Task List</h1>
    <div class="login-page__content-container" :class="statusLoginPageWindow">
      <div class="login-page__title-container">
        <h2
          @click="changingLoginWindow($event)"
          class="login-page__title-form"
          :class="statusLoginPageWindow === 'authorization' ? 'login-page__title-form_active' : ''"
        >
          Authorization
        </h2>
        <h2
          @click="changingLoginWindow($event)"
          class="login-page__title-form"
          :class="statusLoginPageWindow === 'registration' ? 'login-page__title-form_active' : ''"
        >
          Registration
        </h2>
      </div>

      <div class="login-page__form">
        <!-- Name -->
        <label v-if="statusLoginPageWindow === 'registration'" class="input-label">
          Username:
          <text-input v-model="nameUser" placeholder="Enter your name" />
        </label>

        <!-- Email -->
        <label class="input-label">
          Email:
          <email-input v-model="emailUser" placeholder="Enter your email" />
        </label>
        <!-- Password -->
        <label class="input-label">
          Password:
          <password-input v-model="passwordUser" placeholder="Enter your password" />
        </label>

        <!-- Check Password -->
        <label v-if="statusLoginPageWindow === 'registration'" class="input-label">
          Password check:
          <password-input v-model="passwordChecked" placeholder="Confirm the password" />
        </label>

        <!-- Button form -->
        <button-popup @click="checkUserData" />
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import axios from '@/utils/axios.config.js';

export default {
  name: 'auth-pages',

  data() {
    return {
      nameUser: '',
      emailUser: '',
      passwordUser: '',
      passwordChecked: '',
      valid: 'false',

      statusLoginPageWindow: 'authorization',
    };
  },

  computed: {
    getDataLocalStorage: function () {
      return JSON.parse(localStorage.getItem('isAuthenticated'));
    },
  },

  methods: {
    ...mapActions({
      getError: 'popupData/getError',
      getAlertText: 'popupData/getAlertText',
      changeNameValueInput: 'popupData/getNameValueInput',
    }),

    clearInput() {
      this.nameUser = '';
      this.emailUser = '';
      this.passwordUser = '';
      this.passwordChecked = '';
      this.errorBtnPopup = '';
    },
    changingLoginWindow(event) {
      document.querySelectorAll('.login-page__title-form').forEach((headerBtn) => headerBtn.classList.remove('login-page__title-form_active'));
      this.statusLoginPageWindow = event.target.textContent.toLowerCase().trim();
      event.target.classList.add('login-page__title-form_active');
      this.clearInput();
    },

    async userAuthorization() {
      await axios
        .post('auth/signin', {
          formData: {
            email: this.emailUser,
            password: this.passwordUser,
          },
        })
        .then((response) => {
          const userData = {
            token: response.data.token,
            idUser: response.data.userId,
            userEmail: this.emailUser,
          };
          this.getError('');
          this.getAlertText('Вы успешно авторизовались!');

          localStorage.setItem('isAuthenticated', JSON.stringify({ userData }));
          setTimeout(() => {
            this.clearInput();
            this.$router.push('/');
          }, 2000);
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          this.getError(errorText);
        });
    },

    async userRegistration() {
      await axios
        .put('auth/signup', {
          formData: {
            name: this.nameUser,
            email: this.emailUser,
            password: this.passwordUser,
          },
        })
        .then((response) => {
          this.getError('');
          this.getAlertText('Вы успешно зарегистрировались!');
          this.passwordUser = '';
          this.nameUser = '';
          this.passwordChecked = '';
          this.changeNameValueInput('');
          setTimeout(() => {
            this.statusLoginPageWindow = 'authorization';
          }, 2000);
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          this.getError(errorText);
        });
    },

    validationReg() {
      const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

      if (this.nameUser.length < 5) {
        this.getError('Имя не менее 5и символов');
        this.valid = 'false';
        return;
      }
      if (!EMAIL_REGEXP.test(this.emailUser)) {
        this.getError('Некорректный Email');
        this.valid = 'false';
        return;
      }
      if (this.passwordUser.length < 5) {
        this.getError('Пароль не менее 5и символов');
        this.valid = 'false';
        return;
      }

      if (this.passwordUser !== this.passwordChecked) {
        this.getError('Пароли не совпадают');
        this.valid = 'false';
        return;
      }

      if (
        EMAIL_REGEXP.test(this.emailUser) &&
        this.nameUser.length > 1 &&
        this.passwordUser.length > 4 &&
        this.passwordUser === this.passwordChecked
      ) {
        this.getError('');
        this.valid = 'true';
        return;
      }
    },

    validationAuthorization() {
      const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

      if (!EMAIL_REGEXP.test(this.emailUser)) {
        this.getError('Некорректный Email');
        this.valid = 'false';
        return;
      }

      if (this.passwordUser.length < 5) {
        this.getError('Пароль не менее 5и символов');
        this.valid = 'false';
        return;
      }

      if (EMAIL_REGEXP.test(this.emailUser) && this.passwordUser.length > 4) {
        this.getError('');
        this.valid = 'true';
        return;
      }
    },

    checkUserData() {
      if (this.statusLoginPageWindow === 'authorization') {
        this.validationAuthorization();
        if (this.valid === 'true') {
          this.userAuthorization();
        }
      }

      if (this.statusLoginPageWindow === 'registration') {
        this.validationReg();
        if (this.valid === 'true') {
          this.userRegistration();
        }
      }
    },
  },

  created() {
    if (this.getDataLocalStorage) {
      this.clearInput();
      this.$router.push('/');
    } else {
      this.$router.push('/auth');
    }
  },
};
</script>
