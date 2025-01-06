import { z } from 'zod';

export const userValidate = z.object({
    name: z.string({ message: 'Product Name is required. Please provide your Product Name' }),
    price: z.string({ message: 'Product Price is required. Please provide your Product Price' }),
    description: z.string({ message: 'Description is required. Please provide your Description' }),
    points: z.string({ message: 'Points is required. Please provide your Points' }),
    // images: z.string({ message: 'Image is required. Please provide your Image' }),

});

const mapErrors = (errors: z.ZodError['errors']) => {
    return errors.map((error) => error.message).join(', ');
};

export const validateUser = (body: unknown) => {
    const result = userValidate.safeParse(body);

    if (!result.success) {
        const errorMessages = mapErrors(result.error.errors);
        return { name: '', price: '', description: '', points: '', errorMessages };
    };
    const {name, price, description, points } = result.data;
    return { name, price, description, points };
};

export default validateUser;
