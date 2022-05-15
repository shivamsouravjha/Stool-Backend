import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Routes from './routes/routes'
import Error from './app/Exceptions/error';
require('dotenv').config();
const app = express();
var cors = require('cors')

app.use(express.json());


// removing the CORS error
app.use(cors())
app.use('/api/users', Routes.AccountApiRouter); ///for user commands
app.use('/api/groups', Routes.GroupApiRouter);  ///for group commands
app.use('/api/source', Routes.SourceApiRouter);   ////for source commands


app.use((req, res, next) => {
    const error = new Error('Could not find this route.', 404);       ///Incase of not having a route
    throw error;
  });
  
  

app.use((error, req, res, next) => {          //special 4 term function that lets know error to consider it as error
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!', success: error.success||false});
});
  


mongoose
    .connect(
      `mongodb://${process.env.name}:${process.env.password}@cluster0-shard-00-00.dm1xw.mongodb.net:27017,cluster0-shard-00-01.dm1xw.mongodb.net:27017,cluster0-shard-00-02.dm1xw.mongodb.net:27017/${process.env.db}?ssl=true&replicaSet=atlas-x6eag6-shard-0&authSource=admin&retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true }
      
    )
    .then(() => {
      console.log('listening at port',process.env.PORT || 5001 )
      app.listen(process.env.PORT || 5001);
    })
    .catch(err => {
      console.log(err);
    });
  