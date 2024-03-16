# Microservice

Microservicio para administrar usuarios

## Librerías

Para crear el microservicio de GraphQL se requieren de la siguientes librerías:

*Librerías nenesarias para crear el servidor y crear schemas gql:*

`@apollo/server` `@apollo/subgraph` `graphql` `graphql-tag` 

*Librería para manejar fechas*

`moment` 

*Librerías para manejar TypeScript*

`tsc` `@types/node` `ts-node` `typescript`

## Estructura

| Files             | Descripción                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| build             | Archivos compilados y empaquetados de la app para ejecutarse en producción.                         |
| data              | Archivos de donde se obtiene la información de los usuarios.                                        |
| libraries         | Archivos que contienen código que se va a reutilizar.                                               |
| node_modules      | Guarda todas las dependencias de tu proyecto Node.js.                                               |
| index.ts          | Archivo que donde se crear el servidor.                                                             |
| package-lock.json | Guarda información específica sobre las dependencias exactas instaladas.                            |
| package.json      | Lista de las dependencias y scripts del proyecto.                                                   |
| resolvers.js      | Funciones responsables de completar los datos de un solo campo en el esquema.                       |
| schema.ts         | Define una jerarquía de tipos con campos que se completan desde sus almacenes de datos de back-end. |
| tsconfig.json     | Especificaciones de compilación a JavaScript                                                        |

## Explicación

`index.ts`

Para crear el servidor se importó `ApolloServer` de `@apollo/server` la cual recibe un objecto llamado schema, para crear este schema se utilizará el método `buildSubgraphSchema` de la librería `@apollo/subgraph`, esta recibe los `typeDefs` y `resolvers`. Al ser un microservicio que utiliza federation se usa startStandaloneServer para configurar el contexto y poder agregar métodos me autenticación y autorización.

```ts
import { buildSubgraphSchema } from '@apollo/subgraph';
import { ApolloServer } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { typeDefs } from './schema';
import { resolvers } from './resolvers'
import { validateSession } from './libraries/auth';
import { startStandaloneServer } from '@apollo/server/standalone';

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
```

`shema.ts`

Dentro de este archivo se han definido las querys works y getUser la cual acepta el parámetro id que se usará para filtrar por id de usuario. Seguido de esto se definio un tipo User, este tipo tiene las propiedades que se podrán consultar.

```ts
import gql from 'graphql-tag';

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.6", import: ["@key", "@shareable"])

  type Query {
    works: String,
    getUsers(id: ID): [User]
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    phone: String
	email: String
	address: String
	region: String
	country: String
	numberra: Int
    token: String
    password: String
  }
`;
```

resolvers.ts

Dentro de los archivos se definió el objeto resolver que a sus vez contiene el Query, detro de este se agregaron funciones, las cuales, como se puede observar son las mismas que se han definido en el schema. En cada función se agrego la logica necesario para devolver los datos necesarios de acuerdo al schema definido.

```ts
import { users } from "./data/usersData";

export const resolvers = {
    Query: {
        // parent, args, contextValue, info
        works: () => {
            return "Hello World";
        },
        getUsers: (_: any, { id }: { id: number }) => {
            // Filter by id
            if (id) {
                // Find user
                const user = users.find(user => user.id == id);
                // Response
                return [user];
            }
            // Response
            return users;
        }
    }
};
```

Como se puede observar se esta usando el archivo usersData como fuente de datos.

![](C:\Users\ricar\AppData\Roaming\marktext\images\2024-03-16-08-05-09-image.png)