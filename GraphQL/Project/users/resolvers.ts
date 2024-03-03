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