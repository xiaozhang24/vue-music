<template>
  <div class="recommend" ref="recommend">
  	<scroll class="recommend-content" :data="discList" ref="scroll">
	  	<div>
	  		<div v-if="recommends.length" class="slider-wrapper">
	  			<slider>
	  				<div v-for="item in recommends">
	  					<a :href="item.linkUrl">
	  						<img class="needsclick" @load="loadImage" :src="item.picUrl">
	  					</a>
	  				</div>
	  			</slider>
	  		</div>
	  		<div class="recommend-list">
	  			<h1 class="list-title">热门歌单推荐</h1>
	  			<ul>
	  				<li @click="selectItem(item)" v-for="item in discList" class="item">
	  					<div class="icon">
	  						<img width=60 height=60 v-lazy="item.imgurl">
	  					</div>
	  					<div class="text">
	  						<h2 class="name" v-html="item.creator.name"></h2>
	  						<p class="desc" v-html="item.dissname"></p>
	  					</div>
	  				</li>
	  			</ul>
	  		</div>
	  	</div>
	  	<div class="load-wrapper" v-show="!discList.length">
	  		<loading></loading>
	  	</div>
  	</scroll>
  	<router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import {getRecommend} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {mapMutations} from 'vuex'
  const response = require('common/data/playlist.json')
  export default{
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    created() {
      this._getRecommend()
      // this._getDiscList()
      setTimeout(() => {
        this.discList = response.data.list
      }, 500)
    },
    methods: {
      handlePlayList(playList) {
        const bottom = this.playList.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDesc(item)
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
            console.log(this.recommends)
          }
        })
      },
      loadImage() {
        if (!this.checkLoaded) {
          setTimeout(() => {
            this.$refs.scroll.refresh()
          }, 20)
          this.checkLoaded = true
        }
      },
      ...mapMutations({
        setDesc: 'SET_DESC'
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    } 
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable';
  .recommend
    position: fixed
    top:88px
    bottom:0
    width:100%
    .recommend-content
      height:100%
      overflow:hidden
      .slider-wrapper
        position:relative
        overflow:hidden
        width:100%
      .recommend-list
        .list-title
          color:$color-theme
          font-size:$font-size-medium
          text-align:center
          height:65px
          line-height:65px
        .item
          display:flex
          padding: 0 20px 20px 20px
          box-sizing: border-box
          align-items:center
          .icon
            flex:0 0 60px
            width:60px
            padding-right:20px
        .text
          display:flex
          flex:1
          flex-direction:column
          justify-content: center
          line-height:20px
          overlow:hidden
          font-size:$font-size-medium
          .name
            margin-bottom:10px
            color:$color-text
          .desc
            color:$color-text-d
      .load-wrapper
      	width:100%
        position:absolute
        top:50%
        transform: translateY(-50%)
</style>