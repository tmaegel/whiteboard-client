<template>
  <div>
    <Title title="Workouts"/>
    <CardList :entries="['w1', 'w2', 'w3']" />
  </div>
</template>

<script>
import Title from '@/components/Title.vue'
import CardList from '@/components/CardList.vue'

export default {
  components: {
    Title,
    CardList,
  }
}
</script>
