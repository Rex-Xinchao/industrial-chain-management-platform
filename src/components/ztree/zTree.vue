<template>
  <div class="tree-main">
    <Input v-if="showSearch" search enter-button placeholder="请输入搜索关键词" @on-search="search"/>
    <div ref="container" class="ztree-container scrollbar_box">
      <button v-if="showBtn" class="classification-add-btn" @click="addRootNode"><span class="add-icon">+</span> 大分类</button>
      <ul ref="tree" class="ztree"></ul>
    </div>
    <ul ref="tooltip" class="tree-tooltip"
        v-show="editable && isShowTip"
        @mouseleave="isShowTip = false">
      <li @click="dialogShow = true">添加节点</li>
      <li @click="changeNodeName">变更名称</li>
      <li @click="delNode">移除节点</li>
    </ul>
    <Add-Node :dialogShow="dialogShow" @change="dialogSave"></Add-Node>
  </div>
</template>

<script>
  import '../../libs/jquery.ztree.all'
  import '../../libs/jquery.ztree.exhide'
  import { fuzzySearch, searchNodeLazy } from '../../libs/fuzzysearch'
  import AddNode from '../dialog/addNode'
  import TreeDate from '../../assets/mockData/treeData'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: "zTree",
    data() {
      let vm = this;
      return {
        treeSetting: {
          edit: {
            enable: true,
            editNameSelectAll: true,
            showRemoveBtn: false,
            showRenameBtn: false,
            drag: {
              isCopy: vm.isCopy,
              isMove: !vm.isCopy
            }
          },
          view: {
            showLine: false,
            showIcon: false,
            addDiyDom: vm.addSign
          },
          data: {
            readonly: true,
            simpleData: {
              enable: true
            }
          },
          callback: {
            // onRightClick: vm.onRightClick,
            onClick: vm.onRightClick,
            beforeDrag: vm.beforeDrag,
            beforeDrop: vm.beforeDrop,
            onDrop: vm.onDrop,
            beforeRename: vm.beforeReName
          }
        },
        zNodes: TreeDate,
        isShowTip: false,
        selectedItem: null,
        selectedNode: null,
        dialogShow: false,
        timestamp: new Date().getTime(),
        isRepeated: false
      }
    },
    props: {
      editable: { type: Boolean, default: () => false },
      showSearch: { type: Boolean, default: () => false },
      showBtn: { type: Boolean, default: () => false },
      showSigns: { type: Boolean, default: () => false },
      marginTop: { type: Number, default: 0 },
      readonly: { type: Boolean, default: () => true },
      isCopy: { type: Boolean, default: () => true },
      dragable: { type: Boolean, default: () => true },
    },
    components: { AddNode },
    computed: {
      ...mapGetters(['treeMap'])
    },
    watch: {
      showSigns() {
        this.init()
      }
    },
    methods: {
      ...mapActions(['SetProduct', 'SetTree']),
      init() {
        // 单个页面存在调用tree组件多次的情况，设置不同的id
        this.$refs.tree.setAttribute('id', `ztree${this.timestamp}`)
        this.$refs.container.setAttribute('id', `container${this.timestamp}`)
        this.initTree()
        this.calcHeight()
      },
      search(data) {
        searchNodeLazy(data) // 根据关键词进行模糊搜索
      },
      // 树相关
      initTree() {
        this.initData(this.zNodes)
        $.fn.zTree.init($(`#ztree${this.timestamp}`), this.treeSetting, this.zNodes);
        this.setTreeToStore()
        fuzzySearch(`ztree${this.timestamp}`); //初始化模糊搜索方法
      },
      initData(data) {
        data.forEach(item => {
          item.readonly = this.readonly
          if ( !!item.children && item.children.length ) {
            this.initData(item.children)
          }
        })
      },
      addSign(treeId, treeNode) {
        const $node = $("#" + treeNode.tId)
        if ( !this.showSigns ) {
          $node.append('<span class=\'tree-sign\'>&nbsp;</span>');
          return
        }
        if ( treeNode.add ) {
          $node.append('<span class=\'tree-sign\'>[新增]</span>');
        }
        if ( treeNode.delete ) {
          $node.append('<span class=\'tree-sign\'>[删除]</span>');
        }
        if ( treeNode.move ) {
          $node.append('<span class=\'tree-sign\'>[移动]</span>');
        }
        if ( treeNode.rename ) {
          $node.append('<span class=\'tree-sign\'>[更名]</span>');
        }
        if ( treeNode.needMapping ) {
          $node.append('<span class=\'tree-sign\'>[未映射]</span>');
        }
      },
      // 节点操作相关
      initNodes() {
        const treeObj = $.fn.zTree.getZTreeObj(`ztree${this.timestamp}`);
        const node = treeObj.getNodes();
        this.initData(node)
        this.setTreeToStore()
      },
      onLeftClick(event, treeId, treeNode) { // 废弃
        $.fn.zTree.getZTreeObj(`ztree${this.timestamp}`).expandNode(treeNode);
      },
      onRightClick(event, treeId, treeNode, clickFlag) {
        $.fn.zTree.getZTreeObj(`ztree${this.timestamp}`).selectNode(treeNode);
        if ( !this.editable ) {
          this.SetProduct(treeNode)
        }
        this.showTooltip(event, treeNode)
        // 调整ztree选中的样式
        $(`#container${this.timestamp}`).find('.tree-active').removeClass('tree-active');
        $(`#container${this.timestamp}`).find('.curSelectedNode').eq(0).parent('li').eq(0).addClass('tree-active')
      },
      addRootNode() { // 添加root节点
        // todo 连续点击的情况
        const newNode = {
          name: "请输入节点名称",
          id: `add${new Date().getTime()}`
        }
        const node = $.fn.zTree.getZTreeObj(`ztree${this.timestamp}`).addNodes(null, newNode)
        $.fn.zTree.getZTreeObj(`ztree${this.timestamp}`).editName(node[0])
        this.setTreeToStore()
      },
      addLeafNode(params, node) { // 添加子节点
        $.fn.zTree.getZTreeObj(`ztree${this.timestamp}`).addNodes(node, {
          id: `add${new Date().getTime()}`,
          pId: node.id,
          name: params.nodeName
        })
        this.isShowTip = false
        this.setTreeToStore()
      },
      delNode() {
        if ( this.selectedNode && this.selectedNode.children && this.selectedNode.children.length > 0 ) {
          this.$message.error('不能删除有子节点的父节点')
          return
        }
        $.fn.zTree.getZTreeObj(`ztree${this.timestamp}`).removeNode(this.selectedNode, null)
        this.isShowTip = false
        this.setTreeToStore()
      },
      changeNodeName() {
        $.fn.zTree.getZTreeObj(`ztree${this.timestamp}`).editName(this.selectedNode)
        this.isShowTip = false
        this.setTreeToStore()
      },
      findNode(item, isSingle = true) {
        const treeObj = $.fn.zTree.getZTreeObj(`ztree${this.timestamp}`);
        return treeObj.getNodesByFilter(function (node) {
          return (node.id === item.id)
        }, isSingle);
      },
      findNodeName (name, id = null) {
        return $.fn.zTree.getZTreeObj(`ztree${this.timestamp}`).getNodesByFilter(function (node) {
          if (id) {
            return (node.name === name) && (node.id !== id)
          } else {
            return (node.name === name)
          }
        }, true);
      },
      beforeReName(treeId, treeNode, newName, isCancel) {
        if ( newName.length === 0 ) {
          this.$message.error('节点名称不能为空')
          return false
        }
        if (this.findNodeName(newName, treeNode.id)) {
          this.$message.error('此节点已经存在')
          return false
        }
        return true
      },
      getCurrentNodes() { // 供父组件调用
        return $.fn.zTree.getZTreeObj(`ztree${this.timestamp}`).getNodes() // 获取树全部节点数据
      },
      // 拖拽操作相关
      beforeDrag(treeId, treeNodes) {
        if (!this.dragable) {
          return false
        }
        if ( treeNodes[0].children && treeNodes[0].children.length > 1 ) {
          this.$message.error('不能拖拽有子节点的父节点')
          return false
        }
        return true
      },
      beforeDrop(treeId, treeNodes, targetNode, moveType) {
        if ( targetNode.readonly ) {
          this.$message.error('目标树只支持只读操作');
          return false
        } else {
          treeNodes[0].readonly = true
          console.log(treeNodes[0].id, 'this')
          if (find(this.treeMap[treeId], treeNodes[0].id) ) {
            this.$message.error('已存在此节点');
            return false
          }
            return true
        }

        function find(data, id) {
          let answer = null
          data.forEach(item => {
            if ( item.id === id ) {
              answer = true
            }
            !answer && item.children && (answer = find(item.children, id))
          })
          return answer
        }
      },
      onDrop(event, treeId, treeNodes, targetNode, moveType) {
        this.$eventBus.$emit('initNodes') // 通知所有的树（主要是接受拖拽的对象）更新新增nodes的readonly属性
      },
      // 弹窗&浮层
      showTooltip(e, item) {
        this.isShowTip = true
        this.selectedItem = item
        this.selectedNode = this.findNode(this.selectedItem)
        this.$refs.tooltip.style.left = e.clientX - 20 + 'px'
        this.$refs.tooltip.style.top = e.clientY - 40 + 'px'
      },
      dialogSave(form) {
        this.dialogShow = false
        if ( !form || form === undefined ) {
          return
        }
        if (this.findNodeName(form.nodeName)) {
          this.$message.error('添加失败，此节点已经存在')
          return
        }
        if ( form.isEmpty ) {
          const addNode = this.findNode(this.selectedItem)
          this.addLeafNode(form, addNode)
        } else {
          form.productName.forEach(item => {
            const addNode = this.findNode({ id: item })
            this.addLeafNode(form, addNode)
          })
        }
      },
      // common
      calcHeight() {
        $(`#container${this.timestamp}`).css({ height: document.querySelector('body').offsetHeight - 60 - 100 - this.marginTop + 'px' })
      },
      setTreeToStore() {
        this.SetTree({
          id: `ztree${this.timestamp}`,
          nodes: $.fn.zTree.getZTreeObj(`ztree${this.timestamp}`).getNodes()
        })
      }
    },
    mounted() {
      this.$eventBus.$on('initNodes', this.initNodes)
      this.init()
    }
  }
</script>
<style scoped>
  .add-icon{
    color: #2d8cf0;
    font-size: 14px;
    font-weight: bolder;
    line-height: 14px;
  }
</style>
