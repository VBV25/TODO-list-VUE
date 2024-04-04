import axios from '@/utils/axios.config.js';
import globalTextStore from '@/utils/textStore.js';

const userModule = {
  namespaced: true,
  state: {
    userId: '',
    userImg: '',
    userEmail: '',
    userName: '',
    userStatus: '',
    userList: '',
    userInfo: '',
    usersBoardsList: '',
    userPermissions: '',
    validation: false,

    foundListUsers: '',
    currentBoardListId: '',
    currentUserSettings: '',
  },

  getters: {
    userId: (state) => state.userId,
    userImg: (state) => state.userImg,
    userEmail: (state) => state.userEmail,
    userList: (state) => state.userList,
    userInfo: (state) => state.userInfo,
    usersBoardsList: (state) => state.usersBoardsList,
    userPermissions: (state) => state.userPermissions,
    currentUserSettings: (state) => state.currentUserSettings,
    foundListUsers: (state) => state.foundListUsers,
    currentBoardListId: (state) => state.currentBoardListId,
  },

  mutations: {
    changeUserId(state, newUserId) {
      state.userId = newUserId;
    },
    changeUserImg(state, newUserImg) {
      state.userImg = newUserImg;
    },
    changeUserEmail(state, newUserEmail) {
      state.userEmail = newUserEmail;
    },
    changeUserName(state, newUserName) {
      state.userName = newUserName;
    },
    changeUserList(state, newUserList) {
      state.userList = newUserList;
    },
    changeUserInfo(state, newUserInfo) {
      state.userInfo = newUserInfo;
    },
    changeUserBoardsList(state, newUserBoardsList) {
      state.usersBoardsList = newUserBoardsList;
    },
    changeUserPermissions(state, newUserPermissions) {
      state.userPermissions = newUserPermissions;
    },
    changeCurrentUserSettings(state, newCurrentUserSettings) {
      state.currentUserSettings = newCurrentUserSettings;
    },
    changeFoundListUsers(state, newFoundListUsers) {
      state.foundListUsers = newFoundListUsers;
    },
    changeCurrentBoardListId(state, newCurrentBoardListId) {
      state.currentBoardListId = newCurrentBoardListId;
    },
    changeUsersBoardsList(state, newUsersBoardsList) {
      state.usersBoardsList = newUsersBoardsList;
    },
  },

  actions: {
    changeUserId({ commit }, userId) {
      commit('changeUserId', userId);
    },
    changeUserImg({ commit }, userImg) {
      commit('changeUserImg', userImg);
    },
    changeUserEmail({ commit }, userEmail) {
      commit('changeUserEmail', userEmail);
    },
    changeUserName({ commit }, userName) {
      commit('changeUserName', userName);
    },
    changeUserList({ commit }, userList) {
      commit('changeUserList', userList);
    },
    changeUserInfo({ commit }, userInfo) {
      commit('changeUserInfo', userInfo);
    },
    changeUsersBoardsListSync({ commit }, usersBoardsList) {
      commit('changeUsersBoardsList', usersBoardsList);
    },
    changeUsersPermissionSync({ commit }, usersPermission) {
      commit('changeUserPermissions', usersPermission);
    },
    changeCurrentUserSettings({ commit }, currentUserSettings) {
      commit('changeCurrentUserSettings', currentUserSettings);
    },
    changeFoundListUsersSync({ commit }, foundListUsers) {
      commit('changeFoundListUsers', foundListUsers);
    },
    changeCurrentBoardListIdSync({ commit }, currentBoardListId) {
      commit('changeCurrentBoardListId', currentBoardListId);
    },

    //----------AXIOS--------------------
    async getListUsersBoards({ commit, dispatch }, dataUser) {
      await axios
        .get(`boards/${dataUser.boardId}/users`, {})
        .then((response) => {
          commit('changeUserBoardsList', response.data);
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          dispatch('popupData/getError', errorText, { root: true })
        });
    },

    async getUserPermissions({ commit, dispatch }, dataUser) {
      await axios
        .get(`boards/${dataUser.boardId}/users/${dataUser.userId}/permissions`, {})
        .then((response) => {
          commit('changeUserPermissions', response.data);
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          dispatch('popupData/getError', errorText, { root: true })
        });
    },

    async assigningPermissionBoardUser({ dispatch }, dataUser) {
      await axios
        .put(`boards/${dataUser.boardId}/users/${dataUser.userId}/permissions/${dataUser.permission}`, {})
        .then((response) => {
          dispatch('popupData/getAlertText', globalTextStore.assigningPermissionBoardUser, { root: true })
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          dispatch('popupData/getError', errorText, { root: true })
        });
    },

    async deletePermissionBoardUser({ dispatch }, dataUser) {
      await axios
        .delete(`boards/${dataUser.boardId}/users/${dataUser.userId}/permissions/${dataUser.permission}`, {})
        .then((response) => {
          dispatch('popupData/getAlertText', globalTextStore.deletePermissionBoardUser, { root: true })
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          dispatch('popupData/getError', errorText, { root: true })
        });
    },

    async findUsersByEmail({ commit, dispatch }, dataUser) {
      await axios
        .get(`users/match/?email=${dataUser.email}`, {})
        .then((response) => {
          commit('changeFoundListUsers', response.data.items);
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          dispatch('popupData/getError', errorText, { root: true })
        });
    },

    async addUserBoard({ dispatch }, dataUser) {
      await axios
        .post(`boards/${dataUser.boardId}/users`, {
          formData: {
            ids: dataUser.arrNewUsersBoard
          }
        })
        .then((response) => {
          dispatch('popupData/getAlertText', globalTextStore.addNewUserBoard, { root: true })
        })
        .catch((error) => {
          if (error.request.status === 500) {
            dispatch('popupData/getError', globalTextStore.selectedUserExists, { root: true })
            return
          }
          if (error.request.status !== 500) {
            const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
            dispatch('popupData/getError', errorText, { root: true })
            return
          }
        });
    },

    async deleteBoardUser({ dispatch }, dataUser) {
      await axios
        .delete(`boards/${dataUser.boardId}/users/${dataUser.userId}`, {})
        .then((response) => {
          dispatch('popupData/getAlertText', globalTextStore.deleteBoardUser, { root: true })
        })
        .catch((error) => {
          const errorText = error.response?.data?.cause ? error.response.data.cause : error.message;
          dispatch('popupData/getError', errorText, { root: true })
        });
    },

  },
};

export default userModule;