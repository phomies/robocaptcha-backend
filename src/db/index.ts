import { connect, model, connection } from 'mongoose';
import { callSchema } from './schema/callSchema';
import { notificationSchema } from './schema/notificationSchema';
import { paymentSchema } from './schema/paymentSchema';
import { userSchema } from './schema/userSchema';

connect(process.env.MONGODB_URL || '');

const db = connection;
db.on('error', () => {
    console.error('Error while connecting to DB');
});

const User = model('User', userSchema);
const Call = model('Call', callSchema);
const Notification = model('Notification', notificationSchema);
const Payment = model('Payment', paymentSchema);

export { User, Call, Notification, Payment };
