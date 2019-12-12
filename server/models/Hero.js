 const mongoose = require('mongoose')

 const schema = new mongoose.Schema({
     name: {
         type: String
     },
     banner: {
         type: String
     },
     delay: {
         type: String
     },
     cost: {
         type: String
     },
     avatar: {
         type: String //保存图片地址
     },
     selectAudio: {
         type: String
     },
     banAudio: {
         type: String
     },
     title: {
         type: String
     },
     categories: [{
         type: mongoose.SchemaTypes.ObjectId,
         ref: 'Category'
     }],
     scores: {
         skills: {
             type: Number
         },
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
     skills: [{
         icon: {
             type: String
         },
         name: {
             type: String
         },
         description: {
             type: String
         },
         tips: {
             type: String
         },
     }],
     items1: [{
         type: mongoose.SchemaTypes.ObjectId,
         ref: 'Item'
     }],
     items2: [{
         type: mongoose.SchemaTypes.ObjectId,
         ref: 'Item'
     }],
     usageTips: {
         type: String
     },
     battleTips: {
         type: String
     },
     teamTips: {
         type: String
     },
     partners: [{
         hero: {
             type: mongoose.SchemaTypes.ObjectId,
             ref: 'Hero'
         },
         description: {
             type: String
         }
     }],
 })

 module.exports = mongoose.model('Hero', schema, 'heroes')