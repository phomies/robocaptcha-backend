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
        deletePayment: async (_: any, __: any, context: IContext) => {
            // Get their default FREE plan upon registration of account, retrieves latest document
            const freePaymentPlan = await Payment.findOneAndUpdate(
                { userId: context.uid, isCancelled: false },
                { isCancelled: true },
                { sort: { dateStart: -1 } }
            );
            // const paymentObject = freePaymentPlan.toObject();
            // const { _id, dateEnd, ...paymentDetails } = paymentObject;
            // const daysLeft = moment.duration(moment(dateEnd).diff(paymentDetails.dateStart)).asDays();

            // Object.assign(paymentDetails, {
            //     _id: new mongoose.Types.ObjectId(),
            //     dateEnd: moment().add(daysLeft, 'days'),
            // });

            // const newPayment = new Payment(paymentDetails);
            // await newPayment.save();
        },
    },
};
