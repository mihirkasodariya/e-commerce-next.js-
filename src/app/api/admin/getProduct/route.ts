import { NextRequest, NextResponse } from 'next/server';
import userValidate from '@/app/api/admin/getProduct/validation';
import SendResponse from '@/lib/sendResponse';
import { AdminService } from '@/services/user';





export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const getProduct = await AdminService.getAllProduct();
        console.log('Products fetched:', getProduct);
        if (getProduct?.success === true && getProduct?.data !== null) {
            return SendResponse.success('Products fetched successfully', 200, { ...getProduct });
        } else {
            return SendResponse.error("Error fetching products", 403, { error: "No products found" });
        }
    } catch (error) {
        return SendResponse.error('internal_server_error', 500, { error: error });
    };
};


