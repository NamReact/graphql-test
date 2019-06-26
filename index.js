const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql"); //middleware pour traiter les requête graphql
const mongoose = require("mongoose");
const Event = require("./models/event");

mongoose.connect("mongodb://localhost:27017/graphqltest", {
  useNewUrlParser: true
});

const { buildSchema } = require("graphql"); // import de la fonction pour créer des schemas

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphQlHttp({
    // le mot clé schema dans les parenthèse est un mot clé qui permet de créer un nouveau shema.
    // il contient 2 clés obligatoires. Ce sont des clés spéciale permettant de GET avec query et update, create et delete avec mutation
    // la clé spécial 'input' permet de définir une liste d'arguments.
    schema: buildSchema(`
        type Event {
          _id: ID!
          title : String!
          description : String!
          price : Float!
          date : String!
        }

        input EventInput {
          title : String!
          description : String!
          price : Float!
          date : String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput : EventInput) : Event
        }

        schema { 
            query : RootQuery
            mutation : RootMutation
        }
    `), // pointe vers les schemas
    // resolvers applique des fonctions pour traiter les demandes envoyé sous le model du schema
    // les fonctions des resolvers doivent avoir le mm nom que dans le schemas.
    // createEvent dans le schema a reçois des arguments. Dans le resolvers, il est nécessaire d'attribuer une variables a ces arguments.
    rootValue: {
      events: async () => {
        const events = await Event.find();
        return events;
      },
      createEvent: async args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });
        await event.save();
        return event;
      }
    }, // pointe vers les resolvers
    graphiql: true
  })
);

app.listen(3000, () => {
  console.log("Server started");
});
