<template>
  <div>
    <swiper :options="swiperOption">
      <swiper-slide>
        <img class="w-100" src="../assets/images/8bd456d23cbfaecec54e604dc4432c74.jpeg" />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/8db79c73d28b468ea13c065973534c18.jpeg" />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/605a0a647fc37364032a404b4281884d.jpeg" />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/be3e76d5f1665559c6c4b3c9d23fa13d.jpeg" />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/dbf77f60688a97e981e88170a6250be6.jpeg" />
      </swiper-slide>
      <div class="swiper-pagination pagination-home text-right px-3 pb-2" slot="pagination"></div>
    </swiper>
    <!-- end of swiper -->
    <div class="nav-icons bg-white mt-3 text-center pt-3 text-dark-1">
      <div class="d-flex flex-wrap">
        <div class="nav-item mb-3" v-for="(item, i) in items" :key="i">
          <i class="sprite" :class="item.class"></i>
          <div class="py-2">{{ item.name }}</div>
        </div>
      </div>
      <div class="bg-light py-2 fs-sm d-flex ai-center jc-center">
        <i class="sprite sprite-arrow mr-1"></i>
        收起
      </div>
    </div>
    <!-- end of nav icons  -->
    <m-list-card icon="menu" title="新闻资讯" :categories="newsCats">
      <template #items="{category}">
        <router-link tag="div"
        :to="`/articles/${news._id}`"
         class="py-2 fs-lg d-flex" v-for="(news,i) in category.newsList" :key="i">
          <span class="text-info">[{{news.categoryName}}]</span>
          <span class="px-2">|</span>
          <span class="flex-1 text-dark-1 text-ellipsis pr-2">{{news.title}}</span>
          <span class="text-grey-1 fs-sm">{{news.createdAt |date}}</span>
        </router-link >
      </template>
    </m-list-card>

    <m-list-card icon="card-hero" title="英雄列表" :categories="heroCats">
      <template #items="{category}">
        <div class="d-flex flex-wrap" style="margin:0 -0.5rem">
              <div class="p-3 text-center" style="width:20%" v-for="(hero,i) in category.heroList" :key="i">
             <img :src="hero.avatar" class="w-100" >
             <div>{{hero.name}}</div>
        </div>
        </div>
      </template>
    </m-list-card>
      <m-list-card icon="menu" title="新闻资讯" :categories="newsCats">
 
   
    </m-list-card>
      <m-list-card icon="menu" title="新闻资讯" :categories="newsCats">
 

    </m-list-card>
  </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
  filters:{
  date(val){
      return dayjs(val).format('MM/DD')
     }
    },
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".pagination-home"
        },
        loop: true,
        autoplay: true, //可设置数值来指定播放速度
        speed: 400 // 切换图片速度
      },
      items: [
        { name: "爆料站", class: "sprite-news" },
        { name: "故事站", class: "sprite-story" },
        { name: "周边商城", class: "sprite-shopping" },
        { name: "体验服", class: "sprite-experience" },
        { name: "新人专区", class: "sprite-newcomer" },
        { name: "荣耀传承", class: "sprite-glory" },
        { name: "同人社区", class: "sprite-community" },
        { name: "王者营地", class: "sprite-base" },
        { name: "公众号", class: "sprite-public" },
        { name: "版本介绍", class: "sprite-version" }
      ],newsCats:[],
      heroCats:[]
    }
    
  },
  created(){
   this.fetchNewsCats(),
   this.fetchHeroCats()
  },
  methods:{
    async fetchNewsCats(){
       const res =await this.$http.get('/news/list');
       this.newsCats=res.data
    },
      async fetchHeroCats(){
       const res =await this.$http.get('/heroes/list');
       this.heroCats=res.data
    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/variables";
.pagination-home {
  .swiper-pagination-bullet {
    opacity: 1;
    border-radius: 0.1538rem;
    background: map-get($colors, "white");
    &.swiper-pagination-bullet-active {
      background: map-get($colors, "info");
    }
  }
}
.nav-icons {
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  .nav-item {
    width: 25%;
    border-right: 1px solid $border-color;
    &:nth-child(4n) {
      border-right: none;
    }
  }
}
</style>
