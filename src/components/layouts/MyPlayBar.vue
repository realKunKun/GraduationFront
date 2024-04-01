<template>
  <div class="play-bar" :class="{ show: !toggle }">
    <div class="fold" :class="{ turn: toggle }">
      <my-icon :icon="iconList.ZHEDIE" @click="toggle = !toggle"></my-icon>
    </div>
    <!--Play progress-->
    <el-slider class="progress" v-model="nowTime" @change="changeTime" size="small"></el-slider>
    <div class="control-box">
      <div class="info-box">
        <!--Song image-->
        <el-image class="song-bar-img" fit="contain" :src="attachImageUrl(songPic)" @click="goPlayerPage" />
        <!--Play start and end time-->
        <div v-if="songId">
          <div class="song-info">{{ this.songTitle }} - {{ this.singerName }}</div>
          <div class="time-info">{{ startTime }} / {{ endTime }}</div>
        </div>
      </div>
      <div class="song-ctr">
        <my-icon class="my-play-show" :icon="playStateList[playStateIndex]" @click="changePlayState"></my-icon>
        <!--Previous Song-->
        <my-icon class="my-play-show" :icon="iconList.SHANGYISHOU" @click="prev"></my-icon>
        <!--play-->
        <my-icon :icon="playBtnIcon" @click="togglePlay"></my-icon>
        <!--Next Song-->
        <my-icon class="my-play-show" :icon="iconList.XIAYISHOU" @click="next"></my-icon>
        <!--volume-->
        <el-dropdown class="my-play-show" trigger="click">
          <my-icon v-if="volume !== 0" :icon="iconList.YINLIANG"></my-icon>
          <my-icon v-else :icon="iconList.JINGYIN"></my-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-slider class="my-slider" style="height: 150px; margin: 10px 0" v-model="volume" :vertical="true"></el-slider>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="song-ctr song-edit">
        <!--collection-->
        <my-icon
          class="my-play-show"
          :class="{ active: isCollection }"
          :icon="isCollection ? iconList.like : iconList.dislike"
          @click="changeCollection"
        ></my-icon>
        <!--download-->
        <my-icon
          class="my-play-show"
          :icon="iconList.download"
          @click="
            downloadMusic({
              songUrl,
              songName: singerName + '-' + songTitle,
            })
          "
        ></my-icon>
        <!--Song List-->
        <my-icon :icon="iconList.LIEBIAO" @click="changeAside"></my-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, computed, onMounted, watch } from "vue";
import { mapGetters, useStore } from "vuex";
import mixin from "@/mixins/mixin";
import MyIcon from "./MyIcon.vue";
import { HttpManager} from "@/apis/indexs";
import { formatSeconds } from "@/utils";
import { Icon, RouterName } from "@/enums";

