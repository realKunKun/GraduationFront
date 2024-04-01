<template>
  <el-container>
    <el-aside class="album-slide">
      <el-image class="album-img" fit="contain" :src="attachImageUrl(songDetails.pic)" />
      <h3 class="album-info">{{ songDetails.title }}</h3>
    </el-aside>
    <el-main class="album-main">
      <h1>Introduction</h1>
      <p>{{ songDetails.introduction }}</p>
      <!--score-->
      <div class="album-score">
        <div>
          <h3>Song List Score</h3>
          <el-rate v-model="rank" allow-half disabled></el-rate>
        </div>
        <span>{{ rank * 2 }}</span>
        <div>
          <h3>{{ assistText }} {{ score * 2 }}</h3>
          <el-rate allow-half v-model="score" :disabled="disabledRank" @click="pushValue()"></el-rate>
        </div>
      </div>
      <!--songs-->
      <song-list class="album-body" :songList="currentSongList"></song-list>
      <comment :playId="songListId" :type="1"></comment>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import mixin from "@/mixins/mixin";
import SongList from "@/components/SongList.vue";
import Comment from "@/components/Comment.vue";
import { HttpManager} from "@/apis/indexs";

export default defineComponent({
  components: {
    SongList,
    Comment,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const { checkStatus } = mixin();

    const currentSongList = ref([]); // Music stored
    const songListId = ref(""); // Song list ID
    const score = ref(0);
    const rank = ref(0);
    const disabledRank = ref(false);
    const assistText = ref("评价");
    // const evaluateList = ref(["Very poor", "poor", "decent", "recommended", "strongly recommended"]);
    const songDetails = computed(() => store.getters.songDetails); // Single playlist information
    const userId = computed(() => store.getters.userId);

    songListId.value = songDetails.value.id; // Assign a value to the playlist ID

    /**
     * Collect songs from song lists
     */
    async function getSongId(id) {
      const result = (await HttpManager.getListSongOfSongId(id)) as ResponseBody;
      // Obtain song information from the playlist
      for (const item of result.data) {
        // Get songs from the list
        const resultSong = (await HttpManager.getSongOfId(item.songId)) as ResponseBody;
        console.log(resultSong.data);
        currentSongList.value.push(resultSong.data);
      }
    }
    /**
     * getRank
     */
    async function getRank(id) {
      const result = (await HttpManager.getRankOfSongListId(id)) as ResponseBody;
      rank.value = result.data / 2;
    }
    async function getUserRank(userId, songListId) {
      const result = (await HttpManager.getUserRank(userId, songListId)) as ResponseBody;
      score.value = result.data / 2;
      disabledRank.value = true;
      assistText.value = "已评价";
    }
    /**
     * submit score
     */
    async function pushValue() {
      if (disabledRank.value || !checkStatus()) return;

      const params = {
        songListId:songListId.value,
        userId:userId.value,
        score:score.value * 2
      };

      try {
        const result = (await HttpManager.setRank(params)) as ResponseBody;
        (proxy as any).$message({
          message: result.message,
          type: result.type,
        });

        if (result.success) {
          getRank(songListId.value);
          disabledRank.value = true;
          assistText.value = "Reviewed";
        }
      } catch (error) {
        console.error(error);
      }
    }

    getUserRank(userId.value, songListId.value);
    getRank(songListId.value); // get score
    getSongId(songListId.value); // get song By Id

    return {
      songDetails,
      rank,
      score,
      disabledRank,
      assistText,
      currentSongList,
      songListId,
      attachImageUrl: HttpManager.attachImageUrl,
      pushValue,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./src/assets/css/var.scss";

.album-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  .album-img {
    height: 250px;
    width: 250px;
    border-radius: 10%;
  }

  .album-info {
    width: 70%;
    padding-top: 2rem;
  }
}

.album-main {
  h1 {
    font-size: 22px;
  }

  p {
    color: rgba(0, 0, 0, 0.5);
    margin: 10px 0 20px 0px;
  }
  /*歌单打分*/
  .album-score {
    display: flex;
    align-items: center;
    margin: 1vw;

    h3 {
      margin: 10px 0;
    }
    span {
      font-size: 60px;
    }
    & > div:last-child {
      margin-left: 10%;
    }
  }

  .album-body {
    margin: 20px 0 20px 0px;
  }
}

@media screen and (min-width: $sm) {
  .album-slide {
    position: fixed;
    width: 400px;
  }
  .album-main {
    min-width: 600px;
    padding-right: 10vw;
    margin-left: 400px;
  }
}

@media screen and (max-width: $sm) {
  .album-slide {
    display: none;
  }
}
</style>
