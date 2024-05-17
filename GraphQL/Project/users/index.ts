import { buildSubgraphSchema } from '@apollo/subgraph';
import { ApolloServer } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { typeDefs } from './schema';
import { resolvers } from './resolvers'
import { validateSession } from './libraries/auth';
import { startStandaloneServer } from '@apollo/server/standalone';
import 'dotenv/config'
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.DSN,
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

// Create Apollo Server
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

(async () => {
  // Start server
  const { url } = await startStandaloneServer(server, {
    context: async ({ req } : { req: any }) => { 
      // Get the user token from the headers.
      const token = req.headers.authorization || '';
      // If there's no token, return null for user
      if (token == '') return { user: null};
      // Try to retrieve a user with the token
      const user = await validateSession(token)
      // Check if user exists
      if (user == null) throw new GraphQLError('UNAUTHENTICATED', {
        extensions: {
            code: 'UNAUTHENTICATED',
        }
      });
      // Add the user to the context
      return { user };
    },
    listen: { port: 4001 }
  });
  console.log(`🚀  Server ready at: ${url}`);

})();
