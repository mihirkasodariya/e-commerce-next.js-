import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import SendResponse from "@/lib/sendResponse";
import { AdminService } from "@/services/user";
import userValidate from '@/app/api/admin/getProduct/validation';

const UPLOAD_DIR = path.resolve("", "public/uploads");
// const body = await req.json();
// const validatedUser = userValidate(body);
// if (validatedUser.errorMessages && validatedUser.errorMessages.length > 0) {
//     return SendResponse.error('missing_field', 400, { errorMessages: validatedUser.errorMessages });
// };


export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Extract productId from the query string
    const productId = req.nextUrl.searchParams.get('productId');
    console.log('req params id  ', productId);

    if (!productId) {
      return SendResponse.error('Product ID is required', 400, {});
    }

    const getProduct = await AdminService.getProductById({productId});
    console.log('getProduct', getProduct);

    if (getProduct?.success === true) {
      return SendResponse.success('Product Added Successfully', 200, { ...getProduct?.data });
    } else {
      return SendResponse.error('Error Adding Product', 403, {});
    }
  } catch (error) {
    return SendResponse.error('internal_server_error', 500, { error });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    formData.forEach((value, key) => console.log(`Key: ${key}, Value:`, value));

    let bodyData: { name: string; price: string; description: string; points: [] };
    try {
      bodyData = JSON.parse(formData.get("data") as string);
    } catch (error) {
      return SendResponse.error("invalid_request", 400, {
        message: "Invalid JSON in `data` field.",
        error: error,
      });
    }

    const { name, price, description, points } = bodyData;
    if (!Array.isArray(points)) {
      return SendResponse.error("invalid_request", 400, {
        message: "`points` field must be an array.",
      });
    }

    const files = formData.getAll("image");
    if (!files || files.length === 0) {
      return SendResponse.error("invalid_request", 400, {
        message: "No files uploaded.",
      });
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const uploadedFiles = [];
    for (const file of files) {
      if (file instanceof Blob) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.resolve(UPLOAD_DIR, fileName);

        fs.writeFileSync(filePath, buffer);
        uploadedFiles.push({ savedAs: fileName });
      }
    }

    console.log("Parsed Body Data:", { name, price, description, points });
    console.log("Uploaded Files:", uploadedFiles);

    const newProduct = await AdminService.createProduct({
      image: uploadedFiles,
      name : bodyData.name,
      price : bodyData.price,
      description : bodyData.description,
      points : bodyData.points, 
    });

    return SendResponse.success("Product created successfully.", 200, newProduct);
  } catch (error) {
    console.error("Error in POST /api/admin/product:", error);
    return SendResponse.error("internal_server_error", 500, {
      message: "An error occurred while processing the request.",
      error: error,
    });
  }
}

  





export async function PUT(req: NextRequest, res: NextResponse) {
    try {
        const { productId, name, price, description, points } = await req.json();
        const updateProduct = await AdminService.updateproductById({ productId: productId, name: name, price: price, description: description, points: points });

        if (updateProduct?.success == true) {
            return SendResponse.success('Product Added Successfully', 200, { ...updateProduct?.data });
        } else {
            return SendResponse.error("Error Add Product", 403, {});
        };
    } catch (error) {
        return SendResponse.error('internal_server_error', 500, { error });
    };
};

