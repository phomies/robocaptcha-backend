import { IContext } from '../../common/interface';
import { Payment } from '../../db';

export const PaymentResolvers = {
    User: {
        payments: async (user: any) => {
            let payments = await Payment.find({ userId: user._id });
            payments = payments.sort((a, b) => b.dateStart - a.dateStart); // Latest subscription plan is the first
            return payments;
        },
    },
    Mutation: {
        upsertPayment: async (_: any, { upsertPaymentInput }: any, context: IContext) => {
            const { transactionId, ...paymentDetails } = upsertPaymentInput;
            const userId = context.uid;
            Object.assign(paymentDetails, { userId: userId });

            const payment = await Payment.findOneAndUpdate({ userId: userId, transactionId: transactionId }, paymentDetails, {
                new: true,
                upsert: true,
            });

            return payment;
        },
    },
};
