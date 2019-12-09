<template>
  <div class="card p-3 bg-white mt-3">
    <div class="card-header d-flex ai-center">
      <i class="iconfont" :class="`icon-${icon}`"></i>
      <div class="fs-xl flex-1 px-2">{{title}}</div>
      <i class="iconfont" :class="`icon-${icon}`"></i>
    </div>
    <div class="card-body pt-3"></div>
    <div class="pt-3">
      <swiper>
        <swiper-slide v-for="m in 5" :key="m">
          <div class="py-2" v-for="n in 5" :key="n">
            <span>[新闻]</span>
            <span>|</span>
            <span>这是标题</span>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },

    icon: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
</style>