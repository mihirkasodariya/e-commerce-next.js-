import { z } from 'zod';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const userValidate = z.object({
    email: z.string({ message: 'Email is required. Please provide your email address.' })
        .email({ message: 'Please enter a valid email address.' })
        .regex(emailRegex, { message: 'Your email address should be in the format: example@domain.com.' }),
    password: z.string({ message: 'Password is required property' })
        .min(6, { message: 'Password must be at least 6 characters long' })
        .optional()
        .or(z.literal('')),
});

const mapErrors = (errors: z.ZodError['errors']) => {
    return errors.map((error) => error.message).join(', ');
};

export const validateUser = (body: unknown) => {
    const result = userValidate.safeParse(body);

    if (!result.success) {
        const errorMessages = mapErrors(result.error.errors);
        return { name: '', email: '', password: '', errorMessages };
    };
    const { email, password } = result.data;
    return { email, password, errorMessages: '' };
};

export default validateUser;
