<template>
  <ul class="my-nav">
    <li v-for="(item, index) in styleList" :key="index" :class="{ active: item.name === activeName }" @click="handleChangeView(item)">
      {{ item.name }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";

export default defineComponent({
  props: {
    styleList: Array,
    activeName: String,
  },
  emits: ["click"],
  setup() {
    const { proxy } = getCurrentInstance();

    function handleChangeView(val) {
      proxy.$emit("click", val);
    }
    return {
      handleChangeView,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./src/assets/css/var.scss";

.my-nav {
  width: 100%;
  li {
    line-height: 2rem;
    font-size: 1rem;
    color: $color-grey;
    border-bottom: none;
    cursor: pointer;
  }
  li.active {
    color: $color-black;
    font-weight: 600;
  }
}

@media screen and (min-width: $sm) {
  .my-nav {
    li {
      margin: 0.5rem 1rem;
    }
  }
}

@media screen and (max-width: $sm) {
  .my-nav {
    li {
      margin: 0.3rem 0.4rem;
    }
  }
}
</style>
