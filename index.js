const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const { dbConnection } = require("./config/config")
const { handleTypeError }= require('./middlewares/errors.js');
const cors = require("cors")
const swaggerUI = require('swagger-ui-express')
const docs = require('./docs/index')


app.use(express.json())
app.use(cors())
app.use(express.static("./uploads")
)
dbConnection()

app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));

app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(docs))
app.use(handleTypeError)


app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));