import { NextRequest, NextResponse } from 'next/server';
import SendResponse from '@/lib/sendResponse';
import { UserService } from '@/services/user';
import userValidate from '@/app/api/profile/validation';
export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const body = {
            userId: req.headers.get('userid') as string,
        }
        const getUser = await UserService.getUserProfileById(body);
        console.log('User Profile', getUser);

        if (getUser.success === true && getUser.data) {
            return SendResponse.success('Get User Profile Successfully', 200, { getUser });
        } else {
            return SendResponse.error('User Not Found', 403, {});
        };
    } catch (error) {
        return SendResponse.error('internal_server_error', 500, { error });
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {

        const userId = req.headers.get('userid');

        const body = await req.json();
        const validatedUser = userValidate(body);
        if (validatedUser.errorMessages && validatedUser.errorMessages.length > 0) {
            return SendResponse.error('missing_field', 400, { errorMessages: validatedUser.errorMessages });
        };
        const reqBody = {
            userId: userId,
            ...body
        }
        const createUser = await UserService.updateUserProfileById(reqBody);
        console.log('createUser', createUser);
        if (createUser.success == true) {
            return SendResponse.success('Profile Updated Successfully', 200, { ...createUser.data });
        } else {
            return SendResponse.error('Error in Update Profile', 403, {});
        };
    } catch (error) {
        return SendResponse.error('internal_server_error', 500, { error });
    };
};

