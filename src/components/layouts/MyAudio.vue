<template>
  <audio :src="attachImageUrl(songUrl)" autoplay controls="controls" :ref="player" preload="true" @canplay="canplay" @timeupdate="timeupdate" @ended="ended">
    <!-- (1) Property: controls, preload (2) Event: canplay, timeupdate, ended (3) Method: play(), paus() -->
    <!-- Controls: Display audio controls (play/pause/progress bar/volume) to users -->
    <!-- Preload: The attribute specifies whether to load audio after the page is loaded -->
    <!-- Canplay: Event that occurs when audio/video is in the loading process -->
    <!-- Timeupdate: When the current playback location has changed -->
    <!-- Ended: When the current playlist has ended -->
  </audio>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, computed, watch } from "vue";
import { useStore } from "vuex";
import { HttpManager } from "@/apis/indexs";

export default defineComponent({
  setup: function () {
    const {proxy} = getCurrentInstance();
    const store = useStore();
    const divRef = ref<HTMLAudioElement>();
    const player = (el) => {
      divRef.value = el;
    };
    const songUrl = computed(() => store.getters.songUrl); // Music link
    const isPlay = computed(() => store.getters.isPlay); // Playing
    const volume = computed(() => store.getters.volume); // volume
    const changeTime = computed(() => store.getters.changeTime); // Specify playback time
    const autoNext = computed(() => store.getters.autoNext); // Used to trigger automatic playback of the next song
    /**
     * Monitor playback or pause
     */
    watch(isPlay, () => togglePlay());
    /**
     * Jump to the specified time for playback
     */
    watch(changeTime, () => (divRef.value.currentTime = changeTime.value));
    watch(volume, (value) => (divRef.value.volume = value));

    /**
     * Start/Pause
     */
    function togglePlay() {
      console.log(songUrl,'songUrl')
      console.log(isPlay)
      console.log(divRef.value)
      isPlay.value ? divRef.value.play() : divRef.value.pause();
    }

    /**
     * Prepare to play after obtaining the song link
     */
    function canplay() {
      //  Record music duration
      proxy.$store.commit("setDuration", divRef.value.duration);
      //  Start playing
      divRef.value.play();
      proxy.$store.commit("setIsPlay", true);
    }

    /**
     * Record the playback position of music during playback
     */
    function timeupdate() {
      proxy.$store.commit("setCurTime", divRef.value.currentTime);
    }

    /**
     * Trigger at the end of music playback
     */
    function ended() {
      proxy.$store.commit("setIsPlay", false);
      proxy.$store.commit("setCurTime", 0);
      proxy.$store.commit("setAutoNext", !autoNext.value);
    }

    return {
      songUrl,
      player,
      canplay,
      timeupdate,
      ended,
      attachImageUrl: HttpManager.attachImageUrl,
    };
  },
});
</script>

<style scoped>
audio {
  display: none;
}
</style>
