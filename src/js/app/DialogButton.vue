<template>
    <div>
         <button v-if="valid && isVisible" v-on:click="share.applyDialog()" class="btn-overlay" id="btn-ok">
             <svg class="icon icon-checkmark"><use xlink:href="#icon-checkmark"></use></svg><span class="mls"></span>
         </button>
         <button v-if="isVisible" v-on:click="share.hideDialog()" class="btn-overlay" id="btn-cancel">
             <svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg><span class="mls"></span>
         </button>
    </div>
</template>

<script>
import store from '../store.js';

export default {
    name: 'DialogButton',
    props: ['valid'],
    data: function () {
        return {
            share: store
        }
    },
    computed: {
        isVisible: function() {
            let visible = (this.share.state.dialog.workout.seen || this.share.state.dialog.score.seen && !this.share.state.user.logout);
            return visible;
        }
    }
}
</script>

<style lang="css" scoped>
#btn-ok {
    bottom:90px;
    right: 20px;
}
#btn-cancel {
    bottom:20px;
    right: 20px;
}
</style>
