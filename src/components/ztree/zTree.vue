<template>
  <div class="tree-main">
    <Input search enter-button placeholder="请输入搜索关键词" @on-search="search"/>
    <el-button v-if="$attrs.showBtn" size="small" type="primary" class="save-btn" @click="saveNode">save</el-button>
    <button v-if="$attrs.showBtn" class="classification-add-btn" @click="addClassification">添加大分类</button>
    <div class="ztree-container scrollbar_box">
      <ul id="ztree" class="ztree"></ul>
    </div>
    <ul ref="tooltip" class="tree-tooltip"
        v-show="$attrs.editabled && isShowTip"
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
            showRenameBtn: false
          },
          view: {
            showLine: false,
            showIcon: false,
            addDiyDom: vm.addSign
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            // onRightClick: vm.onRightClick,
            onClick: vm.onRightClick,
            beforeDrag: vm.beforeDrag,
            beforeDrop: vm.beforeDrop,
            beforeRename: vm.beforeReName
          }
        },
        zNodes: TreeDate,
        isShowTip: false,
        selectedItem: null,
        selectedNode: null,
        dialogShow: false,
        showSigns: false
      }
    },
    components: { AddNode },
    methods: {
      search(data) {
        searchNodeLazy(data) // 根据关键词进行模糊搜索
      },
      // treeEvent
      initTree() {
        $.fn.zTree.init($("#ztree"), this.treeSetting, this.zNodes);
        fuzzySearch('ztree'); //初始化模糊搜索方法
      },
      onLeftClick(event, treeId, treeNode) {
        $.fn.zTree.getZTreeObj("ztree").expandNode(treeNode);
      },
      onRightClick(event, treeId, treeNode, clickFlag) {
        $.fn.zTree.getZTreeObj("ztree").selectNode(treeNode);
        this.showTooltip(event, treeNode)
        // 调整ztree选中的样式
        $('.tree-active').removeClass('tree-active');
        $('.curSelectedNode').eq(0).parent('li').eq(0).addClass('tree-active')
      },
      addSign(treeId, treeNode) {
        if (!this.showSigns) {
          return
        }
        const $node = $("#" + treeNode.tId)
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
      // 节点操作
      addClassification() {
        const newNode = {
          name: "请输入节点名称",
          id: `add${new Date().getTime()}`
        }
        const node = $.fn.zTree.getZTreeObj("ztree").addNodes(null, newNode)
        console.log(node)
        $.fn.zTree.getZTreeObj("ztree").editName(node[0])
      },
      findNode(item) {
        const treeObj = $.fn.zTree.getZTreeObj("ztree");
        const node = treeObj.getNodesByFilter(function (node) {
          return (node.id === item.id)
        }, true); // 仅查找一个节点
        return node
      },
      addLeafNode(params, node) {
        $.fn.zTree.getZTreeObj("ztree").addNodes(node, {
          id: `add${new Date().getTime()}`,
          pId: node.id,
          name: params.nodeName
        })
        this.isShowTip = false
      },
      changeNodeName() {
        $.fn.zTree.getZTreeObj("ztree").editName(this.selectedNode)
        this.isShowTip = false
      },
      delNode() {
        if ( this.selectedNode && this.selectedNode.children && this.selectedNode.children.length > 0 ) {
          this.$message.error('不能删除有子节点的父节点')
          return
        }
        $.fn.zTree.getZTreeObj("ztree").removeNode(this.selectedNode, null)
        this.isShowTip = false
      },
      saveNode() {
        const treeData = $.fn.zTree.getZTreeObj("ztree").getNodes() // 获取树全部节点数据
        console.log(treeData)
      },
      // 拖拽操作
      beforeDrag(treeId, treeNodes) {
        return true
      },
      beforeDrop(treeId, treeNodes, targetNode, moveType) {
        return true
      },
      beforeReName(treeId, treeNode, newName, isCancel) {
        if ( newName.length === 0 ) {
          this.$message.error('节点名称不能为空')
          return false
        }
        return true
      },
      // tooltipEvent
      showTooltip(e, item) {
        this.isShowTip = true
        this.selectedItem = item
        this.selectedNode = this.findNode(this.selectedItem)
        this.$refs.tooltip.style.left = e.clientX + 'px'
        this.$refs.tooltip.style.top = e.clientY - 80 + 'px'
      },
      // dialogEvent
      dialogSave(form) {
        this.dialogShow = false
        if ( !form || form === undefined ) {
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
      calcHeight () {
        let btnHeight = this.$attrs.showBtn ? 60 : 0
        $('.ztree-container').eq(0).css({height: document.querySelector('body').offsetHeight - 60 - 80 - btnHeight + 'px'})
      }
    },
    mounted() {
      this.initTree()
      this.calcHeight()
    }
  }
</script>
