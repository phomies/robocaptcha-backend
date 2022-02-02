import { connect, model, connection } from 'mongoose';
import { usersSchema } from './schema/userSchema';

connect(process.env.MONGODB_URL || '');
console.log(process.env.MONGODB_URL);

const db = connection;
db.on('error', () => {
    console.error('Error while connecting to DB');
});

const Users = model('Users', usersSchema);

export { Users };
