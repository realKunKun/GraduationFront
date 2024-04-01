<template>
  <div class="search">
    <MyNav :styleList="searchNavList" :activeName="activeName" @click="handleChangeView"></MyNav>
    <component class="search-list" :is="currentView"></component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchSong from "./SearchSong.vue";
import SearchSongList from "./SearchSongList.vue";
import MyNav from "@/components/layouts/MyNav.vue";

export default defineComponent({
  components: {
    MyNav,
    SearchSong,
    SearchSongList,
  },
  data() {
    return {
      searchNavList: [
        {
          name: "Songs",
          value: "SearchSong",
        },
        {
          name: "SongList",
          value: "SearchSongList",
        },
      ],
      activeName: "Song",
      currentView: "SearchSong",
    };
  },
  methods: {
    handleChangeView(item) {
      this.activeName = item.name;
      this.currentView = item.value;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "./src/assets/css/var.scss";
@import "./src/assets/css/global.scss";

.search {
  margin: auto;
  width: 900px;
  
  .search-list {
    min-height: 480px;
  }
}
</style>
