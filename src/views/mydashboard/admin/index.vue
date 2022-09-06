<template>
  <div class="dashboard-editor-container">
    <!-- 折线图开始 -->
    <el-row
      v-if="lineChartData != null && IPs != null"
      style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px"
    >
      <el-select name="nowIP" id="nowIP" v-model="nowIP">
        <el-option
          v-for="(item, index) in IPs"
          :key="index"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-select
        name="CPUorMEM"
        id="CPUorMEM"
        v-model="CPUorMEM"
        style="margin-left: 2px"
      >
        <el-option value="CPU">CPU</el-option>
        <el-option value="Memory">Memory</el-option>
      </el-select>
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <!-- 折线图结束 -->

    <!-- 其他图例 -->
    <el-row>
      <el-col
        style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px"
      >
        <bar-chart v-if="alarmData != null" :chart-data="alarmData"></bar-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入组件模板
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";

//引入api函数
import { getCPUtotal, getMEMtotal, getAlarmInstant } from "@/api/django";

export default {
  name: "DashboardAdmin",
  components: {
    LineChart,
    BarChart,
  },
  data() {
    return {
      //配置数据
      times: 1,
      IPs: null,
      nowIP: null,
      CPUorMEM: null,
      CPUData: null,
      MEMData: null,

      //传递给表格的数据
      //CPU、Memory的数据
      lineChartData: null,
      //alarm的数据
      alarmData: null,
    };
  },
  created() {
    this.fetchData();
    this.refresh();
  },
  watch: {
    nowIP(newvalue) {
      this.findByIP(newvalue);
    },
    CPUorMEM(newvalue) {
      this.findByCPUorMEM(newvalue);
    },
  },
  methods: {
    //定时刷新 10s
    refresh() {
      this.timer = setTimeout(async () => {
        await this.refresh();
        this.fetchData();
      }, 10000);
    },
    fetchData() {
      //CPU、Memory的数据
      getCPUtotal().then((Response) => {
        this.CPUData = Response;
        if (this.times == 1) {
          this.times = 2;
          this.CPUorMEM = "CPU";
          this.nowIP = this.CPUData[0][0];
          this.IPs = this.CPUData[0];
        }
      });
      getMEMtotal().then((Response) => {
        this.MEMData = Response;
      });

      //alarm的数据
      getAlarmInstant().then((Response) => {
        this.alarmData = Response;
        // console.log(this.alarmData);
      });
    },

    //监听调用函数
    findByIP(val) {
      if (this.CPUorMEM == "CPU") {
        this.lineChartData = this.CPUData[1][val];
      } else {
        this.lineChartData = this.MEMData[1][val];
      }
    },
    findByCPUorMEM(val) {
      if (val == "CPU") {
        this.lineChartData = this.CPUData[1][this.nowIP];
      } else {
        this.lineChartData = this.MEMData[1][this.nowIP];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
