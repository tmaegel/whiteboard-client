<template>
    <div v-if="notification.state.seen" class="notification" v-bind:class="getNotificationType">{{ notification.state.message }}</div>
</template>

<script>
import notification from '../notification.js';

export default {
    name: 'NotificationComponent',
    data: function () {
        return {
            notification
        }
    },
    computed: {
        getNotificationType: function() {
            return "notification-" + this.notification.state.currentType.toLowerCase();
        }
    }
}
</script>

<style lang="css" scoped>
.notification {
    left: 0;
    top: 0;
    position: fixed;
    z-index: 2; /* Sit on top */
    width: 100%; /* Could be more or less, depending on screen size */
    color: white;
    padding: 12px;
    box-shadow: 0 1px 13px rgba(0,0,0,0.24);
}
.notification-ok { background-color: #4CAF50; }
.notification-info { background-color: #2196F3; }
.notification-warn { background-color: #ffeb3b; }
.notification-error { background-color: #f44336; }
</style>
