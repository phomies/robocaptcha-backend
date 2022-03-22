import * as firebase from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin/app';
import serviceAccount from '../../callcaptcha.json';

export const initFirebase = () => {
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount as ServiceAccount),
    });
};
