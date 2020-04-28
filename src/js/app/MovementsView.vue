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
    computed: {
        movementsSortByName: function() {
            return store.state.movements.sort(arrayHelper.compareByString);
        }
    },
    components: {
        MovementComponent
    }
}
</script>

<style lang="css" scoped>
</style>
