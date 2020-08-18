/**
 * Doc: https://github.com/apertureless/vue-chartjs
 * https://vue-chartjs.org/
 */
import {
  Line,
  mixins,
} from 'vue-chartjs';

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'options'],
  /* watch: {
    chartData: {
      handler: function() {
        this.renderChart(this.chartData, this.options);
        // for more errors uncomment this instead:
        // this.$data._chart.update();
      },
      deep: true,
    },
  },*/
  watch: {
    chartData() {
      this.$data._chart.update();
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
