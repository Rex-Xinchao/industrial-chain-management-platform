<template>
  <div class="sidebar-main">
    <Tree v-bind="$attrs"></Tree>
  </div>
</template>

<script>
  import Tree from './ztree/zTree'

  // todo 树组件使用ztree优化
  export default {
    name: 'Sidebar-Tree',
    data() {
      return {
        searchKey: null
      }
    },
    components: { Tree }
  }
</script>
