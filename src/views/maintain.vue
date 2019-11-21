<template>
  <div class="maintain-main">
    <div class="show-container">
      <div class="title-container">
        <h1>数库分类</h1>
      </div>
      <div class="operation-container">
        <div class="fl">
          <el-checkbox v-model="showSigns">{{`高亮最新更新： ${'2019-10-20 19:10'}`}}</el-checkbox>
        </div>
        <div class="fr">
          <span class="clear-text" @click="clearTips">清楚本次更新高亮状态</span>
        </div>
      </div>
      <div class="tree-container">
        <Tree ref="forShow" :showSigns="showSigns" :marginTop="60"></Tree>
      </div>
    </div>
    <div class="edit-container">
      <div class="title-container">
        <h1>自定义分类</h1>
        <el-button size="mini" class="maintain-save-btn" type="primary" @click="saveTree">保存</el-button>
      </div>
      <div class="msg-container">{{`最后保存时间： ${'2019-11-20 14:30'}`}}</div>
      <div class="tree-container">
        <Tree ref="forEdit" :editable="true" :showBtn="true" :marginTop="60" :isCopy="false" :readonly="false"></Tree>
      </div>
    </div>
  </div>
</template>

<script>
  import Tree from '../components/ztree/zTree'

  // todo 功能左侧的树可以拖拽复制到右侧，右侧的不能复制
  export default {
    name: "maintain",
    data() {
      return {
        showSigns: false
      }
    },
    components: { Tree },
    methods: {
      clearTips() {
        // todo 调用接口清楚tips标签
        this.$refs.forShow.init()
      },
      saveTree () {
        let nodes = this.$refs.forEdit.getCurrentNodes()
        // todo 调用接口保存数据
        console.log(JSON.parse(JSON.stringify(nodes)))
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
  // ztree样式
  @import "../assets/styles/ztree/metroStyle/metroStyle.css";
  @import "../assets/styles/tree";

  .operation-container {
    .el-checkbox {
      font-size: 12px !important;
      color: #999999 !important;
    }

    .el-checkbox__inner {
      width: 12px !important;
      height: 12px !important;

      &:after {
        top: 0 !important;
        left: 3px !important;
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import "../assets/styles/common";

  .maintain-main {
    width: 100%;
    height: 100%;
    padding: 40px 20px;
    background-color: $color-white;
    .show-container, .edit-container {
      float: left;
      padding: 0 20px;
      width: calc(50% - 20px);
      height: calc(100% - 80px);

      .title-container {
        position: relative;
        height: 28px;
        line-height: 28px;
        h1 {
          font-size: 20px;
          color: #464C5A;
          letter-spacing: 2px;
        }

        .maintain-save-btn {
          position: absolute;
          right: 0;
          top: 0;
        }
      }

      .operation-container, .msg-container {
        height: 20px;
        line-height: 20px;
        margin-top: 20px;
        font-size: 12px;
        color: #999999;

        .clear-text {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
</style>
