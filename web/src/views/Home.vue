<template>
  <div>
    <swiper :options="swiperOption">
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/8bd456d23cbfaecec54e604dc4432c74.jpeg"
        /> </swiper-slide
      ><swiper-slide>
        <img
          class="w-100"
          src="../assets/images/8db79c73d28b468ea13c065973534c18.jpeg"
        /> </swiper-slide
      ><swiper-slide>
        <img
          class="w-100"
          src="../assets/images/605a0a647fc37364032a404b4281884d.jpeg"
        />
      </swiper-slide>
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/be3e76d5f1665559c6c4b3c9d23fa13d.jpeg"
        />
      </swiper-slide>
      <swiper-slide>
        <img
          class="w-100"
          src="../assets/images/dbf77f60688a97e981e88170a6250be6.jpeg"
        />
      </swiper-slide>
      <div
        class="swiper-pagination pagination-home text-right"
        slot="pagination"
      ></div>
    </swiper>
  </div>
</template>

<script>
export default {
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".pagination-home"
        }
      },
      swiperSlides: [1, 2, 3, 4, 5]
    };
  }
};
</script>

<style lang="scss">
@import "../style.scss";
.pagination-home {
  .swiper-pagination-bullet {
    background: #fff;
    &.swiper-pagination-bullet-active {
      background: ;
    }
  }
}
</style>
