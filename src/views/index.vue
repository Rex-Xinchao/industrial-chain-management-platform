<template>
  <Layout class="layout">
    <Sider class="container-sider" hide-trigger :width="240">
      <div class="sidebar-main">
        <Tree :showSearch="true" :dragable="false"></Tree>
      </div>
    </Sider>
    <Layout class="container-main">
      <Chart></Chart>
    </Layout>
  </Layout>
</template>

<script>
  import Tree from '../components/ztree/zTree'
  import Chart from '../components/chart/chart'

  export default {
    components: { Tree, Chart }
  }
</script>

<style lang="scss">
  // ztree样式
  @import "../assets/styles/ztree/metroStyle/metroStyle.css";
  @import "../assets/styles/tree";
  // tree图样式
  @import "../assets/styles/chart.scss";
</style>
