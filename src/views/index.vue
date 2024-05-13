<template>
  <h3> index 页面 </h3>
    <el-row>
        <el-col>
            <el-card>
                <div ref="lineChart" style="height: 380px; width: 1200px; margin: 0px auto;"></div>
            </el-card>
            <div class="graph">
                <el-card style="height: 360px;">
                    <div ref="Histogram" style="height: 380px; width: 600px; margin: 0px auto;"></div>
                </el-card>
                <el-card style="height: 360px;">
                    <div ref="PieChart" style="height: 380px; width: 600px; margin: 0px auto;"></div>
                </el-card>
            </div>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>


</script>

<style lang="less" scoped>
.graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .el-card {
        width: 48%;
    }
}
</style>