import { getCurrentInstance, computed } from "vue";
import { useStore } from "vuex";
import { LocationQueryRaw } from "vue-router";
import { RouterName } from "@/enums";
import { HttpManager } from "@/apis/indexs";

interface routerOptions {
  path?: string;
  query?: LocationQueryRaw;
}

export default function () {
  const { proxy } = getCurrentInstance();

  const store = useStore();
  const token = computed(() => store.getters.token);

  function getUserSex(sex) {
    if (sex === 0) {
      return "Female";
    } else if (sex === 1) {
      return "Male";
    }
  }

  // get song title
  function getSongTitle(str) {
    return str.split("-")[1];
  }

  // get singer name
  function getSingerName(str) {
    return str.split("-")[0];
  }

  // check login status
  function checkStatus(status?: boolean) {
    if (!token.value) {
      if (status !== false)
        (proxy as any).$message({
          message: "please log in first",
          type: "warning",
        });
      return false;
    }
    return true;
  }

  // play music
  function playMusic({ id, url, pic, index, name, lyric, currentSongList }) {
    const songTitle = getSongTitle(name);
    const singerName = getSingerName(name);
    proxy.$store.dispatch("playMusic", {
      id,
      url,
      pic,
      index,
      songTitle,
      singerName,
      lyric,
      currentSongList,
    });
  }

  // download
  async function downloadMusic({ songUrl, songName }) {
    if (!songUrl) {
      (proxy as any).$message({
        message: "The download link is empty!",
        type: "error",
      });
      console.error("The download link is empty!");
      return;
    }

    const result = (await HttpManager.downloadMusic(songUrl)) as ResponseBody;
    const eleLink = document.createElement("a");
    eleLink.download = `${songName}.mp3`;
    eleLink.style.display = "none";
    // Convert character content to blob address
    const blob = new Blob([result.data]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink); // Trigger Click
    eleLink.click();
    document.body.removeChild(eleLink); // remove
  }

  // Navigation index
  function changeIndex(value) {
    proxy.$store.commit("setActiveNavName", value);
  }
  // route
  function routerManager(routerName: string | number, options: routerOptions) {
    switch (routerName) {
      case RouterName.Search:
        proxy.$router.push({ path: options.path, query: options.query });
        break;
      case RouterName.Home:
      case RouterName.SongSheet:
      case RouterName.SongSheetDetail:
      case RouterName.Singer:
      case RouterName.SingerDetail:
      case RouterName.Personal:
      case RouterName.PersonalData:
      case RouterName.Setting:
      case RouterName.SignIn:
      case RouterName.SignUp:
      case RouterName.SignOut:
      case RouterName.Lyric:
      case RouterName.Error:
      default:
        proxy.$router.push({ path: options.path });
        break;
    }
  }

  function goBack(step = -1) {
    proxy.$router.go(step);
  }

  return {
    getUserSex,
    getSongTitle,
    getSingerName,
    changeIndex,
    checkStatus,
    playMusic,
    routerManager,
    goBack,
    downloadMusic,
  };
}
