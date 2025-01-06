import { NextRequest, NextResponse } from 'next/server';
import userValidate from '@/app/api/cart/validation';
import SendResponse from '@/lib/sendResponse';
import { UserService } from '@/services/user';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();

        const validatedUser = userValidate(body);
        if (validatedUser.errorMessages && validatedUser.errorMessages.length > 0) {
            return SendResponse.error('missing_field', 400, { errorMessages: validatedUser.errorMessages });
        }
        const userId = req.headers.get('userid');
        body.userId = userId;

        const cartAdded = await UserService.addToCart(body);
        console.log('Cart Added:', cartAdded);

        if (cartAdded.success) {
            return SendResponse.success('Cart item added successfully.', 200, { ...cartAdded });
        } else {
            return SendResponse.error('Failed to add item to cart.', 403, {});
        }
    } catch (error) {
        console.error('Internal Server Error:', error);
        return SendResponse.error('internal_server_error', 500, { message: error || 'An unexpected error occurred.' });
    }
}

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const body = {
            userId: req.headers.get('userid') as string,
        };
        const cartAdded = await UserService.getCartByUserId(body);
        if (cartAdded.success) {
            return SendResponse.success('Get Add to Cart List successfully.', 200, { ...cartAdded });
        } else {
            return SendResponse.error('Failed to Get add to cart List.', 403, {});
        }
    } catch (error) {
        console.error('Internal Server Error:', error);
        return SendResponse.error('internal_server_error', 500, { message: error || 'An unexpected error occurred.' });
    }
}


export async function PUT(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        console.log('body',body)
        const validatedUser = userValidate(body);
        if (validatedUser.errorMessages && validatedUser.errorMessages.length > 0) {
            return SendResponse.error('missing_field', 400, { errorMessages: validatedUser.errorMessages });
        };
        const userId = req.headers.get('userid');
        console.log('userId',userId)
        body.userId = userId;

        const cartAdded = await UserService.updateAddToCart(body);
        console.log('Cart Added:', cartAdded);

        if (cartAdded.success) {
            return SendResponse.success('Cart item Update successfully.', 200, { ...cartAdded });
        } else {
            return SendResponse.error('Failed to Update item to cart.', 403, {});
        };
    } catch (error) {
        console.log('Internal Server Error:', error);
        return SendResponse.error('internal_server_error', 500, { message: error || 'An unexpected error occurred.' });
    }
}