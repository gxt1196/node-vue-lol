module.exports = app => {
    const router = require('express').Router()
    const mongoose = require('mongoose')
    // const News=require('../../models/Article')
    const Category = mongoose.model('Category')
    const Article = mongoose.model('Article')
    const Hero = mongoose.model('Hero')

    //导入新闻数据
    router.get('/news/init', async (req, res) => {
        const parent = await Category.findOne({
            name: '新闻分类'
        })
        const cats = await Category.find().where({
            parent: parent
        }).lean()
        const newsTitles = [
            "峡谷交响乐幕后故事揭秘（交响音乐会倒计时2天）", "皮肤爆料 | S18赛季皮肤提前曝光，竟然是ta！", "星元上新丨英雄齐换装，圣诞头饰、武器抢先看", "以数字之美探索文化 TGC腾讯数字文创节海南站即将开幕", "KPL限定皮肤爆料丨天狼星创始人，幕后老板即将登场", "12月11日全服不停机更新公告", "【修复中】圣诞礼盒活动异常问题处理公告", "12月10日全服不停机更新公告", "钟馗英雄技能音效异常说明公告", "【已修复】更新后无法进入游戏问题说明公告", "冰雪聚峡谷 轻松得好礼", "圣诞礼盒活动公告", "【感恩夸夸群】活动开启公告", "助力王者创意互动周 蔡文姬邀您演奏赢好礼", "王卡活动开启公告", "微赛事高校挑战赛开启，冲榜赢取永久史诗皮肤！", "双G再燃宿命之战！2019KPL秋季赛总决赛“一起上场一起赢”！", "王者模拟战冬季冠军杯邀请赛即将开战，版权平台&amp;外卡赛区选手大名单公布", "2019年KPL冬季预选赛战果揭晓，席位赛12月7日开战", "冬季冠军杯：KRKPL赛区出征，我们中国澳门见！"
        ]
        const newsList = newsTitles.map(title => {
            const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5)
            return {
                categories: randomCats.slice(0, 2),
                title: title
            }
        })
        await Article.deleteMany({})
        await Article.insertMany(newsList)
        res.send(newsList)
    })
    //新闻接口
    router.get('/news/list', async (req, res) => {
        const parent = await Category.findOne({
            name: '新闻分类'
        })
        const cats = await Category.aggregate([{
                $match: {
                    parent: parent._id
                }
            },
            {
                $lookup: {
                    from: 'articles',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'newsList'
                }
            },
            {
                $addFields: {
                    newsList: {
                        $slice: ['$newsList', 5]
                    }
                }
            }
        ])
        const subCats = cats.map(v => v._id)
        cats.unshift({
            name: '热门',
            newsList: await Article.find().where({
                categories: {
                    $in: subCats
                }
            }).populate('categories').limit(5).lean()
        })
        cats.map(cat => {
            cat.newsList.map(news => {
                news.categoryName = (cat.name === '热门') ? news.categories[0].name : cat.name
                return news
            })
            return cat
        })
        res.send(cats)
    })

    //导入英雄数据
    router.get('/heroes/init', async (req, res) => {
        await Hero.deleteMany({})
        const rawData = [{
                "heroId": "1",
                "name": "黑暗之女",
                "alias": "Annie",
                "title": "安妮",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "3",
                "magic": "10",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/1.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/1.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Annie.png"
            },
            {
                "heroId": "2",
                "name": "狂战士",
                "alias": "Olaf",
                "title": "奥拉夫",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "5",
                "magic": "3",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/2.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/2.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Olaf.png"
            },
            {
                "heroId": "3",
                "name": "正义巨像",
                "alias": "Galio",
                "title": "加里奥",
                "roles": [
                    "坦克",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "1",
                "defense": "10",
                "magic": "6",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/3.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/3.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Galio.png"
            },
            {
                "heroId": "4",
                "name": "卡牌大师",
                "alias": "TwistedFate",
                "title": "崔斯特",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "6",
                "defense": "2",
                "magic": "6",
                "difficulty": "9",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/4.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/4.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/TwistedFate.png"
            },
            {
                "heroId": "5",
                "name": "德邦总管",
                "alias": "XinZhao",
                "title": "赵信",
                "roles": [
                    "战士",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "6",
                "magic": "3",
                "difficulty": "2",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/5.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/5.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/XinZhao.png"
            },
            {
                "heroId": "6",
                "name": "无畏战车",
                "alias": "Urgot",
                "title": "厄加特",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "5",
                "magic": "3",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/6.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/6.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Urgot.png"
            },
            {
                "heroId": "7",
                "name": "诡术妖姬",
                "alias": "Leblanc",
                "title": "乐芙兰",
                "roles": [
                    "刺客",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "1",
                "defense": "4",
                "magic": "10",
                "difficulty": "9",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/7.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/7.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Leblanc.png"
            },
            {
                "heroId": "8",
                "name": "猩红收割者",
                "alias": "Vladimir",
                "title": "弗拉基米尔",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "6",
                "magic": "8",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/8.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/8.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Vladimir.png"
            },
            {
                "heroId": "9",
                "name": "末日使者",
                "alias": "FiddleSticks",
                "title": "费德提克",
                "roles": [
                    "法师",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "3",
                "magic": "9",
                "difficulty": "9",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/9.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/9.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/FiddleSticks.png"
            },
            {
                "heroId": "10",
                "name": "正义天使",
                "alias": "Kayle",
                "title": "凯尔",
                "roles": [
                    "战士",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "6",
                "defense": "6",
                "magic": "7",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/10.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/10.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Kayle.png"
            },
            {
                "heroId": "11",
                "name": "无极剑圣",
                "alias": "MasterYi",
                "title": "易",
                "roles": [
                    "刺客",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "10",
                "defense": "4",
                "magic": "2",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/11.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/11.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/MasterYi.png"
            },
            {
                "heroId": "12",
                "name": "牛头酋长",
                "alias": "Alistar",
                "title": "阿利斯塔",
                "roles": [
                    "坦克",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "6",
                "defense": "9",
                "magic": "5",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/12.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/12.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Alistar.png"
            },
            {
                "heroId": "13",
                "name": "符文法师",
                "alias": "Ryze",
                "title": "瑞兹",
                "roles": [
                    "法师",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "2",
                "magic": "10",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/13.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/13.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Ryze.png"
            },
            {
                "heroId": "14",
                "name": "亡灵战神",
                "alias": "Sion",
                "title": "赛恩",
                "roles": [
                    "坦克",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "5",
                "defense": "9",
                "magic": "3",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/14.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/14.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Sion.png"
            },
            {
                "heroId": "15",
                "name": "战争女神",
                "alias": "Sivir",
                "title": "希维尔",
                "roles": [
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "3",
                "magic": "1",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/15.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/15.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Sivir.png"
            },
            {
                "heroId": "16",
                "name": "众星之子",
                "alias": "Soraka",
                "title": "索拉卡",
                "roles": [
                    "辅助",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "5",
                "magic": "7",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/16.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/16.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Soraka.png"
            },
            {
                "heroId": "17",
                "name": "迅捷斥候",
                "alias": "Teemo",
                "title": "提莫",
                "roles": [
                    "射手",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "5",
                "defense": "3",
                "magic": "7",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/17.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/17.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Teemo.png"
            },
            {
                "heroId": "18",
                "name": "麦林炮手",
                "alias": "Tristana",
                "title": "崔丝塔娜",
                "roles": [
                    "射手",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "3",
                "magic": "5",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/18.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/18.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Tristana.png"
            },
            {
                "heroId": "19",
                "name": "祖安怒兽",
                "alias": "Warwick",
                "title": "沃里克",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "5",
                "magic": "3",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/19.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/19.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Warwick.png"
            },
            {
                "heroId": "20",
                "name": "雪原双子",
                "alias": "Nunu",
                "title": "努努和威朗普",
                "roles": [
                    "坦克",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "6",
                "magic": "7",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/20.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/20.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Nunu.png"
            },
            {
                "heroId": "21",
                "name": "赏金猎人",
                "alias": "MissFortune",
                "title": "厄运小姐",
                "roles": [
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "2",
                "magic": "5",
                "difficulty": "1",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/21.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/21.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/MissFortune.png"
            },
            {
                "heroId": "22",
                "name": "寒冰射手",
                "alias": "Ashe",
                "title": "艾希",
                "roles": [
                    "射手",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "3",
                "magic": "2",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/22.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/22.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Ashe.png"
            },
            {
                "heroId": "23",
                "name": "蛮族之王",
                "alias": "Tryndamere",
                "title": "泰达米尔",
                "roles": [
                    "战士",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "10",
                "defense": "5",
                "magic": "2",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/23.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/23.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Tryndamere.png"
            },
            {
                "heroId": "24",
                "name": "武器大师",
                "alias": "Jax",
                "title": "贾克斯",
                "roles": [
                    "战士",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "5",
                "magic": "7",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/24.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/24.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Jax.png"
            },
            {
                "heroId": "25",
                "name": "堕落天使",
                "alias": "Morgana",
                "title": "莫甘娜",
                "roles": [
                    "法师",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "1",
                "defense": "6",
                "magic": "8",
                "difficulty": "1",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/25.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/25.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Morgana.png"
            },
            {
                "heroId": "26",
                "name": "时光守护者",
                "alias": "Zilean",
                "title": "基兰",
                "roles": [
                    "辅助",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "5",
                "magic": "8",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/26.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/26.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Zilean.png"
            },
            {
                "heroId": "27",
                "name": "炼金术士",
                "alias": "Singed",
                "title": "辛吉德",
                "roles": [
                    "坦克",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "8",
                "magic": "7",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/27.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/27.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Singed.png"
            },
            {
                "heroId": "28",
                "name": "痛苦之拥",
                "alias": "Evelynn",
                "title": "伊芙琳",
                "roles": [
                    "刺客",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "2",
                "magic": "7",
                "difficulty": "10",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/28.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/28.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Evelynn.png"
            },
            {
                "heroId": "29",
                "name": "瘟疫之源",
                "alias": "Twitch",
                "title": "图奇",
                "roles": [
                    "射手",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "2",
                "magic": "3",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/29.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/29.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Twitch.png"
            },
            {
                "heroId": "30",
                "name": "死亡颂唱者",
                "alias": "Karthus",
                "title": "卡尔萨斯",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "2",
                "magic": "10",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/30.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/30.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Karthus.png"
            },
            {
                "heroId": "31",
                "name": "虚空恐惧",
                "alias": "Chogath",
                "title": "科加斯",
                "roles": [
                    "坦克",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "3",
                "defense": "7",
                "magic": "7",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/31.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/31.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Chogath.png"
            },
            {
                "heroId": "32",
                "name": "殇之木乃伊",
                "alias": "Amumu",
                "title": "阿木木",
                "roles": [
                    "坦克",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "6",
                "magic": "8",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/32.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/32.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Amumu.png"
            },
            {
                "heroId": "33",
                "name": "披甲龙龟",
                "alias": "Rammus",
                "title": "拉莫斯",
                "roles": [
                    "坦克",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "10",
                "magic": "5",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/33.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/33.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Rammus.png"
            },
            {
                "heroId": "34",
                "name": "冰晶凤凰",
                "alias": "Anivia",
                "title": "艾尼维亚",
                "roles": [
                    "法师",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "1",
                "defense": "4",
                "magic": "10",
                "difficulty": "10",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/34.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/34.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Anivia.png"
            },
            {
                "heroId": "35",
                "name": "恶魔小丑",
                "alias": "Shaco",
                "title": "萨科",
                "roles": [
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "4",
                "magic": "6",
                "difficulty": "9",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/35.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/35.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Shaco.png"
            },
            {
                "heroId": "36",
                "name": "祖安狂人",
                "alias": "DrMundo",
                "title": "蒙多医生",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "5",
                "defense": "7",
                "magic": "6",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/36.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/36.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/DrMundo.png"
            },
            {
                "heroId": "37",
                "name": "琴瑟仙女",
                "alias": "Sona",
                "title": "娑娜",
                "roles": [
                    "辅助",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "5",
                "defense": "2",
                "magic": "8",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/37.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/37.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Sona.png"
            },
            {
                "heroId": "38",
                "name": "虚空行者",
                "alias": "Kassadin",
                "title": "卡萨丁",
                "roles": [
                    "刺客",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "3",
                "defense": "5",
                "magic": "8",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/38.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/38.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Kassadin.png"
            },
            {
                "heroId": "39",
                "name": "刀锋舞者",
                "alias": "Irelia",
                "title": "艾瑞莉娅",
                "roles": [
                    "战士",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "4",
                "magic": "5",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/39.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/39.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Irelia.png"
            },
            {
                "heroId": "40",
                "name": "风暴之怒",
                "alias": "Janna",
                "title": "迦娜",
                "roles": [
                    "辅助",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "3",
                "defense": "5",
                "magic": "7",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/40.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/40.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Janna.png"
            },
            {
                "heroId": "41",
                "name": "海洋之灾",
                "alias": "Gangplank",
                "title": "普朗克",
                "roles": [
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "6",
                "magic": "4",
                "difficulty": "9",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/41.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/41.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Gangplank.png"
            },
            {
                "heroId": "42",
                "name": "英勇投弹手",
                "alias": "Corki",
                "title": "库奇",
                "roles": [
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "3",
                "magic": "6",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/42.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/42.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Corki.png"
            },
            {
                "heroId": "43",
                "name": "天启者",
                "alias": "Karma",
                "title": "卡尔玛",
                "roles": [
                    "法师",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "1",
                "defense": "7",
                "magic": "8",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/43.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/43.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Karma.png"
            },
            {
                "heroId": "44",
                "name": "瓦洛兰之盾",
                "alias": "Taric",
                "title": "塔里克",
                "roles": [
                    "辅助",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "8",
                "magic": "5",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/44.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/44.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Taric.png"
            },
            {
                "heroId": "45",
                "name": "邪恶小法师",
                "alias": "Veigar",
                "title": "维迦",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "2",
                "magic": "10",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/45.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/45.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Veigar.png"
            },
            {
                "heroId": "48",
                "name": "巨魔之王",
                "alias": "Trundle",
                "title": "特朗德尔",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "6",
                "magic": "2",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/48.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/48.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Trundle.png"
            },
            {
                "heroId": "50",
                "name": "诺克萨斯统领",
                "alias": "Swain",
                "title": "斯维因",
                "roles": [
                    "法师",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "6",
                "magic": "9",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/50.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/50.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Swain.png"
            },
            {
                "heroId": "51",
                "name": "皮城女警",
                "alias": "Caitlyn",
                "title": "凯特琳",
                "roles": [
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "2",
                "magic": "2",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/51.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/51.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Caitlyn.png"
            },
            {
                "heroId": "53",
                "name": "蒸汽机器人",
                "alias": "Blitzcrank",
                "title": "布里茨",
                "roles": [
                    "坦克",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "8",
                "magic": "5",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/53.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/53.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Blitzcrank.png"
            },
            {
                "heroId": "54",
                "name": "熔岩巨兽",
                "alias": "Malphite",
                "title": "墨菲特",
                "roles": [
                    "坦克",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "5",
                "defense": "9",
                "magic": "7",
                "difficulty": "2",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/54.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/54.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Malphite.png"
            },
            {
                "heroId": "55",
                "name": "不祥之刃",
                "alias": "Katarina",
                "title": "卡特琳娜",
                "roles": [
                    "刺客",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "3",
                "magic": "9",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/55.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/55.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Katarina.png"
            },
            {
                "heroId": "56",
                "name": "永恒梦魇",
                "alias": "Nocturne",
                "title": "魔腾",
                "roles": [
                    "刺客",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "5",
                "magic": "2",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/56.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/56.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Nocturne.png"
            },
            {
                "heroId": "57",
                "name": "扭曲树精",
                "alias": "Maokai",
                "title": "茂凯",
                "roles": [
                    "坦克",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "3",
                "defense": "8",
                "magic": "6",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/57.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/57.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Maokai.png"
            },
            {
                "heroId": "58",
                "name": "荒漠屠夫",
                "alias": "Renekton",
                "title": "雷克顿",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "5",
                "magic": "2",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/58.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/58.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Renekton.png"
            },
            {
                "heroId": "59",
                "name": "德玛西亚皇子",
                "alias": "JarvanIV",
                "title": "嘉文四世",
                "roles": [
                    "坦克",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "6",
                "defense": "8",
                "magic": "3",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/59.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/59.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/JarvanIV.png"
            },
            {
                "heroId": "60",
                "name": "蜘蛛女皇",
                "alias": "Elise",
                "title": "伊莉丝",
                "roles": [
                    "法师",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "6",
                "defense": "5",
                "magic": "7",
                "difficulty": "9",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/60.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/60.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Elise.png"
            },
            {
                "heroId": "61",
                "name": "发条魔灵",
                "alias": "Orianna",
                "title": "奥莉安娜",
                "roles": [
                    "法师",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "3",
                "magic": "9",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/61.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/61.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Orianna.png"
            },
            {
                "heroId": "62",
                "name": "齐天大圣",
                "alias": "MonkeyKing",
                "title": "孙悟空",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "5",
                "magic": "2",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/62.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/62.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/MonkeyKing.png"
            },
            {
                "heroId": "63",
                "name": "复仇焰魂",
                "alias": "Brand",
                "title": "布兰德",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "2",
                "magic": "9",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/63.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/63.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Brand.png"
            },
            {
                "heroId": "64",
                "name": "盲僧",
                "alias": "LeeSin",
                "title": "李青",
                "roles": [
                    "战士",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "5",
                "magic": "3",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/64.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/64.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/LeeSin.png"
            },
            {
                "heroId": "67",
                "name": "暗夜猎手",
                "alias": "Vayne",
                "title": "薇恩",
                "roles": [
                    "射手",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "10",
                "defense": "1",
                "magic": "1",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/67.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/67.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Vayne.png"
            },
            {
                "heroId": "68",
                "name": "机械公敌",
                "alias": "Rumble",
                "title": "兰博",
                "roles": [
                    "战士",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "3",
                "defense": "6",
                "magic": "8",
                "difficulty": "10",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/68.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/68.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Rumble.png"
            },
            {
                "heroId": "69",
                "name": "魔蛇之拥",
                "alias": "Cassiopeia",
                "title": "卡西奥佩娅",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "3",
                "magic": "9",
                "difficulty": "10",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/69.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/69.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Cassiopeia.png"
            },
            {
                "heroId": "72",
                "name": "水晶先锋",
                "alias": "Skarner",
                "title": "斯卡纳",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "6",
                "magic": "5",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/72.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/72.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Skarner.png"
            },
            {
                "heroId": "74",
                "name": "大发明家",
                "alias": "Heimerdinger",
                "title": "黑默丁格",
                "roles": [
                    "法师",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "6",
                "magic": "8",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/74.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/74.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Heimerdinger.png"
            },
            {
                "heroId": "75",
                "name": "沙漠死神",
                "alias": "Nasus",
                "title": "内瑟斯",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "5",
                "magic": "6",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/75.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/75.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Nasus.png"
            },
            {
                "heroId": "76",
                "name": "狂野女猎手",
                "alias": "Nidalee",
                "title": "奈德丽",
                "roles": [
                    "刺客",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "5",
                "defense": "4",
                "magic": "7",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/76.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/76.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Nidalee.png"
            },
            {
                "heroId": "77",
                "name": "兽灵行者",
                "alias": "Udyr",
                "title": "乌迪尔",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "7",
                "magic": "4",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/77.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/77.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Udyr.png"
            },
            {
                "heroId": "78",
                "name": "圣锤之毅",
                "alias": "Poppy",
                "title": "波比",
                "roles": [
                    "坦克",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "6",
                "defense": "7",
                "magic": "2",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/78.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/78.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Poppy.png"
            },
            {
                "heroId": "79",
                "name": "酒桶",
                "alias": "Gragas",
                "title": "古拉加斯",
                "roles": [
                    "战士",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "7",
                "magic": "6",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/79.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/79.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Gragas.png"
            },
            {
                "heroId": "80",
                "name": "不屈之枪",
                "alias": "Pantheon",
                "title": "潘森",
                "roles": [
                    "战士",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "4",
                "magic": "3",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/80.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/80.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Pantheon.png"
            },
            {
                "heroId": "81",
                "name": "探险家",
                "alias": "Ezreal",
                "title": "伊泽瑞尔",
                "roles": [
                    "射手",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "2",
                "magic": "6",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/81.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/81.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Ezreal.png"
            },
            {
                "heroId": "82",
                "name": "铁铠冥魂",
                "alias": "Mordekaiser",
                "title": "莫德凯撒",
                "roles": [
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "6",
                "magic": "7",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/82.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/82.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Mordekaiser.png"
            },
            {
                "heroId": "83",
                "name": "牧魂人",
                "alias": "Yorick",
                "title": "约里克",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "6",
                "defense": "6",
                "magic": "4",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/83.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/83.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Yorick.png"
            },
            {
                "heroId": "84",
                "name": "离群之刺",
                "alias": "Akali",
                "title": "阿卡丽",
                "roles": [
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "5",
                "defense": "3",
                "magic": "8",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/84.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/84.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Akali.png"
            },
            {
                "heroId": "85",
                "name": "狂暴之心",
                "alias": "Kennen",
                "title": "凯南",
                "roles": [
                    "法师",
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "6",
                "defense": "4",
                "magic": "7",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/85.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/85.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Kennen.png"
            },
            {
                "heroId": "86",
                "name": "德玛西亚之力",
                "alias": "Garen",
                "title": "盖伦",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "7",
                "magic": "1",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/86.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/86.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Garen.png"
            },
            {
                "heroId": "89",
                "name": "曙光女神",
                "alias": "Leona",
                "title": "蕾欧娜",
                "roles": [
                    "坦克",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "8",
                "magic": "3",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/89.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/89.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Leona.png"
            },
            {
                "heroId": "90",
                "name": "虚空先知",
                "alias": "Malzahar",
                "title": "玛尔扎哈",
                "roles": [
                    "法师",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "2",
                "magic": "9",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/90.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/90.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Malzahar.png"
            },
            {
                "heroId": "91",
                "name": "刀锋之影",
                "alias": "Talon",
                "title": "泰隆",
                "roles": [
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "3",
                "magic": "1",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/91.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/91.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Talon.png"
            },
            {
                "heroId": "92",
                "name": "放逐之刃",
                "alias": "Riven",
                "title": "锐雯",
                "roles": [
                    "战士",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "5",
                "magic": "1",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/92.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/92.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Riven.png"
            },
            {
                "heroId": "96",
                "name": "深渊巨口",
                "alias": "KogMaw",
                "title": "克格莫",
                "roles": [
                    "射手",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "2",
                "magic": "5",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/96.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/96.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/KogMaw.png"
            },
            {
                "heroId": "98",
                "name": "暮光之眼",
                "alias": "Shen",
                "title": "慎",
                "roles": [
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "3",
                "defense": "9",
                "magic": "3",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/98.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/98.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Shen.png"
            },
            {
                "heroId": "99",
                "name": "光辉女郎",
                "alias": "Lux",
                "title": "拉克丝",
                "roles": [
                    "法师",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "4",
                "magic": "9",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/99.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/99.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Lux.png"
            },
            {
                "heroId": "101",
                "name": "远古巫灵",
                "alias": "Xerath",
                "title": "泽拉斯",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "1",
                "defense": "3",
                "magic": "10",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/101.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/101.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Xerath.png"
            },
            {
                "heroId": "102",
                "name": "龙血武姬",
                "alias": "Shyvana",
                "title": "希瓦娜",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "6",
                "magic": "3",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/102.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/102.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Shyvana.png"
            },
            {
                "heroId": "103",
                "name": "九尾妖狐",
                "alias": "Ahri",
                "title": "阿狸",
                "roles": [
                    "法师",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "3",
                "defense": "4",
                "magic": "8",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/103.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/103.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Ahri.png"
            },
            {
                "heroId": "104",
                "name": "法外狂徒",
                "alias": "Graves",
                "title": "格雷福斯",
                "roles": [
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "5",
                "magic": "3",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/104.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/104.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Graves.png"
            },
            {
                "heroId": "105",
                "name": "潮汐海灵",
                "alias": "Fizz",
                "title": "菲兹",
                "roles": [
                    "刺客",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "6",
                "defense": "4",
                "magic": "7",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/105.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/105.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Fizz.png"
            },
            {
                "heroId": "106",
                "name": "雷霆咆哮",
                "alias": "Volibear",
                "title": "沃利贝尔",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "7",
                "magic": "4",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/106.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/106.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Volibear.png"
            },
            {
                "heroId": "107",
                "name": "傲之追猎者",
                "alias": "Rengar",
                "title": "雷恩加尔",
                "roles": [
                    "刺客",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "4",
                "magic": "2",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/107.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/107.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Rengar.png"
            },
            {
                "heroId": "110",
                "name": "惩戒之箭",
                "alias": "Varus",
                "title": "韦鲁斯",
                "roles": [
                    "射手",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "3",
                "magic": "4",
                "difficulty": "2",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/110.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/110.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Varus.png"
            },
            {
                "heroId": "111",
                "name": "深海泰坦",
                "alias": "Nautilus",
                "title": "诺提勒斯",
                "roles": [
                    "坦克",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "6",
                "magic": "6",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/111.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/111.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Nautilus.png"
            },
            {
                "heroId": "112",
                "name": "机械先驱",
                "alias": "Viktor",
                "title": "维克托",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "4",
                "magic": "10",
                "difficulty": "9",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/112.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/112.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Viktor.png"
            },
            {
                "heroId": "113",
                "name": "北地之怒",
                "alias": "Sejuani",
                "title": "瑟庄妮",
                "roles": [
                    "坦克",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "5",
                "defense": "7",
                "magic": "6",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/113.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/113.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Sejuani.png"
            },
            {
                "heroId": "114",
                "name": "无双剑姬",
                "alias": "Fiora",
                "title": "菲奥娜",
                "roles": [
                    "战士",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "10",
                "defense": "4",
                "magic": "2",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/114.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/114.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Fiora.png"
            },
            {
                "heroId": "115",
                "name": "爆破鬼才",
                "alias": "Ziggs",
                "title": "吉格斯",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "4",
                "magic": "9",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/115.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/115.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Ziggs.png"
            },
            {
                "heroId": "117",
                "name": "仙灵女巫",
                "alias": "Lulu",
                "title": "璐璐",
                "roles": [
                    "辅助",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "5",
                "magic": "7",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/117.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/117.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Lulu.png"
            },
            {
                "heroId": "119",
                "name": "荣耀行刑官",
                "alias": "Draven",
                "title": "德莱文",
                "roles": [
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "3",
                "magic": "1",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/119.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/119.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Draven.png"
            },
            {
                "heroId": "120",
                "name": "战争之影",
                "alias": "Hecarim",
                "title": "赫卡里姆",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "6",
                "magic": "4",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/120.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/120.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Hecarim.png"
            },
            {
                "heroId": "121",
                "name": "虚空掠夺者",
                "alias": "Khazix",
                "title": "卡兹克",
                "roles": [
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "4",
                "magic": "3",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/121.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/121.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Khazix.png"
            },
            {
                "heroId": "122",
                "name": "诺克萨斯之手",
                "alias": "Darius",
                "title": "德莱厄斯",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "5",
                "magic": "1",
                "difficulty": "2",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/122.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/122.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Darius.png"
            },
            {
                "heroId": "126",
                "name": "未来守护者",
                "alias": "Jayce",
                "title": "杰斯",
                "roles": [
                    "战士",
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "4",
                "magic": "3",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/126.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/126.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Jayce.png"
            },
            {
                "heroId": "127",
                "name": "冰霜女巫",
                "alias": "Lissandra",
                "title": "丽桑卓",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "5",
                "magic": "8",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/127.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/127.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Lissandra.png"
            },
            {
                "heroId": "131",
                "name": "皎月女神",
                "alias": "Diana",
                "title": "黛安娜",
                "roles": [
                    "战士",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "6",
                "magic": "8",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/131.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/131.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Diana.png"
            },
            {
                "heroId": "133",
                "name": "德玛西亚之翼",
                "alias": "Quinn",
                "title": "奎因",
                "roles": [
                    "射手",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "4",
                "magic": "2",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/133.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/133.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Quinn.png"
            },
            {
                "heroId": "134",
                "name": "暗黑元首",
                "alias": "Syndra",
                "title": "辛德拉",
                "roles": [
                    "法师",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "3",
                "magic": "9",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/134.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/134.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Syndra.png"
            },
            {
                "heroId": "136",
                "name": "铸星龙王",
                "alias": "AurelionSol",
                "title": "奥瑞利安·索尔",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "3",
                "magic": "8",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/136.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/136.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/AurelionSol.png"
            },
            {
                "heroId": "141",
                "name": "影流之镰",
                "alias": "Kayn",
                "title": "凯隐",
                "roles": [
                    "战士",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "10",
                "defense": "6",
                "magic": "1",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/141.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/141.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Kayn.png"
            },
            {
                "heroId": "142",
                "name": "暮光星灵",
                "alias": "Zoe",
                "title": "佐伊",
                "roles": [
                    "法师",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "1",
                "defense": "7",
                "magic": "8",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/142.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/142.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Zoe.png"
            },
            {
                "heroId": "143",
                "name": "荆棘之兴",
                "alias": "Zyra",
                "title": "婕拉",
                "roles": [
                    "法师",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "3",
                "magic": "8",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/143.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/143.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Zyra.png"
            },
            {
                "heroId": "145",
                "name": "虚空之女",
                "alias": "Kaisa",
                "title": "卡莎",
                "roles": [
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "5",
                "magic": "3",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/145.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/145.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Kaisa.png"
            },
            {
                "heroId": "150",
                "name": "迷失之牙",
                "alias": "Gnar",
                "title": "纳尔",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "6",
                "defense": "5",
                "magic": "5",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/150.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/150.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Gnar.png"
            },
            {
                "heroId": "154",
                "name": "生化魔人",
                "alias": "Zac",
                "title": "扎克",
                "roles": [
                    "坦克",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "3",
                "defense": "7",
                "magic": "7",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/154.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/154.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Zac.png"
            },
            {
                "heroId": "157",
                "name": "疾风剑豪",
                "alias": "Yasuo",
                "title": "亚索",
                "roles": [
                    "战士",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "4",
                "magic": "4",
                "difficulty": "10",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/157.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/157.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Yasuo.png"
            },
            {
                "heroId": "161",
                "name": "虚空之眼",
                "alias": "Velkoz",
                "title": "维克兹",
                "roles": [
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "2",
                "magic": "10",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/161.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/161.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Velkoz.png"
            },
            {
                "heroId": "163",
                "name": "岩雀",
                "alias": "Taliyah",
                "title": "塔莉垭",
                "roles": [
                    "法师",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "1",
                "defense": "7",
                "magic": "8",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/163.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/163.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Taliyah.png"
            },
            {
                "heroId": "164",
                "name": "青钢影",
                "alias": "Camille",
                "title": "卡蜜尔",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "6",
                "magic": "3",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/164.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/164.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Camille.png"
            },
            {
                "heroId": "201",
                "name": "弗雷尔卓德之心",
                "alias": "Braum",
                "title": "布隆",
                "roles": [
                    "辅助",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "3",
                "defense": "9",
                "magic": "4",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/201.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/201.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Braum.png"
            },
            {
                "heroId": "202",
                "name": "戏命师",
                "alias": "Jhin",
                "title": "烬",
                "roles": [
                    "射手",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "10",
                "defense": "2",
                "magic": "6",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/202.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/202.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Jhin.png"
            },
            {
                "heroId": "203",
                "name": "永猎双子",
                "alias": "Kindred",
                "title": "千珏",
                "roles": [
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "2",
                "magic": "2",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/203.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/203.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Kindred.png"
            },
            {
                "heroId": "222",
                "name": "暴走萝莉",
                "alias": "Jinx",
                "title": "金克丝",
                "roles": [
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "2",
                "magic": "4",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/222.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/222.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Jinx.png"
            },
            {
                "heroId": "223",
                "name": "河流之王",
                "alias": "TahmKench",
                "title": "塔姆",
                "roles": [
                    "辅助",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "3",
                "defense": "9",
                "magic": "6",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/223.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/223.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/TahmKench.png"
            },
            {
                "heroId": "235",
                "name": "涤魂圣枪",
                "alias": "Senna",
                "title": "赛娜",
                "roles": [
                    "射手",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "7",
                "defense": "2",
                "magic": "6",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/235.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/235.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Senna.png"
            },
            {
                "heroId": "236",
                "name": "圣枪游侠",
                "alias": "Lucian",
                "title": "卢锡安",
                "roles": [
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "5",
                "magic": "3",
                "difficulty": "6",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/236.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/236.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Lucian.png"
            },
            {
                "heroId": "238",
                "name": "影流之主",
                "alias": "Zed",
                "title": "劫",
                "roles": [
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "2",
                "magic": "1",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/238.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/238.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Zed.png"
            },
            {
                "heroId": "240",
                "name": "暴怒骑士",
                "alias": "Kled",
                "title": "克烈",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "2",
                "magic": "2",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/240.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/240.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Kled.png"
            },
            {
                "heroId": "245",
                "name": "时间刺客",
                "alias": "Ekko",
                "title": "艾克",
                "roles": [
                    "刺客",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "5",
                "defense": "3",
                "magic": "7",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/245.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/245.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Ekko.png"
            },
            {
                "heroId": "246",
                "name": "元素女皇",
                "alias": "Qiyana",
                "title": "奇亚娜",
                "roles": [
                    "刺客",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "0",
                "defense": "2",
                "magic": "4",
                "difficulty": "8",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/246.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/246.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Qiyana.png"
            },
            {
                "heroId": "254",
                "name": "皮城执法官",
                "alias": "Vi",
                "title": "蔚",
                "roles": [
                    "战士",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "5",
                "magic": "3",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/254.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/254.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Vi.png"
            },
            {
                "heroId": "266",
                "name": "暗裔剑魔",
                "alias": "Aatrox",
                "title": "亚托克斯",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "4",
                "magic": "3",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/266.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/266.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Aatrox.png"
            },
            {
                "heroId": "267",
                "name": "唤潮鲛姬",
                "alias": "Nami",
                "title": "娜美",
                "roles": [
                    "辅助",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "3",
                "magic": "7",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/267.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/267.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Nami.png"
            },
            {
                "heroId": "268",
                "name": "沙漠皇帝",
                "alias": "Azir",
                "title": "阿兹尔",
                "roles": [
                    "法师",
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "6",
                "defense": "3",
                "magic": "8",
                "difficulty": "9",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/268.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/268.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Azir.png"
            },
            {
                "heroId": "350",
                "name": "魔法猫咪",
                "alias": "Yuumi",
                "title": "悠米",
                "roles": [
                    "辅助",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "5",
                "defense": "1",
                "magic": "8",
                "difficulty": "2",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/350.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/350.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Yuumi.png"
            },
            {
                "heroId": "412",
                "name": "魂锁典狱长",
                "alias": "Thresh",
                "title": "锤石",
                "roles": [
                    "辅助",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "5",
                "defense": "6",
                "magic": "6",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/412.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/412.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Thresh.png"
            },
            {
                "heroId": "420",
                "name": "海兽祭司",
                "alias": "Illaoi",
                "title": "俄洛伊",
                "roles": [
                    "战士",
                    "坦克"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "6",
                "magic": "3",
                "difficulty": "4",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/420.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/420.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Illaoi.png"
            },
            {
                "heroId": "421",
                "name": "虚空遁地兽",
                "alias": "RekSai",
                "title": "雷克塞",
                "roles": [
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "5",
                "magic": "2",
                "difficulty": "3",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/421.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/421.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/RekSai.png"
            },
            {
                "heroId": "427",
                "name": "翠神",
                "alias": "Ivern",
                "title": "艾翁",
                "roles": [
                    "辅助",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "3",
                "defense": "5",
                "magic": "7",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/427.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/427.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Ivern.png"
            },
            {
                "heroId": "429",
                "name": "复仇之矛",
                "alias": "Kalista",
                "title": "卡莉丝塔",
                "roles": [
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "8",
                "defense": "2",
                "magic": "4",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/429.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/429.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Kalista.png"
            },
            {
                "heroId": "432",
                "name": "星界游神",
                "alias": "Bard",
                "title": "巴德",
                "roles": [
                    "辅助",
                    "法师"
                ],
                "isWeekFree": "0",
                "attack": "4",
                "defense": "4",
                "magic": "5",
                "difficulty": "9",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/432.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/432.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Bard.png"
            },
            {
                "heroId": "497",
                "name": "幻翎",
                "alias": "Rakan",
                "title": "洛",
                "roles": [
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "2",
                "defense": "4",
                "magic": "8",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/497.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/497.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Rakan.png"
            },
            {
                "heroId": "498",
                "name": "逆羽",
                "alias": "Xayah",
                "title": "霞",
                "roles": [
                    "射手"
                ],
                "isWeekFree": "0",
                "attack": "10",
                "defense": "6",
                "magic": "1",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/498.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/498.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Xayah.png"
            },
            {
                "heroId": "516",
                "name": "山隐之焰",
                "alias": "Ornn",
                "title": "奥恩",
                "roles": [
                    "坦克",
                    "战士"
                ],
                "isWeekFree": "0",
                "attack": "5",
                "defense": "9",
                "magic": "3",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/516.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/516.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Ornn.png"
            },
            {
                "heroId": "517",
                "name": "解脱者",
                "alias": "Sylas",
                "title": "塞拉斯",
                "roles": [
                    "法师",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "3",
                "defense": "4",
                "magic": "8",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/517.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/517.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Sylas.png"
            },
            {
                "heroId": "518",
                "name": "万花通灵",
                "alias": "Neeko",
                "title": "妮蔻",
                "roles": [
                    "法师",
                    "辅助"
                ],
                "isWeekFree": "0",
                "attack": "1",
                "defense": "1",
                "magic": "9",
                "difficulty": "5",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/518.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/518.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Neeko.png"
            },
            {
                "heroId": "555",
                "name": "血港鬼影",
                "alias": "Pyke",
                "title": "派克",
                "roles": [
                    "辅助",
                    "刺客"
                ],
                "isWeekFree": "0",
                "attack": "9",
                "defense": "3",
                "magic": "1",
                "difficulty": "7",
                "selectAudio": "https://game.gtimg.cn/images/lol/act/img/vo/choose/555.ogg",
                "banAudio": "https://game.gtimg.cn/images/lol/act/img/vo/ban/555.ogg",
                "avatar": "https://game.gtimg.cn/images/lol/act/img/champion/Pyke.png"
            }
        ]
        for (cat of rawData) {
            cat.scores = {
                    attack: {
                        type: Number
                    },
                    magic: {
                        type: Number
                    },
                    defense: {
                        type: Number
                    },
                    difficult: {
                        type: Number
                    },
                },
                cat.scores.difficult = cat.difficulty
            cat.scores.attack = cat.attack
            cat.scores.defense = cat.defense
            cat.scores.magic = cat.magic

            const category = await Category.find({
                name: cat.roles
            })

            cat.categories = category
            await Hero.insertMany(cat)

        }
        res.send(await Hero.find())
    })
    //英雄列表接口
    router.get('/heroes/list',async(req,res)=>{
        const parent=await Category.findOne({
            name:'英雄分类'
        })

        const cats=await Category.aggregate([
            {
                $match:{
                    parent:parent._id
                }
            },
            {
                $lookup:{
                    from :'heroes',
                    localField:'_id',
                    foreignField:'categories',
                    as:'heroList'
                }
            }
        ])

        const subCats = cats.map(v => v._id)
        cats.unshift({
            name: '热门',
            heroList: await Hero.find().where({
                categories: {
                    $in: subCats
                }
            }).limit(10).lean()
        })
        res.send(cats)

    })

    //文章详情
    router.get('/articles/:id',async(req,res)=>{
        const  data= await Article.findById(req.params.id)
        res.send(data)
    })




    app.use('/web/api', router)
}