<template>
  <div class="board-info">
    <h2 class="board-info__title">Board info</h2>
    <div class="board-info__text">Creator: {{ boardInformation?.owner?.name }}</div>
    <div class="board-info__text-name">Name: {{ boardInformation?.name }}</div>
    <div class="board-info__text">Description: {{ boardInformation?.description }}</div>
    <div class="board-info__text">Update date: {{ this.updatedDate }}</div>
    <div class="board-info__text">Update time: {{ this.updatedTime }}</div>
  </div>
</template>

<script>
export default {
  name: 'board-info',
  props: {
    boardInformation: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      dateBoard: this.boardInformation?.updatedAt,
      updatedAt: '',
      updatedDate: '',
      updatedTime: '',
    };
  },

  methods: {
    getDateAndTime(date) {
      this.updatedAt = date.split('T');
      this.updatedDate = this.updatedAt[0];
      this.updatedTime = this.updatedAt[1].split('.')[0];
    },
  },
  created() {
    if (this.boardInformation?.updatedAt) {
      this.getDateAndTime(this.boardInformation?.updatedAt);
    }
  },

  updated() {
    if (this.boardInformation?.updatedAt) {
      this.getDateAndTime(this.boardInformation?.updatedAt);
    }
  },
};
</script>
