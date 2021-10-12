import express from "express";
import { IData } from "./databaseScripts/mongooseSchemas";

import { router } from "./routes/upload/excelFileUpload";
import { router as clientRouter } from "./routes/client/serveDataRoutes/databaseAccessRoutes";
import { router as sitesRouter } from "./routes/client/serveDataRoutes/databaseSitesRoutes";
// import { Site } from "./databaseScripts/Site";
// import { ApolloServer } from "apollo-server-express";
// import typeDefs from "./graphQL/typeDefs";
// import hello from "./graphQL/resolvers/Query/hello";
// import getData from "./graphQL/resolvers/Query/data";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// const resolvers = {
//   Query: {
//     hello,
//     getData,
//   },
// };

//const apolloServer = new ApolloServer({ typeDefs, resolvers });

const app = express();
const port = 3000;

//apolloServer.applyMiddleware({ app });
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(router);
app.use(clientRouter);
app.use(sitesRouter);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
  // console.log(
  //   `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  // );
});

/* 
///old file index for references
import express from 'express';
import { IData } from './databaseScripts/mongooseSchemas';

import { router } from './routes/upload/excelFileUpload';
import { router as clientRouter } from './routes/client/serveDataRoutes/databaseAccessRoutes';
import { Site } from './databaseScripts/Site';

const app = express();
const port = 3000;

app.use(router);
app.use(clientRouter);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//Testing Site save to dbs
// var firstSite = new Site({
//   url: 'http://localhost:3000/firstsite.html', //TODO make url dynamic to root site path
//   title: 'First site',
//   content: 'this is simple content',
//   isOnMainMenu: true
// });

// firstSite.save(err => {
//   if (err) {
//     console.log('Error saving site to databse: ', err);
//   }
// });

*/

//Testing Site save to dbs
// var firstSite = new Site({
//   url: 'http://localhost:3000/secendsite.html', //TODO make url dynamic to root site path
//   title: 'Secend site',
//   content: 'this is simple content for secend site',
//   isOnMainMenu: false
// });

// firstSite.save(err => {
//   if (err) {
//     console.log('Error saving site to databse: ', err);
//   }
// });
