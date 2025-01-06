import { NextRequest, NextResponse } from 'next/server';
import userValidate from '@/app/api/login/validation';
import SendResponse from '@/lib/sendResponse';
import { UserService } from '@/services/user';
import { createSession } from '@/lib/session';
// export async function POST(req: NextRequest, res: NextResponse) {
//     try {
//         const body = await req.json();
//         const validatedUser = userValidate(body);
//         if (validatedUser.errorMessages && validatedUser.errorMessages.length > 0) {
//             return SendResponse.error('missing_field', 400, { errorMessages: validatedUser.errorMessages });
//         };
//         const createUser = await UserService.loginUser(body);
//         console.log('createUser', createUser);
//         if (createUser.success == true) {
//             const userToken = await createSession(createUser.id as string) 
//             return SendResponse.success('User Login Successfully', 200, { createUser });
//         } else {
//         return SendResponse.error("Email not found. Please sign up if you don't have an account.", 403, {});
//         }
//     } catch (error) {
//         return SendResponse.error('internal_server_error', 500, { error });
//     }
// }

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const validatedUser = userValidate(body);
        if (validatedUser.errorMessages && validatedUser.errorMessages.length > 0) {
            return SendResponse.error('missing_field', 400, { errorMessages: validatedUser.errorMessages });
        };
console.log(body)
        const createUser = await UserService.loginUser(body);
        console.log('createUser', createUser);

        if (createUser.success === true && createUser.data) {
            if (body.password === createUser?.data?.password) {
               const session = await createSession(createUser.data.id);
               console.log('session', session)
                return SendResponse.success('User Login Successfully', 200, {session :session.session, UserId : createUser.data.id});
            } else {
                return SendResponse.error("Invalid Password", 401, {});
            };
        } else {
            return SendResponse.error("Email not found. Please sign up if you don't have an account.", 403, {});
        };
       
    } catch (error) {
        return SendResponse.error('internal_server_error', 500, { error });
    }
}
