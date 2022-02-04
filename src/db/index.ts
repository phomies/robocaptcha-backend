import { connect, model, connection } from 'mongoose';
import { userSchema } from './schema/userSchema';

connect(process.env.MONGODB_URL || '');

const db = connection;
db.on('error', () => {
    console.error('Error while connecting to DB');
});

const User = model('User', userSchema);

export { User };
