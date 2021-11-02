<template>
  <div>
    <Title title="Workouts"/>
    <CardList :entries="workouts" />
  </div>
</template>

<script>
import store from '@/store'
import Title from '@/components/Title.vue'
import CardList from '@/components/CardList.vue'
import { RestWorkout } from '@/rest'

export default {
  data() {
    return {
      shared: store,
      workouts: [],
    }
  },
  created() {
    this.get_workout_list()
  },
  methods: {
    get_workout_list() {
      let workout_rest = new RestWorkout()
      workout_rest.list((data) => {
        this.workouts = data;
      })
    }
  },
  components: {
    Title,
    CardList,
  }
}
</script>
