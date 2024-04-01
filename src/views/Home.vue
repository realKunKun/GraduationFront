<template>
  <!--Carousel chart-->
  <el-carousel class="swiper-container" type="card" height="20vw" :interval="4000">
    <el-carousel-item v-for="(item, index) in swiperList" :key="index">
      <img :src="item.picImg" />
    </el-carousel-item>
  </el-carousel>
  <!--Popular song list-->
  <play-list class="play-list-container" title="song list" path="song-sheet-detail" :playList="songList"></play-list>
  <!--Popular singer-->
  <play-list class="play-list-container" title="singer" path="singer-detail" :playList="singerList"></play-list>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import PlayList from "@/components/PlayList.vue";
import { swiperList, NavName } from "@/enums";
import { HttpManager } from "@/apis/indexs";
import mixin from "@/mixins/mixin";

const songList = ref([]); // song list
const singerList = ref([]); // singer list
const { changeIndex } = mixin();
try {
  HttpManager.getSongList().then((res) => {
    songList.value = (res as ResponseBody).data.sort().slice(0, 10);
  });

  HttpManager.getAllSinger().then((res) => {
    singerList.value = (res as ResponseBody).data.sort().slice(0, 10);
  });

  onMounted(() => {
    changeIndex(NavName.Home);
  });
} catch (error) {
  console.error(error);
}
</script>

<style lang="scss" scoped>
@import "./src/assets/css/var.scss";

/*Carousel chart*/
.swiper-container {
  width: 90%;
  margin: auto;
  padding-top: 20px;
  img {
    width: 100%;
  }
}

.swiper-container:deep(.el-carousel__indicators.el-carousel__indicators--outside) {
  display: inline-block;
  transform: translateX(30vw);
}

.el-slider__runway {
  background-color: $color-blue;
}
</style>
