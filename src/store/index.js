import { createStore } from "vuex";
import taskStore from "@/store/modules/tasksStore.js";
import userStore from "@/store/modules/userStore.js";
import popupData from "@/store/modules/popupData.js";

const store = createStore({
     modules: {
          taskStore,
          userStore,
          popupData
     },
});

export default store;