export default defineComponent({
  components: {
    MyIcon,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const { routerManager, playMusic, checkStatus, downloadMusic } = mixin();

    const isCollection = ref(false); // Whether to bookmark

    const userId = computed(() => store.getters.userId);
    const songId = computed(() => store.getters.songId);
    const token = computed(() => store.getters.token);

    watch(songId, () => {
      initCollection();
    });
    watch(token, (value) => {
      if (!value) isCollection.value = false;
    });

    async function initCollection() {
      if (!checkStatus(false)) return;

      const params = {
        userId:userId.value,
        type:0, // 0 represents the song, 1 represents the playlist
        songId:songId.value
      };

      isCollection.value = ((await HttpManager.isCollection(params)) as ResponseBody).data;
    }

    async function changeCollection() {
      if (!checkStatus()) return;

      const params = {
        userId:userId.value,
        type:0,// 0 represents the song, 1 represents the playlist
        songId:songId.value
      };

      const result = isCollection.value
        ? ((await HttpManager.deleteCollection(userId.value, songId.value)) as ResponseBody)
        : ((await HttpManager.setCollection(params)) as ResponseBody);
      (proxy as any).$message({
        message: result.message,
        type: result.type,
      });

      if (result.data == true || result.data == false) isCollection.value = result.data;
    }

    onMounted(() => {
      if(songId.value) initCollection();
    });

    return { isCollection, playMusic, routerManager, checkStatus, attachImageUrl: HttpManager.attachImageUrl, changeCollection, downloadMusic };
  },
  data() {
    return {
      startTime: "00:00",
      endTime: "00:00",
      nowTime: 0, // Position of progress bar
      toggle: true,
      volume: 50,
      playState: Icon.XUNHUAN,
      playStateList: [Icon.XUNHUAN, Icon.LUANXU],
      playStateIndex: 0,
      iconList: {
        download: Icon.XIAZAI,
        ZHEDIE: Icon.ZHEDIE,
        SHANGYISHOU: Icon.SHANGYISHOU,
        XIAYISHOU: Icon.XIAYISHOU,
        YINLIANG: Icon.YINLIANG1,
        JINGYIN: Icon.JINGYIN,
        LIEBIAO: Icon.LIEBIAO,
        dislike: Icon.Dislike,
        like: Icon.Like,
      },
    };
  },
  computed: {
    ...mapGetters([
      "userId",
      "isPlay", // Playing
      "playBtnIcon", // Icon for playback status
      "songId", // Music ID
      "songUrl", // Music address
      "songTitle", // Song title
      "singerName", // Singer Name
      "songPic", // Song image
      "curTime", // The current music playback position
      "duration", // Music duration
      "currentPlayList",
      "currentPlayIndex", // The current song's position in the song list
      "showAside", // the sidebar displayed or not
      "autoNext", // Used to trigger automatic playback of the next song
    ]),
  },
  watch: {
    // Icon for switching playback status
    isPlay(value) {
      this.$store.commit("setPlayBtnIcon", value ? Icon.ZANTING : Icon.BOFANG);
    },
    volume() {
      this.$store.commit("setVolume", this.volume / 100);
    },
    // The start and end of playback time
    curTime() {
      this.startTime = formatSeconds(this.curTime);
      this.endTime = formatSeconds(this.duration);
      // Move progress bar
      this.nowTime = (this.curTime / this.duration) * 100;
    },
    // Automatically play the next song
    autoNext() {
      this.next();
    },
  },
  methods: {
    changeAside() {
      this.$store.commit("setShowAside", !this.showAside);
    },
    // Control music playback/pause
    togglePlay() {
      this.$store.commit("setIsPlay", this.isPlay ? false : true);
    },
    changeTime() {
      this.$store.commit("setChangeTime", this.duration * (this.nowTime * 0.01));
    },
    changePlayState() {
      this.playStateIndex = this.playStateIndex >= this.playStateList.length - 1 ? 0 : ++this.playStateIndex;
      this.playState = this.playStateList[this.playStateIndex];
    },
    // Previous Song
    prev() {
      if (this.playState === Icon.LUANXU) {
        let playIndex = Math.floor(Math.random() * this.currentPlayList.length);
        playIndex = playIndex === this.currentPlayIndex ? playIndex + 1 : playIndex;
        this.$store.commit("setCurrentPlayIndex", playIndex);
        this.toPlay(this.currentPlayList[playIndex].url);
      } else if (this.currentPlayIndex !== -1 && this.currentPlayList.length > 1) {
        if (this.currentPlayIndex > 0) {
          this.$store.commit("setCurrentPlayIndex", this.currentPlayIndex - 1);
          this.toPlay(this.currentPlayList[this.currentPlayIndex].url);
        } else {
          this.$store.commit("setCurrentPlayIndex", this.currentPlayList.length - 1);
          this.toPlay(this.currentPlayList[this.currentPlayIndex].url);
        }
      }
    },
    // Next Song
    next() {
      if (this.playState === Icon.LUANXU) {
        let playIndex = Math.floor(Math.random() * this.currentPlayList.length);
        playIndex = playIndex === this.currentPlayIndex ? playIndex + 1 : playIndex;
        this.$store.commit("setCurrentPlayIndex", playIndex);
        this.toPlay(this.currentPlayList[playIndex].url);
      } else if (this.currentPlayIndex !== -1 && this.currentPlayList.length > 1) {
        if (this.currentPlayIndex < this.currentPlayList.length - 1) {
          this.$store.commit("setCurrentPlayIndex", this.currentPlayIndex + 1);
          this.toPlay(this.currentPlayList[this.currentPlayIndex].url);
        } else {
          this.$store.commit("setCurrentPlayIndex", 0);
          this.toPlay(this.currentPlayList[0].url);
        }
      }
    },
    // Select Play
    toPlay(url) {
      if (url && url !== this.songUrl) {
        const song = this.currentPlayList[this.currentPlayIndex];
        this.playMusic({
          id: song.id,
          url,
          pic: song.pic,
          index: this.currentPlayIndex,
          name: song.name,
          lyric: song.lyric,
          currentSongList: this.currentPlayList,
        });
      }
    },
    goPlayerPage() {
      this.routerManager(RouterName.Lyric, { path: `${RouterName.Lyric}/${this.songId}` });
    },
  },
});
</script>

<style lang="scss" scoped>
@import "./src/assets/css/play-bar.scss";
</style>
