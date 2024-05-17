import { users } from "./data/usersData";
import { startTransaction, finishTransaction, startSpan, finishSpan } from "./libraries/sentryTransacction";

export const resolvers = {
    Query: {
        // parent, args, contextValue, info
        works: () => {
            return "Hello World";
        },
        getUsers: (_: any, { id }: { id: number }) => {
            // Start Transaction
            const transaction = startTransaction("Get Users Service Query 1");
            // Filter by id
            if (id) {
                // Start Span
                const span = startSpan(transaction, "function", "Get User by ID");
                // Find user
                const user = users.find(user => user.id == id);
                // Finish Span and transaction
                finishSpan(span);
                finishTransaction(transaction);
                // Response
                return [user];
            }
            // Finish Transaction
            finishTransaction(transaction);
            // Response
            return users;
        }
    }
};