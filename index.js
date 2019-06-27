const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

mongoose.connect("mongodb://localhost:27017/graphqltest", {
  useNewUrlParser: true
});

const app = express();
app.use(bodyParser.json());

app.use(
  "/graphql",
  graphQlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

app.listen(3000, () => {
  console.log("Server started");
});
