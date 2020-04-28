<template>
    <li class="card equipment">
        <div class="card-header">
            <h4>{{ equipment.equipment }}</h4>
        </div>
    </li>
</template>

<script>
export default {
    name: 'EquipmentComponent',
    props: ['equipment']
}
</script>

<style lang="css" scoped>
</style>
