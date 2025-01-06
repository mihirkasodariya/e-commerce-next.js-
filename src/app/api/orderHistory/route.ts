import { NextRequest, NextResponse } from 'next/server';
import SendResponse from '@/lib/sendResponse';
import { UserService } from '@/services/user';
// import userValidate from '@/app/api/profile/validation';
export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const body = {
            userId: req.headers.get('userid') as string,
        };
        const orderHistory = await UserService.getAllOrderHistory(body);
        console.log('orderHistory', orderHistory);

        if (orderHistory.success === true && orderHistory.data) {
            return SendResponse.success('Get User Profile Successfully', 200, { orderHistory });
        } else {
            return SendResponse.error('User Not Found', 403, {});
        };
    } catch (error) {
        return SendResponse.error('internal_server_error', 500, { error });
    };
};
