<template>
  <div class="sync-main">
    <div class="sync-head">
      <div class="fl">
        <div class="btn sync-btn" :class="{active: btnActive === 1}" @click="changeActive(1)">已映射</div>
        <div class="btn sync-btn" :class="{active: btnActive === 2}" @click="changeActive(2)">未映射</div>
      </div>
      <div class="fr">
        <span class="update-time">{{`最新更新：${'2019-10-24 14:00:00'}`}}</span>
      </div>
    </div>
    <div class="sync-body">
      <ul class="sync-list scrollbar_box">
        <el-checkbox-group v-model="checkList">
          <li v-for="(item, index) in data" :key="index">
            <el-checkbox :label="item.id" v-if="btnActive === 1" :key="item.id"></el-checkbox>
            <span class="sign" :class="item.sign">{{item.sign === 'add' ? '新建' : '删除'}}</span>
            <span class="text">{{item.productName}}<span class="sub-text"
                                                         v-if="item.productName">（{{item.productName}}）</span></span>
            <i class="right-arrow-icon"></i>
            <span class="text">{{item.up}}</span>
            <i class="right-arrow-icon"></i>
            <span class="text">{{item.down}}</span>
          </li>
        </el-checkbox-group>
      </ul>
      <el-button class="submit-btn fr" size="small" type="primary" v-if="btnActive === 1" @click="sync">选中项同步</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "sync",
    data() {
      return {
        btnActive: 1,
        data: [],
        checkList: []
      }
    },
    methods: {
      initData() {
        // todo 调用接口获取数据
        for( let i = 1; i < 50; i++ ) {
          this.data.push({
            sign: 'add',
            id: i,
            productName: '有线通信系统',
            up: '上游（生产原料)',
            down: '钢材（钢材A）',
          })
        }
      },
      changeActive (type) {
        this.btnActive = type
      },
      sync () {
        if (!this.checkList.length) {
          this.$message.error('请先勾选你要同步的内容')
          return
        }
        this.$message.success('同步成功')
        console.log(this.checkList)
      }
    },
    mounted() {
      this.initData()
    }
  }
</script>

<style>
  .sync-list .el-checkbox-group {
    font-size: 12px;
  }
  .sync-list .el-checkbox__label{
    font-size: 0;
  }
  .sync-list .el-checkbox:last-of-type {
    padding-top: 4.5px;
  }
</style>
<style lang="scss" scoped>;
@import "../assets/styles/common";
.sync-main {
  width: 100%;
  height: 100%;
  background-color: $color-white;

  .sync-head {
    height: 96px;
    vertical-align: middle;
    padding: 0 40px;
    line-height: 96px;
    border-bottom: 1px solid $border-color;

    .sync-btn {
      display: inline-block;
      width: 82px;
      height: 34px;
      line-height: 34px;
      border-radius: 8px;
      border: none;
      background-color: white;
      text-align: center;
      cursor: pointer;

      &.active {
        color: white;
        background-color: $color-primary;
      }
    }

    .sync-btn + .sync-btn {
      margin-left: 16px;
    }

    .update-time {
      color: #999999;
    }
  }

  .sync-body {
    width: 100%;
    height: calc(100% - 96px);

    .sync-list {
      width: 100%;
      height: calc(100% - 96px);
      margin: 0;
      padding: 0 40px;
      border-bottom: 1px solid $border-color;
      overflow-y: scroll;

      li {
        display: flex;
        width: 100%;
        height: 50px;
        align-items: center;
        border-bottom: 1px solid $border-color;

        &:nth-child(even) {
          background-color: rgba(245, 249, 255, 0.30);
        }

        .sign {
          width: 44px;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          margin-left: 10px;
          text-align: center;
          border-radius: 4px;
          background-color: #F3F3F3;
          &.add {
            color: #3E73E3;
          }

          &.del {
            color: #EC5E20;
          }
        }

        .text {
          margin: 0 4px;

          .sub-text {
            color: #999999;
          }
        }
      }
    }

    .submit-btn {
      margin: 30px 40px 0 0;
    }
  }
}
</style>
