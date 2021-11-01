<template>
  <div>
    <Title title="Workouts"/>
    <CardList :entries="['w1', 'w2', 'w3']" />
  </div>
</template>

<script>
import Title from '@/components/Title.vue'
import CardList from '@/components/CardList.vue'
import store from '@/store'
import { RestWorkout } from '@/rest'

export default {
  data() {
    return {
      shared: store,
    }
  },
  mounted() {
    this.get_workout_list();
  },
  methods: {
    get_workout_list() {
      let rest_workout = new RestWorkout();
      rest_workout.list();
    }
  },
  components: {
    Title,
    CardList,
  }
}
</script>
