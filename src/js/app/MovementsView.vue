<template>
    <div>
        <ul>
            <li is="MovementComponent"
                v-for="movementItem in movementsSortByName"
                v-bind:key="movementItem.id"
                v-bind:movement="movementItem"></li>
        </ul>
    </div>
</template>

<script>
import store from '../store.js';
import MovementComponent from './MovementComponent.vue';
import * as arrayHelper from "../array.js";

export default {
    name: 'MovementsView',
    data: function () {
        return {
            share: store
        }
    },
    computed: {
        movementsSortByName: function() {
            if(this.share.state.app.sortAsc) {
                return store.state.movements.sort(arrayHelper.compareByString);
            } else {
                return store.state.movements.sort(arrayHelper.compareByString).reverse();
            }
        }
    },
    components: {
        MovementComponent
    }
}
</script>

<style lang="css" scoped>
</style>
