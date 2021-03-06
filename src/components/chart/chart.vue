<template>
  <div class="chart-container">
    <div class="graph-box" @click="hideMenu">
      <svg id="graph-box-svg"></svg>
    </div>
    <el-dropdown placement="bottom-start" trigger="click" ref="menuBox"
                 class="graph-menu-card" @command="handleCommand">
      <div></div>
      <el-dropdown-menu slot="dropdown" :divided="true" class="graph-menu-item">
        <el-dropdown-item v-if="currentClickNode" command="all">查看上下游</el-dropdown-item>
        <el-dropdown-item v-if="currentClickNode && (currentClickNode.type && currentClickNode.type === 'down' || currentClickNode)"
                          command="up">展开上游
        </el-dropdown-item>
        <el-dropdown-item v-if="currentClickNode && (currentClickNode.type && currentClickNode.type === 'down' || currentClickNode.root)"
                          command="add">添加上游
        </el-dropdown-item>
        <el-dropdown-item v-if="currentClickNode && (currentClickNode.type && currentClickNode.type === 'up' || currentClickNode.root)"
                          command="down">展开下游
        </el-dropdown-item>
        <el-dropdown-item v-if="currentClickNode && (currentClickNode.type && currentClickNode.type === 'up' || currentClickNode.root)"
                          command="add">添加下游
        </el-dropdown-item>
        <el-dropdown-item v-if="currentClickLink" command="remove">移除关系</el-dropdown-item>
        <el-dropdown-item v-if="currentClickLink" command="edit">编辑权重</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <UpDown :title="dialogTitle" :type="dialogType" :node="currentClickNode" :link="currentClickLink" :dialogShow="dialogShow" @change="dialogSave"></UpDown>
  </div>
</template>

