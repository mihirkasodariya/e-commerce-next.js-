import { NextResponse } from "next/server";

class SendResponse {
    static success(message: string, code: number, data?: any) {
        return NextResponse.json(
            {
                success: true,
                code: code,
                message: message,
                data: data || {},
            },
        );
    };

    static error(message: string, code: number, data?: any) {
        return NextResponse.json(
            {
                success: false,
                // error: {
                    message: message,
                code: code,
                data: data || {},
                // },
            },
        );
    };
};

export default SendResponse;