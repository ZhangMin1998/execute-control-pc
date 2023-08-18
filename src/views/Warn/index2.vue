<template>
  <div class="container">
    第二菜单  测试功能  后面删除这个文件

    <!-- <div class="father"></div>
    <div class="son">son</div> -->
  </div>  
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
.container{
  position: relative;
  .father{
    width: 100px;
    height: 100px;
    margin-top: 100px;
    margin-left: 100px;
    background: pink;
    // cursor: pointer;
    -webkit-app-region: drag;
    overflow: hidden;
  }
  .son{
      // z-index: 999;
      position: absolute;
      left: 120px;
      top: 130px;
      cursor: pointer;
      width: 50px;
      height: 50px;
      border: 1px solid #000;
      background: yellow;
      -webkit-app-region: no-drag;
    }
}
</style>