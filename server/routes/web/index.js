module.exports=app=>{
    const router =require('express').Router()
    const mongoose=require('mongoose')
    // const News=require('../../models/Article')
    const Category =mongoose.model('Category')
    const Article =mongoose.model('Article')

    //导入新闻数据
    router.get('/news/init',async (req,res)=>{
        const parent=await Category.findOne({
            name:'新闻分类'
        })
        const cats=await Category.find().where({
            parent:parent
        }).lean()
        const newsTitles=[
            "峡谷交响乐幕后故事揭秘（交响音乐会倒计时2天）", "皮肤爆料 | S18赛季皮肤提前曝光，竟然是ta！", "星元上新丨英雄齐换装，圣诞头饰、武器抢先看", "以数字之美探索文化 TGC腾讯数字文创节海南站即将开幕", "KPL限定皮肤爆料丨天狼星创始人，幕后老板即将登场", "12月11日全服不停机更新公告", "【修复中】圣诞礼盒活动异常问题处理公告", "12月10日全服不停机更新公告", "钟馗英雄技能音效异常说明公告", "【已修复】更新后无法进入游戏问题说明公告", "冰雪聚峡谷 轻松得好礼", "圣诞礼盒活动公告", "【感恩夸夸群】活动开启公告", "助力王者创意互动周 蔡文姬邀您演奏赢好礼", "王卡活动开启公告", "微赛事高校挑战赛开启，冲榜赢取永久史诗皮肤！", "双G再燃宿命之战！2019KPL秋季赛总决赛“一起上场一起赢”！", "王者模拟战冬季冠军杯邀请赛即将开战，版权平台&amp;外卡赛区选手大名单公布", "2019年KPL冬季预选赛战果揭晓，席位赛12月7日开战", "冬季冠军杯：KRKPL赛区出征，我们中国澳门见！"
        ]
       const newsList=newsTitles.map(title=>{
           const randomCats=cats.slice(0).sort((a,b)=>Math.random()-0.5)
           return{
               categories:randomCats.slice(0,2),
               title:title
           }
       })
       await Article.deleteMany({})
       await Article.insertMany(newsList)
       res.send(newsList)
    })
    //新闻接口
    router.get('/news/list',async(req,res)=>{
        const parent =await Category.findOne({
            name:'新闻分类'
        })
        const cats=await Category.aggregate([
            {
              $match:{
                  parent:parent._id
              }  
            },
            {
                $lookup:{
                    from:'articles',
                    localField:'_id',
                    foreignField:'categories',
                    as:'newsList'
                }
            },
            {
                $addFields:{
                    newsList:{
                        $slice:['$newsList',5]
                    }
                }
            }
        ])
        const subCats= cats.map(v=>v._id)
        cats.unshift({
            name:'热门',
            newsList:await Article.find().where({
                categories:{
                    $in:subCats
                }
            }).populate('categories').limit(5).lean()
        })
        cats.map(cat=>{
            cat.newsList.map(news=>{
                news.categoryName=(cat.name ==='热门')? news.categories[0].name :cat.name
                return news
            })
            return cat
        })
        res.send(cats)
    })

    //导入英雄数据
    

    app.use('/web/api',router)
}