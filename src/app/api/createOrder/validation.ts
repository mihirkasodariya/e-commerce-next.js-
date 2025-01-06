import { z } from 'zod';

export const userValidate = z.object({
    name: z.string({ message: 'Name is required property' }),
    orderId: z.number({ message: 'Order Id is required property' }),
    order: z.array(
        z.object({
            productId: z.string({ message: 'ProductId is required property' }),
            quantity: z.number({ message: 'Quantity is required property' }),
            orderStatus: z.number({ message: 'Order Status is required property' }),
        }),
        { message: 'Order must be an array of items' }
    ),
    address: z.string({ message: 'Address is required property' }),
    mobile: z.string({ message: 'Mobile is required property' }).min(10, { message: 'Mobile must be at least 10 characters' }),
    email: z.string().email({ message: 'Email is not valid' }),
    paymentType: z
        .number()
        .int({ message: 'Payment Type must be an integer' })
        .min(1, { message: 'Payment Type is required' }),
});

const mapErrors = (errors: z.ZodError['errors']) => {
    return errors.map((error) => error.message).join(', ');
};

export const validateUser = (body: unknown) => {
    const result = userValidate.safeParse(body);

    if (!result.success) {
        const errorMessages = mapErrors(result.error.errors);
        return {
            orderId: 0,
            order: [],
            address: '',
            mobile: '',
            email: '',
            paymentType: 1,
            errorMessages
        };
    }

    const { name, order, orderId, address, mobile, email, paymentType } = result.data;
    return {
        name,
        orderId,
        order,
        address,
        mobile,
        email,
        paymentType,
        errorMessages: ''
    };
};

export default validateUser;
