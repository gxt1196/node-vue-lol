 const mongoose = require('mongoose')

 const schema = new mongoose.Schema({
     name: {
         type: String
     },
     avatar: {
         type: String //保存图片地址
     }
 })

 module.exports = mongoose.model('Hero', schema)