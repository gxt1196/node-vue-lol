const express = require("express");

const app = express();

app.use(express.json())
app.use(require('cors')())
app.use('/uploads', express.static(__dirname + '/uploads')) //托管静态文件

require('./plugins/db')(app)
require('./routes/admin')(app)

app.listen(3000, () => {
    console.log("http://localhost:3000");
});