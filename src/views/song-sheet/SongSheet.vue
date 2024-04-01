<template>
  <div class="play-list-container">
    <MyNav :styleList="songStyle" :activeName="activeName" @click="handleChangeView"></MyNav>
    <play-list :playList="data" path="song-sheet-detail"></play-list>
    <el-pagination
      class="pagination"
      background
      layout="total, prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="allPlayList.length"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import YinNav from "@/components/layouts/YinNav.vue";
import PlayList from "@/components/PlayList.vue";
import { SONGSTYLE } from "@/enums";
import { HttpManager } from "@/apis/indexs";
import MyNav from "@/components/layouts/MyNav.vue";

export default defineComponent({
  components: {
    MyNav,
    PlayList,
  },
  setup() {
    const activeName = ref("All SongList");
    const pageSize = ref(15); // Page Size
    const currentPage = ref(1); // Current
    const songStyle = ref(SONGSTYLE); // Navigate styles
    const allPlayList = ref([]); // All song list
    const data = computed(() => allPlayList.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value));

    // Get all song lists
    async function getSongList() {
      allPlayList.value = ((await HttpManager.getSongList()) as ResponseBody).data;
      currentPage.value = 1;
    }
    // get song list by style
    async function getSongListOfStyle(style) {
      allPlayList.value = ((await HttpManager.getSongListOfStyle(style)) as ResponseBody).data;
      currentPage.value = 1;
    }

    try {
      getSongList();
    } catch (error) {
      console.error(error);
    }

    // get song list
    async function handleChangeView(item) {
      activeName.value = item.name;
      allPlayList.value = [];
      try {
        if (item.name === "全部歌单") {
          await getSongList();
        } else {
          await getSongListOfStyle(item.name);
        }
      } catch (error) {
        console.error(error);
      }
    }
    // get current page
    function handleCurrentChange(val) {
      currentPage.value = val;
    }
    return {
      activeName,
      songStyle,
      pageSize,
      currentPage,
      allPlayList,
      data,
      handleChangeView,
      handleCurrentChange,
    };
  },
});
</script>
