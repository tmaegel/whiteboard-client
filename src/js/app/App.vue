<template>
    <div id="app">
        <NotificationComponent></NotificationComponent>
        <Topbar></Topbar>
        <LoginDialog></LoginDialog>
        <ContextMenu></ContextMenu>
        <div id="container">
            <component v-bind:is="getCurrentViewComponent"></component>
        </div>
    </div>
</template>

<script>
import store from '../store.js';
import Topbar from './Topbar.vue'
import HomeView from './HomeView.vue';
import WorkoutsView from './WorkoutsView.vue';
import MovementsView from './MovementsView.vue';
import EquipmentView from './EquipmentView.vue';
import LoaderView from './LoaderView.vue';
import ContextMenu from './ContextMenu.vue';
import NotificationComponent from './NotificationComponent.vue';
import LoginDialog from './LoginDialog.vue';

export default {
    name: 'App',
    data: function () {
        return {
            share: store
        }
    },
    components: {
        Topbar,
        ContextMenu,
        NotificationComponent,
        LoginDialog,
        'homeView': HomeView,
        'workoutsView': WorkoutsView,
        'movementsView': MovementsView,
        'equipmentView': EquipmentView,
        'loaderView': LoaderView
    },
    computed: {
        getCurrentViewComponent: function() {
            return this.share.getCurrentView() + "View";
        }
    }
}
</script>

<style lang="css" scoped>
</style>
