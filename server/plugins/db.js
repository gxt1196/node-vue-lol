module.exports = app => {
  const mongoose = require("mongoose");
  mongoose.connect("mongodb+srv://jibeike:GUOxt144@bgtshow-ekxh2.mongodb.net/node-vue-lol?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

};


// mongodb: //127.0.0.1:27017/node-vue-lol 本地数据库默认端口地址