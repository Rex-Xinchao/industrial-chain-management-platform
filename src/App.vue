<template>
  <Layout class="main" style="height: 100%">
    <Header class="header">
      <Menu class="header-menu" mode="horizontal" :active-name="$route.name">
        <div class="menu-logo">
          <h1 class="menu-name">产业链维护平台</h1>
        </div>
        <div class="menu-nav">
          <MenuItem v-for="(item, index) in menuTag" :name="item.to" :key="index" @click.native="pageTo(item.to)">
            {{item.name}}
          </MenuItem>
        </div>
        <div class="menu-user" @mouseleave="showDropDown = false">
          <div class="user-pic" @click="showDropDown = !showDropDown"></div>
          <div class="user-name" :title="user.name" @click="showDropDown = !showDropDown">{{user.name}}</div>
          <ul v-if="showDropDown" class="drop-down">
            <li @click="logout">退出登录</li>
          </ul>
        </div>
      </Menu>
    </Header>
    <router-view></router-view>
  </Layout>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'index',
    data() {
      return {
        showDropDown: false
      }
    },
    computed: {
      ...mapGetters(['menuTag', 'user'])
    },
    methods: {
      logout() {
        this.$router.push('/login')
      },
      pageTo(path) {
        this.$router.push('/' + path)
      }
    }
  }
</script>
<style lang="scss">
  @import "./assets/styles/index";
</style>
