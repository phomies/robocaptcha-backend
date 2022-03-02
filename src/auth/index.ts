import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { Request, Response, NextFunction } from 'express';
import * as firebase from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin/app';
import serviceAccount from '../../callcaptcha.json';
import { User } from '../db';

export const initFirebase = () => {
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount as ServiceAccount),
    });
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (token) {
        try {
            const decodedToken = await firebase.auth().verifyIdToken(token);
            const user = User.findById(decodedToken.uid);

            console.log(decodedToken, 'here');
            Object.assign(req, { user: decodedToken });

            return next();
        } catch (error) {
            console.log(error);
            // throw new AuthenticationError('Invalid/Expired token');
        }
    }
    next();
};
