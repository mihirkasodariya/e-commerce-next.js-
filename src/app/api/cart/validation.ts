import { z } from 'zod';

export const userValidate = z.object({
    productId: z.string({ message: 'ProductId is required property' }),
    quantity: z.number({ message: 'quantity is required property' }),
});

const mapErrors = (errors: z.ZodError['errors']) => {
    return errors.map((error) => error.message).join(', ');
};

export const validateUser = (body: unknown) => {
    const result = userValidate.safeParse(body);

    if (!result.success) {
        const errorMessages = mapErrors(result.error.errors);
        return { productId: '', quantity: 0, errorMessages };
    };
    const { productId, quantity } = result.data;
    return { productId, quantity, errorMessages: '' };
};

export default validateUser;
