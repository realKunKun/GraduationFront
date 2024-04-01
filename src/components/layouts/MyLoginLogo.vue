<template>
  <div class="login-logo">
    <my-icon :icon="icon"></my-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MyIcon from "./MyIcon.vue";
import { Icon } from "@/enums";

export default defineComponent({
  components: {
    MyIcon,
  },
  data() {
    return {
      icon: Icon.ERJI,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./src/assets/css/var.scss";
@import "./src/assets/css/global.scss";

.login-logo {
  background-color: $color-blue-light;
  height: calc(100vh - #{$header-height} - #{$footer-height});
  min-width: 50vw;
  overflow: hidden;
  @include layout(center, center);
  .icon {
    @include icon(36rem, $color-blue-dark);
    transform: rotate(-30deg);
  }
}

@media screen and (min-width: $sm) {
  .login-logo {
    width: 50vw;
  }
}

@media screen and (max-width: $sm) {
  .login-logo {
    width: 100vw;
  }
}
</style>
