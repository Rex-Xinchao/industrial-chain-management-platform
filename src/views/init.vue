<template>
  <div class="init-main">
    <div class="form-container">
      <el-form ref="form" size="small" label-position="top" label-width="80px">
        <el-form-item label="行业分类标准">
          <el-select class="init-form-select" v-model="standard" placeholder="请选择">
            <el-option
              v-for="item in standardOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="init-form-btn" type="primary" @click="onInit">初始化</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: "init",
    data() {
      return {
        standard: 1,
        form: {}
      }
    },
    computed: {
      ...mapGetters(['standardOptions'])
    },
    methods: {
      onInit() {
        // TODO 调用初始化接口
      }
    }
  }
</script>

<style lang="scss" scoped>
  .init-main {
    position: relative;
    width: 100%;
    height: 100%;

    .form-container {
      width: 480px;
      height: 300px;
      position: absolute;
      top: calc(50% - 150px);
      left: calc(50% - 240px);

      .init-form-select {
        width: 100%;
      }

      .init-form-btn {
        margin-left: calc(50% - 36px);
        width: 80px !important;
        height: 30px !important;
      }
    }
  }
</style>
