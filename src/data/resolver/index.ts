import { Users } from '../../db';

export const resolvers = {
    Query: {
        getAllUsers: (root: any) => {
            return new Promise((resolve, reject) => {
                Users.find((err, users) => {
                    if (err) reject(err);
                    else resolve(users);
                });
            });
        },
    },
};
