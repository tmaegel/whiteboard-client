<template>
    <li class="card movement">
        <div class="card-header">
            <h4>{{ movement.movement }}</h4>
        </div>
    </li>
</template>

<script>
export default {
    name: 'MovementComponent',
    props: ['movement']
}
</script>

<style lang="css" scoped>
</style>
