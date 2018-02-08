<template>
  <div class="loading">
  	<img width=24 height=24 :src="loadImg">
  	<p class="desc">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  import loadImg from 'base/scroll/loading.gif'
  export default{
    props: {
      title: {
        type: String,
        default: '正在载入···'
      },
      loadImg: {
        type: String,
        default: loadImg
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/variable'
	.loading
	  width: 100%
	  text-align: center
	  .desc
	    line-height: 20px
	    color: $color-text-l
	    font-size: $font-size-small
</style>