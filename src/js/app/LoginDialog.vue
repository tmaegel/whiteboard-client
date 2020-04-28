<template>
    <div>
        <div v-if="share.state.user.logout" class="dialog">
             <div class="dialog-content">
                <h5>Login</h5>
                <input v-model="share.state.user.name" v-on:keyup="validateInput()" v-bind:class="{ invalid: !validUsername }" type="text" placeholder="username">
                <input v-model="share.state.user.password" v-on:keyup="validateInput()" v-bind:class="{ invalid: !validPassword }" type="password" placeholder="password">
             </div>
        </div>
        <button v-if="isValid && isValid && share.state.user.logout" v-on:click="request.restUserLogin()" class="btn-overlay" id="btn-login">
            <svg class="icon icon-checkmark"><use xlink:href="#icon-checkmark"></use></svg><span class="mls"></span>
        </button>
    </div>
</template>

<script>
import store from '../store.js';
import * as request from "../rest.js";
import * as regexHelper from "../regex.js";

export default {
    name: 'LoginDialog',
    data: function () {
        return {
            validUsername: true,
            validPassword: true,
            share: store
        }
    },
    computed: {
        isValid: function() {
            let valid = (this.validUsername && this.validPassword);
            return valid;
        },
        isVisible: function() {
            let visible = (share.state.user.name || share.state.user.password);
            return visible;
        }
    },
    methods: {
        validateInput() {
            if(!regexHelper.empty(this.share.state.user.name)) {
                this.validUsername = true;
            } else {
                this.validUsername = false;
            }
            if(!regexHelper.empty(this.share.state.user.password)) {
                this.validPassword = true;
            } else {
                this.validPassword = false;
            }
        }
    }
}
</script>

<style lang="css" scoped>
#btn-menu {
    bottom:20px;
    right: 20px;
}
</style>
