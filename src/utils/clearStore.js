import store from '@/store';
const clearStore = {
    clearStoreData(){
        store.dispatch('userStore/changeUserId', '');
        store.dispatch('userStore/changeUserImg', '');
        store.dispatch('userStore/changeUserEmail', '');
        store.dispatch('userStore/changeUserName', '');
        store.dispatch('userStore/changeUserList', '');
        store.dispatch('userStore/changeUserInfo', '');
        store.dispatch('userStore/changeCurrentUserSettings', '');
        store.dispatch('userStore/changeFoundListUsersSync', '');
        store.dispatch('userStore/changeCurrentBoardListIdSync', '');
        store.dispatch('userStore/changeUsersBoardsListSync', '');
        store.dispatch('userStore/changeUsersPermissionSync', '');


        store.dispatch('taskStore/changeResponseTrueSync', '');
        store.dispatch('taskStore/changeResponseErrorSync', '');
        store.dispatch('taskStore/changeCurrentBoardIdSync', '');
        store.dispatch('taskStore/changeCurrentTaskIdSync', '');
        store.dispatch('taskStore/changeCurrentColumnIdSync', '');
        store.dispatch('taskStore/changeColumnsListSync', '');
        store.dispatch('taskStore/changeBoardInfoSync', '');
        store.dispatch('taskStore/changeCurrentBoardSettingsSync', '');
        store.dispatch('taskStore/changeTasksListSync', '');        
        store.dispatch('taskStore/changeBoardsListSync', '');
    }
}

export default clearStore