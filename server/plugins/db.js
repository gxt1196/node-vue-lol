module.exports = app => {
  const mongoose = require("mongoose");
  mongoose.connect("mongodb+srv://jibeike:GUOxt144@bgtshow-ekxh2.mongodb.net/node-vue-lol?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  require('require-all')(__dirname + '/../models')

};


// mongodb: //127.0.0.1:27017/node-vue-lol 本地数据库默认端口地址
// mongodb + srv://jibeike:GUOxt144@bgtshow-ekxh2.mongodb.net/node-vue-lol?retryWrites=true&w=majority 云数据库连接地址
