import { z } from 'zod';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const userValidate = z.object({
    name: z.string({ message: 'Name is required property' })
        .min(1, { message: 'Please enter Name' }),
    email: z.string({ message: 'Email is required. Please provide your email address.' })
        .email({ message: 'Please enter a valid email address.' })
        .regex(emailRegex, { message: 'Your email address should be in the format: example@domain.com.' }),
    address: z.string({ message: 'Address is required property' })
        .min(1, { message: 'Please enter Address' }),
});

const mapErrors = (errors: z.ZodError['errors']) => {
    return errors.map((error) => error.message).join(', ');
};

export const validateUser = (body: unknown) => {
    const result = userValidate.safeParse(body);

    if (!result.success) {
        const errorMessages = mapErrors(result.error.errors);
        return { name: '', email: '', address: '', errorMessages };
    };
    const { name, email, address } = result.data;
    return { name, email, address, errorMessages: '' };
};

export default validateUser;
