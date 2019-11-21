<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="960px"
    :before-close="dialogClose">
    <span style="display:block; padding: 0 140px;">
      <el-form ref="form" :model="form" :rules="rules" :label-width="type === 'add' ? '100px' : '0'" size="small">
        <el-form-item label="产品名称：" prop="productName" v-if="type === 'add'">
          <el-input v-model="form.productName"></el-input>
        </el-form-item>
        <el-form-item :label="`${type === 'add' ? '关系权重：' : ''}`">
          <ul class="relation-container">
            <li>
              <div class="left">
                <span>{{productOne}}</span>
                <i class="right-arrow-icon"></i>
                <span :style="{'color': productTwo ? '' : '#456EE8'}">{{productTwo || '添加节点'}}</span>
              </div>
              <div class="right">
                <el-select v-model="form.relation_up" size="mini" placeholder="请选择">
                  <el-option v-for="item in degree"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li>
              <div class="left">
                <span :style="{'color': productTwo ? '' : '#456EE8'}">{{productTwo || '添加节点'}}</span>
                <i class="left-arrow-icon"></i>
                <span>{{productOne}}</span>
              </div>
              <div class="right">
                <el-select v-model="form.relation_down" size="mini" placeholder="请选择">
                  <el-option v-for="item in degree"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </li>
          </ul>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="dialogSave">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'up-down',
    data() {
      let vm = this
      return {
        dialogVisible: false,
        form: {
          productName: '',
          relation_up: 2,
          relation_down: 2
        },
        rules: {
          productName: [
            { required: true, message: '请输入产品名称', trigger: 'blur' }
          ]
        },
        value: null,
        productOne:null,
        productTwo:null
      }
    },
    computed: {
      ...mapGetters(['degree'])
    },
    props: {
      dialogShow: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        required: false,
        default: '添加上游'
      },
      type: {
        type: String,
        required: false,
        default: 'add'
      },
      link: {
        type: Object
      },
      node: {
        type: Object
      }
    },
    watch: {
      dialogShow(data) {
        this.dialogVisible = data
        console.log(this.node)
        if (this.link) {
          this.productOne = this.link.source.data.name
          this.productTwo = this.link.target.data.name
        }
        if (this.node) {
          this.productOne = this.node.name
          this.productTwo = null
        }
      }
    },
    methods: {
      dialogSave(formName) {
        this.$refs.form.validate((valid) => {
          if ( valid ) {
            this.$emit('change', this.form)
            this.dialogClose()
          } else {
            return false;
          }
        });
      },
      dialogClose() {
        this.dialogVisible = false
        this.form.productName = null
        this.form.relation_up = 2
        this.form.relation_down = 2
        this.$refs.form.resetFields()
        this.$emit('change')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .relation-container {
    display: block;

    li {
      display: block;
      list-style: none;
      width: 100%;
      height: 30px;
      line-height: 30px;

      .left {
        float: left;
        width: calc(100% - 100px);

        a {
          cursor: default !important;
        }
      }

      .right {
        float: left;
        width: 100px;
      }
    }
  }
</style>
