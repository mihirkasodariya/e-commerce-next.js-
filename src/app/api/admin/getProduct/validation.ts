import { z } from 'zod';

export const userValidate = z.object({
    productId: z.string({ message: 'ProductId is required. Please provide your ProductId' }),
});

const mapErrors = (errors: z.ZodError['errors']) => {
    return errors.map((error) => error.message).join(', ');
};

export const validateUser = (body: unknown) => {
    const result = userValidate.safeParse(body);

    if (!result.success) {
        const errorMessages = mapErrors(result.error.errors);
        return { productId: '', errorMessages };
    };
    const { productId } = result.data;
    return { productId };
};

export default validateUser;