<script>
  import * as d3 from "d3"
  import ChartData from '../../assets/mockData/chartData'
  import UpDown from '../dialog/upDown'
  import { mapGetters } from 'vuex'

  export default {
    name: 'myChart',
    data() {
      return {
        treeData: null,
        d3TreeBox: {
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          width: 0,
          height: 0,
          dx: 0,
          dy: 0
        },
        d3Zoom: null,
        svgInstance: null, // svg
        visInstance: null, // g
        params: {
          width: '',
          height: ''
        },
        currentClickNode: null,
        currentClickLink: null,
        lineInstance: [],
        chartData: null,
        repeatData: null,
        dialogShow: false,
        dialogTitle: null,
        dialogType: null,
      }
    },
    computed: {
      ...mapGetters(['product'])
    },
    components: {
      UpDown
    },
    watch: {
      product(data) {
        this.currentClickNode = data
        this.getChain()
      }
    },
    methods: {
      getChain(type = 'all') {
        // todo 根据当前currentClickNode的id去接口获取数据
        this.repeatData = [];
        this.chartData = [];
        let list = JSON.parse(JSON.stringify(ChartData));
        this.initData(list)
      },
      initData(data) {
        let totalList = [];
        let repeatList = [];
        this.chartData = judgeList(data, null, null);
        this.repeatData = repeatList;
        this.initTreeChart(this.chartData);

        // 递归函数，找到所有重复的子节点并删除重复的一个
        function judgeList(item, fatherName, type) {
          let list = [];
          item.forEach(e => {
            if ( e.name === 'Test' || !totalList.find(item => (item.name === e.name)) ) {
              e.type = type || e.type;
              totalList.push(e);
              e.children && (e.children = judgeList(e.children, e.name, e.type));
              list.push(e)
            } else {
              e.type = type || e.type;
              repeatList.push({
                target: fatherName,
                source: e.name
              })
            }
          });
          return list
        }
      },
      initTreeChart: function (data) {
        let $graphBox = document.querySelector('.graph-box');
        this.params.width = $graphBox.offsetWidth;
        this.params.height = $graphBox.offsetHeight - 20;
        $graphBox.innerHTML = '';// 清空tree图
        this.initChartOptions();
        this.initSvg();
        if ( !data || !data.length ) {
          return false;
        }
        this.graphTree(data[0], true); //上游
        this.graphTree(data[1], false); //下游
        this.rootNode();
        // 重复子节点手动连线
        this.linkLines()
      },
      initChartOptions() {
        this.d3TreeBox.width = this.params.width - this.d3TreeBox.margin.right - this.d3TreeBox.margin.left;
        this.d3TreeBox.height = this.params.height - this.d3TreeBox.margin.top - this.d3TreeBox.margin.bottom;
        this.d3TreeBox.dx = 25; // 节点间距
        this.d3TreeBox.dy = this.d3TreeBox.width / this.d3TreeBox.height;
        this.d3Zoom = d3.zoom().scaleExtent([0.1, 10]); // 缩放比例
      },
      initSvg() {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svg.id = "graph-box-svg";
        document.querySelector('.graph-box').appendChild(svg);
        // svg对象
        this.svgInstance = d3.select("#graph-box-svg")
          .attr("width", this.params.width)
          .attr("height", this.params.height)
          .style("font-size", "12px")
          .style("user-select", "none")
          .call(this.d3Zoom.on('zoom', () => {
            this.visInstance.attr('transform', d3.event.transform.toString())
          }))
          .on('dblclick.zoom', null);
        // g对象
        this.visInstance = this.svgInstance.append('g').attr("cursor", "pointer");
        // 需要连线的重复节点的path数组
        // 先创建好path，避免线显示在节点上层
        this.lineInstance = [];
        this.repeatData.forEach(item => {
          this.lineInstance.push({
            line: this.visInstance.append('path').data([item]),
            item: item
          })
        })
      },
      rootNode() {
        //中心点
        let vm = this;
        let rootNode = this.visInstance.select('g.isRoot.down');
        rootNode.on('click', d => {
          vm.showMenu(d3.event, { ...d.data }, null)
        });
        rootNode.select('text').remove();
        let colorLiner = this.svgInstance.append('linearGradient')
          .attr('id', 'colorLiner')
          .attr('x1', '0')
          .attr('y1', '0')
          .attr('x2', '0')
          .attr('y2', '100%');
        colorLiner.append('stop').attr('offset', '0%').attr('stop-color', '#3E73E3')
        colorLiner.append('stop').attr('offset', '100%').attr('stop-color', '#1F337C')
        rootNode.append('rect')
          .attr('width', 130)
          .attr('height', 42)
          .attr('fill', 'url(#colorLiner)')
          .attr('rx', 10)
          .attr('ry', 10)
          .attr('x', -65)
          .attr('y', -20)
          .attr('text-anchor', 'middle');
        rootNode.append('title').text(d => d.data.name);
        rootNode.append('text')
          .attr('fill', '#fff')
          .attr('x', 0)
          .attr('y', 5)
          .attr('text-anchor', "middle")
          .style('font', "12px sans-serif")
          .style('font-weight', "bold")
          .append('tspan')
          .text((d) => {
            return vm._substring(d.data.name, 14, true)
          })
      },
      linkLines() {
        let vm = this;
        setTimeout(() => {
          this.lineInstance.forEach(data => {
            let lineData = [];
            let startNode = this.visInstance.select("." + data.item.source);
            let endNode = this.visInstance.select("." + data.item.target);
            let startPosition = getPosition(startNode);
            let endPosition = getPosition(endNode);
            startPosition.y -= 20; // 在y轴上有20左右像素的偏差，未找到原因
            endPosition.y -= 20;
            let offset = (startPosition.x - endPosition.x) / 5;
            lineData.push(startPosition);
            lineData.push({ x: startPosition.x - offset, y: startPosition.y });
            lineData.push({ x: endPosition.x + offset, y: endPosition.y });
            lineData.push(endPosition);
            let line = d3.line().x(d => d.x).y(d => d.y).curve(d3.curveBasis);
            data.line
              .attr("d", line(lineData))
              .attr("stroke", "#ccc")
              .attr("stroke-width", '1.5px')
              .attr("fill", "none")
              .attr("transform", "translate(0,20)")
              .on('click', d => {
                vm.showMenu(d3.event, null, d)
              });
          })
        }, 1000);
        const getPosition = item => {
          let transformValue = item._groups[0][0].attributes.transform.value;
          let regX = /translate\((.*)\,/.exec(transformValue);
          let regY = /\,(.*)\)/.exec(transformValue);
          return {
            x: parseFloat(regX[1]),
            y: parseFloat(regY[1])
          }
        };
      },
      graphTree(data, $pos) {
        let root = d3.hierarchy(data);
        root.x0 = this.d3TreeBox.width / 2;
        root.y0 = this.d3TreeBox.height / 2;
        root.descendants().forEach((d, i) => {
          d.id = d.id || ($pos ? 'up_' : 'down_') + i;
          if ( d.children ) {
            d._children = d.children;
          }
        });
        this.updateTree(root, root, $pos);
      },
      updateTree(source, originData, $pos) {
        let vm = this;
        let d3TreeData = d3.tree()/*.size([this.d3TreeBox.width, this.d3TreeBox.height])*/.nodeSize([this.d3TreeBox.dx, 0])(originData);
        let diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
        let duration = d3.event && d3.event.altKey ? 2500 : 250;
        let nodes = d3TreeData.descendants().reverse();
        let links = d3TreeData.links();
        // Compute the new tree layout.
        // Normalize for fixed-depth.
        nodes.forEach((d) => {
          d.y = ($pos ? 1 : -1) * d.depth * 180 + this.d3TreeBox.width / 2;
        });
        let left = originData;
        let right = originData;
        source.eachBefore(node => {
          if ( node.x < left.x ) left = node;
          if ( node.x > right.x ) right = node;
        });
        let height = right.x - left.x + this.d3TreeBox.margin.top + this.d3TreeBox.margin.bottom;
        let transition = this.svgInstance.transition()
          .duration(duration)
          .attr("viewBox", [-this.d3TreeBox.margin.left - 5, left.x - this.d3TreeBox.margin.top - this.d3TreeBox.margin.bottom, this.d3TreeBox.width, height])
          .tween("resize", window.ResizeObserver ? null : () => () => this.svgInstance.dispatch("toggle"));
        // Update the nodes…
        let node = this.visInstance.selectAll("g.node")
          .data(nodes, d => d.id);
        // Enter any new nodes at the parent's previous position.
        let nodeEnter = node.enter().append("g")
          .attr("class", (d) => {
            let className = '';
            if ( d.data.level === 1 || d.data.level === 2 ) {
              className += 'no-circle '
            }
            return className + (d.data.root ? 'isRoot ' : '') + "node " + ($pos ? 'up' : 'down') + ' ' + d.data.name
          })
          .attr('display', d => d.data.hidden ? 'none' : 'block')
          .attr("transform", () => `translate(${source.y0},${source.x0})`)
          .on('click', d => {
            if ( !d.data.root && !d.data.isType && !d.data.hidden ) {
              vm.showMenu(d3.event, { ...d.data }, null)
            }
          });
        nodeEnter.append("circle")
          .attr("r", 10)
          .attr("style", d => $pos ? "fill: lightsteelblue" : "fill: #e6a23c")
          .attr('display', d => d.data.isType ? 'none' : 'block');
        nodeEnter.append("text")
          .attr("dy", "0.35em")
          .attr("x", d => d.data.isType ? 0 : ($pos ? (d._children ? -16 : 16) : (d._children ? 16 : -16)))
          .attr("text-anchor", d => $pos ? (d._children ? "end" : "start") : (d._children ? "start" : "end"))
          .text(d => d.data.name);
        nodeEnter.append("text")
          .attr("dy", "0.35em")
          .attr("x", d => {
            let len = d.data.total || 0;
            return len > 9 ? -6 : -2.9
          })
          .attr("text-anchor", "start")
          .attr("fill", "white")
          .text(d => {
            return d.data.total || ''
          })
          .attr('display', d => d.data.isType ? 'none' : 'block');
        nodeEnter.append("svg:title")
          .text(d => d.data.name);
        // Transition nodes to their new position.
        let nodeUpdate = nodeEnter.transition(transition)
          .attr("transform", d => `translate(${d.y},${d.x})`);
        nodeUpdate.select('circle')
          .attr('r', 10);
        nodeUpdate.select('text')
          .style('fill-opacity', 1);
        // Update the links…
        let link = this.visInstance.selectAll("path.link")
          .data(links, d => d.target.id);
        // Enter any new links at the parent's previous position.
        let linkEnter = link.enter().insert("path", 'g')
          .attr("class", "link " + ($pos ? 'up' : 'down'))
          .attr("d", d => {
            let o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o })
          })
          .on('click', d => {
            vm.showMenu(d3.event, null, d)
          });
        // Transition links to their new position.
        linkEnter.transition(transition)
          .attr("d", diagonal);
        // Stash the old positions for transition.
        nodes.forEach(function (d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
        this.visInstance.select('g.up.isRoot').attr('display', 'none');
        // 次级节点去除circle
        let noCircle = d3.selectAll('.no-circle').attr('style', 'cursor: default');
        noCircle.selectAll('circle').remove();
        noCircle.selectAll('text').attr('dy', 4).attr('x', 0)
      },
      showMenu(event, clickNode, link) {
        if ( clickNode && (clickNode.level === 1 || clickNode.level === 2) ) {
          return
        }
        this.currentClickNode = clickNode;
        this.currentClickLink = link;
        this.hideMenu();
        setTimeout(() => {
          this.$refs.menuBox.$el.style.display = "block";
          this.$refs.menuBox.$el.style.top = `${event.pageY - 60}px`;
          this.$refs.menuBox.$el.style.left = `${event.pageX - 240}px`;
          this.$refs.menuBox.show();
        }, 100)
      },
      hideMenu() {
        this.$refs.menuBox.hide();
        this.$refs.menuBox.$el.style.display = "none"

      },
      handleCommand(command) {
        if ( command === 'all' && this.currentClickNode ) {
          this.currentNode = { ...this.currentClickNode };
          this.getChain(command)
        } else if ( command === 'up' && this.currentClickNode ) {
          this.currentNode = { ...this.currentClickNode };
          this.getChain(command)
        } else if ( command === 'down' && this.currentClickNode ) {
          this.currentNode = { ...this.currentClickNode };
          this.getChain(command)
        } else if ( command === 'remove' && this.currentClickLink ) {
          // todo
        } else if ( command === 'edit' && this.currentClickLink ) {
          this.dialogTitle = '编辑权重';
          this.dialogType = 'edit';
          this.dialogShow = true;
        } else if ( command === 'add' && this.currentClickNode ) {
          console.log(this.currentClickNode)
          this.dialogTitle = this.currentClickNode.type === 'down' ? '添加上游' : '添加下游';
          this.dialogType = 'add';
          this.dialogShow = true;
        }
      },
      // common
      _substring(str, n, $dot) {
        let r = /[^\x00-\xff]/g;
        if ( str.replace(r, "mm").length <= n ) {
          return str;
        }
        let m = Math.floor(n / 2);
        for( let i = m; i < str.length; i++ ) {
          if ( str.substr(0, i).replace(r, "mm").length >= n ) {
            return str.substr(0, i) + ($dot ? '...' : '');
          }
        }
        return str;
      },
      dialogSave(form) {
        this.dialogShow = false
        if ( !form || form === undefined ) {
          return
        }
        console.log(JSON.parse(JSON.stringify(form)))
      }
    },
    mounted() {
      setTimeout(e => {
        this.getChain()
      }, 0)
    }
  }
</script>

<style lang="scss">
  .el-dropdown-menu {
    padding: 0;
  }

  .el-dropdown-menu__item {
    padding: 1px 18px;
  }
</style>
