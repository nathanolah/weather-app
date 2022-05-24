import "reflect-metadata";
import "dotenv/config";
import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { schema } from "./schema";
import { dataSources } from "./dataSource";

const main = async () => {
  const PORT = process.env.PORT || 4000;

  // Required logic for integrating with Express
  const app = express();
  const httpServer = http.createServer(app);

  // ApolloServer initialization
  const server = new ApolloServer({
    schema,
    dataSources,
    context: ({ req, res }: any) => ({ req, res }),
    csrfPrevention: true,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });

  // More required logic for integrating with Express
  await server.start();
  server.applyMiddleware({
    app,

    // By default, apollo-server hosts its GraphQL endpoint at the
    // server root. However, *other* Apollo Server packages host it at
    // /graphql. Optionally provide this to match apollo-server.
    path: "/",
  });

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Graphql endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });

  // Modified server startup
  // await new Promise<void>((resolve) =>
  //   httpServer.listen({ port: 4000 }, resolve)
  // );
  // console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);

  // app.listen(4000, () => {
  //   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  // });
};

main().catch((err) => console.log(err));
