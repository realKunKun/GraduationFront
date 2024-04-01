<template>
  <div class="play-list-container">
    <MyNav :styleList="singerStyle" :activeName="activeName" @click="handleChangeView"></MyNav>
    <play-list :playList="data" path="singer-detail"></play-list>
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

<script lang="ts" setup>
import { ref, computed } from "vue";
import PlayList from "@/components/PlayList.vue";
import { singerStyle } from "@/enums";
import { HttpManager } from "@/apis/indexs";
import MyNav from "@/components/layouts/MyNav.vue";

// data
const activeName = ref("ALL Singers");
const pageSize = ref(15); // Page Size
const currentPage = ref(1); // Current Page
const allPlayList = ref([]);
// computed
const data = computed(() => {
  return allPlayList.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

// GET all singers
async function getAllSinger() {
  const result = (await HttpManager.getAllSinger()) as ResponseBody;
  currentPage.value = 1;
  allPlayList.value = result.data;
}

getAllSinger();

// GET current page
function handleCurrentChange(val) {
  currentPage.value = val;
}

function handleChangeView(item) {
  activeName.value = item.name;
  allPlayList.value = [];
  if (item.name === "all singers") {
    getAllSinger();
  } else {
    getSingerSex(item.type);
  }
}

// Classify singers by gender
async function getSingerSex(sex) {
  const result = (await HttpManager.getSingerOfSex(sex)) as ResponseBody;
  currentPage.value = 1;
  allPlayList.value = result.data;
}
</script>
