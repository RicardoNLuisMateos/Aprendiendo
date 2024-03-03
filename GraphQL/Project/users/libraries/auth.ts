import { users } from "../data/usersData";

export const validateSession = async (token: string) => {
    // Check if token is valid
    if (token == '') return null;
    // User
    const user = users.find(user => user.token === token);
    return user;
}