import { Payment } from '../../db';

export const PaymentResolvers = {
    User: {
        payments: async (_: any, user: any) => {
            const payments = await Payment.find({ userId: user._id });
            return payments;
        },
    },
};
