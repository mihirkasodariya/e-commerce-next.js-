import { NextRequest, NextResponse } from 'next/server';
import userValidate from '@/app/(shop)/register/validation';
import SendResponse from '@/lib/sendResponse';
import { UserService } from '@/services/user';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const validatedUser = userValidate(body);
        if (validatedUser.errorMessages && validatedUser.errorMessages.length > 0) {
            return SendResponse.error('missing_field', 400, { errorMessages: validatedUser.errorMessages });
        };
        const createUser = await UserService.createUser(body);
        console.log('createUser', createUser);
        if (createUser.success == true) {
            return SendResponse.success('User Created Successfully', 200, { createUser });
        } else {
            return SendResponse.error('This email is already registered..', 403, {});
        }
    } catch (error) {
        // console.log('Error registering user:', error);
        return SendResponse.error('internal_server_error', 500, { error });
    }
}
