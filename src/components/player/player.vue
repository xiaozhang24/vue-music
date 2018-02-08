<template>
  <div class="player" v-show="playList.length > 0">
	  <transition name="normal"
				  @enter="enter"
				  @afterEnter="afterEnter"
				  @leave="leave"
				  @afterLeave="afterLeave"
	  >
	  	<div class="normal-player" v-show="fullScreen">
	  		<div class="background">
	  			<img width="100%" height="100%" :src="currentSong.image">
	  		</div>
	  		<div class="top">
	  			<div class="back" @click="back">
	  				<i class="icon-back"></i>
	  			</div>
	  			<h1 class="title text-ellipsis" v-html="currentSong.name"></h1>
	  			<h2 class="subtitle text-ellipsis" v-html="currentSong.singer"></h2>
	  		</div>
	  		<div class="middle">
	  			<div class="middle-l">
	  				<div class="cd-wrapper" ref="cdWrapper">
	  					<div class="cd" :class="cdRotate">
	  						<img class="image" :src="currentSong.image">
	  					</div>
	  				</div>
	  			</div>
	  		</div>
	  		<div class="bottom">
	  			<div class="progress-wrapper">
	  				<span class="time time-l">{{format(currentTime)}}</span>
	  				<div class="progress-bar-wrapper">
	  					<progressBar :percent="percent" @percentChange="percentChange"></progressBar>
	  				</div>
	  				<span class="time time-r">{{format(currentSong.duration)}}</span>
	  			</div>
	  			<div class="operators">
	  				<div class="icon i-left">
	  					<i @click="changeMode" :class="modeIcon"></i>
	  				</div>
	  				<div class="icon i-left" :class="disableCls">
	  					<i @click="playPrev" class="icon-prev"></i>
	  				</div>
	  				<div class="icon i-center" :class="disableCls">
	  					<i @click="togglePlaying" :class="playIcon"></i>
	  				</div>
	  				<div class="icon i-right" :class="disableCls">
	  					<i @click="playNext" class="icon-next"></i>
	  				</div>
	  				<div class="icon i-right">
	  					<i class="icon icon-not-favorite"></i>
	  				</div>
	  			</div>
	  		</div>
	  	</div>
	  </transition>
	<transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="open">
    	<div class="icon">
    		<img :class="cdRotate" width="40" height="40" :src="currentSong.image">
    	</div>
    	<div class="text">
    		<h2 class="name" v-html="currentSong.name"></h2>
    		<p class="desc" v-html="currentSong.singer"></p>
    	</div>
    	<div class="control">
    		<progressCircle :radius="radius" :songPercent="songPercent">
    			<i @click.stop="togglePlaying" class="icon-mini" :class="playIconMini"></i>
    		</progressCircle>
    	</div>
    	<div class="control">
    		<i class="icon-playlist"></i>
    	</div>
    </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @play="ready" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  // import Velocity from 'velocity-animate'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import progressBar from 'base/progress-bar/progress-bar'
  import progressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/unit'
  import {getSongLyric} from 'api/singer'
  import {ERR_OK} from 'api/config'

  const transform = prefixStyle('transform')
  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        percent: 0,
        lyric: null
      }
    },
    computed: {
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      playIconMini() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdRotate() {
        return this.playing ? 'play' : 'play pause'
      },
      songPercent() {
        return this.currentTime / this.currentSong.duration
      },
      modeIcon() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'currentIndex',
        'playing',
        'mode',
        'sequenceList'
      ])
    },
    methods: {
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      togglePlaying() {
        this.setPlayingState(!this.playing)
      },
      ready() {
        this.songReady = true
      },
      error() {
        this.songReady = true
      },
      changeMode() {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.setCureentIndex(index)
      },
      playNext() {
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCureentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      },
      playPrev() {
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCureentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.playNext()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      },
      percentChange(percent) {
        this.$refs.audio.currentTime = this.currentSong.duration * percent
        if (!this.playing) {
          this.togglePlaying()
        }
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
        this.percent = this.currentTime / this.currentSong.duration
      },
      format(interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      _getPosAndScale() {
        const targetPaddingLeft = 20
        const targetPaddingBottom = 10
        const targetWidth = 40
        const width = window.innerWidth
        const top = 80
        const moveX = -(width / 2 - (targetPaddingLeft + targetWidth))
        const moveY = window.innerHeight - (top + width / 2 + targetWidth / 2 + targetPaddingBottom)
        const scale = (targetWidth / 2) / (width / 2)
        return {moveX, moveY, scale}
      },
      enter(el, done) {
        const {moveX, moveY, scale} = this._getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${moveX}px, ${moveY}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {moveX, moveY, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${moveX}px, ${moveY}px, 0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _getSongLyric() {
        getSongLyric(this.currentSong.mid).then((res) => {
          if (res.code === ERR_OK) {
            this.lyric = res.lyric
            console.log(this.lyric)
          }
        })
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PlAYING_STATE',
        setCureentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_MODE',
        setPlayList: 'SET_PLAYLIST'
      })
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
          this._getSongLyric()
        })
      },
      playing(newPlaying) {
        this.$nextTick(() => {
          const audio = this.$refs.audio
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      progressBar,
      progressCircle
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
          width: 90%
          margin: 0 auto;
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100%, 0)
        .bottom
          transform: translate3d(0, 100%, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>