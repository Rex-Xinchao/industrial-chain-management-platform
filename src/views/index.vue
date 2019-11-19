<template>
  <Layout class="layout">
    <Sider class="container-sider" hide-trigger :width="240">
      <SidebarTree :editabled="false" :showBtn="false"></SidebarTree>
    </Sider>
    <Layout class="container-main">
      <Chart></Chart>
    </Layout>
  </Layout>
</template>

<script>
  import SidebarTree from '../components/sidebar'
  import Chart from '../components/chart/chart'

  export default {
    components: { SidebarTree, Chart }
  }
</script>

<style lang="scss">
  // ztree样式
  @import "../../static/ztree/metroStyle/metroStyle.css";
  @import "../../static/tree";
  // tree图样式
  @import "../../static/chart.scss";
</style>
