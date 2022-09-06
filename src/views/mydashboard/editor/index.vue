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

      <line-maker :chart-data="lineChartData" />
    </el-row>
    <!-- 折线图结束 -->
  </div>
</template>

<script>
// 引入组件模板
import LineMaker from "./components/LineMarker.vue";

//引入api函数
import { getCPUtotal, getMEMtotal } from "@/api/django";

export default {
  name: "DashboardEditor",
  components: {
    LineMaker,
  },
  data() {
    return {
      //配置数据
      times: 1,
      IPs: null,
      nowIP: null,
      CPUDataTotal: null,
      MEMDataTotal: null,
      CPUData: null,
      MEMData: null,
      CPUT: null,
      MEMT: null,

      //传递给表格的数据
      //CPU、Memory的数据
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
  },
  computed: {
    lineChartData() {
      return { CPU: this.CPUData, Memory: this.MEMData, TIME: this.T };
    },
    T() {
      if (this.CPUT != null && this.MEMT != null) {
        var temp = this.CPUT.concat(this.MEMT); //拼接
        temp = new Set(temp); //去重
        temp = [...temp]; //将set转为array
        //排序
        temp = temp.sort((a, b) => {
          return Date.parse(a) - Date.parse(b);
        });
      }
      return temp;
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
        this.CPUDataTotal = Response;
        if (this.times == 1) {
          this.nowIP = Response[0][0];
          this.IPs = Response[0];
          this.times = 2;
        }
        this.CPUT = Response[1][this.nowIP]["TIME"];
        this.CPUData = [];
        for (var i = 0; i < Response[1][this.nowIP]["TIME"].length; i++) {
          this.CPUData.push([
            Response[1][this.nowIP]["TIME"][i],
            Response[1][this.nowIP]["Data"][i],
          ]);
        }
      });
      getMEMtotal().then((Response) => {
        this.MEMDataTotal = Response;
        if (this.times == 1) {
          this.nowIP = Response[0][0];
          this.IPs = Response[0];
          this.times = 2;
        }
        this.MEMT = Response[1][this.nowIP]["TIME"];
        // this.MEMData = Response[1][this.nowIP];
        this.MEMData = [];
        for (var i = 0; i < Response[1][this.nowIP]["TIME"].length; i++) {
          this.MEMData.push([
            Response[1][this.nowIP]["TIME"][i],
            Response[1][this.nowIP]["Data"][i],
          ]);
        }
      });
    },

    // 监听调用函数
    findByIP(val) {
      if (this.CPUDataTotal == null || this.MEMDataTotal == null) {
        return;
      }
      // this.CPUData = this.CPUDataTotal[1][val];
      // this.MEMData = this.MEMDataTotal[1][val];
      this.CPUT = this.CPUDataTotal[1][val]["TIME"];
      this.MEMT = this.MEMDataTotal[1][val]["TIME"];

      for (
        var i = 0;
        i < this.CPUDataTotal[1][this.nowIP]["TIME"].length;
        i++
      ) {
        this.CPUData.push([
          this.CPUDataTotal[1][this.nowIP]["TIME"][i],
          this.CPUDataTotal[1][this.nowIP]["Data"][i],
        ]);
      }
      for (
        var i = 0;
        i < this.MEMDataTotal[1][this.nowIP]["TIME"].length;
        i++
      ) {
        this.MEMData.push([
          this.MEMDataTotal[1][this.nowIP]["TIME"][i],
          this.MEMDataTotal[1][this.nowIP]["Data"][i],
        ]);
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
