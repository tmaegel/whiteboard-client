<template>
    <div>
        <ul>
            <li is="equipment-component"
                v-for="equipmentItem in equipmentSortByName"
                v-bind:key="equipmentItem.id"
                v-bind:equipment="equipmentItem"></li>
        </ul>
    </div>
</template>

<script>
import store from '../store.js';
import EquipmentComponent from './EquipmentComponent.vue';
import * as arrayHelper from "../array.js";

export default {
    name: 'EquipmentView',
    data: function () {
        return {
            share: store
        }
    },
    computed: {
        equipmentSortByName: function() {
            if(this.share.state.app.sortAsc) {
                return store.state.equipment.sort(arrayHelper.compareByString);
            } else {
                return store.state.equipment.sort(arrayHelper.compareByString).reverse();
            }
        }
    },
    components: {
        EquipmentComponent
    }
}
</script>

<style lang="css" scoped>
</style>
