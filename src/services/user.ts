import { prisma } from "@/lib/prisma";
import { ObjectId } from 'mongodb';
import { string } from "zod";

class UserService {
  static async createUser(data: {
    name: string;
    email: string;
    password: string;
    address: string;
  }) {
    console.log('sddata', data);

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (user) {
      return { success: false, data: user };
    }

    const userCreate = await prisma.user.create({
      data: {
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ")[1],
        email: data.email,
        password: data.password,
        address: data.address,
      },
    });

    return { success: true, data: userCreate };
  }

  static async loginUser(data: {
    email: string;
    // password: string;
  }) {
    console.log('data', data.email)
    const user = await prisma.user.findUnique({
      where: {
        email: data.email.toString(),
      },
    });
    console.log(user)
    if (user) {
      return { success: true, data: user };
    } else {
      return { success: false, data: user };
    }
  };

  static async getUserProfileById(data: {
    userId: string;
  }) {
    const user = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (user) {
      return { success: true, data: user };
    } else {
      return { success: false, data: user };
    }
  };

  static async updateUserProfileById(data: {
    userId: string;
    name?: string;
    email?: string;
    address?: string;
  }) {
    const user = await prisma.user.update({
      where: {
        id: data.userId,
      },
      data: {
        ...(data.name && {
          firstName: data.name.split(" ")[0],
          lastName: data.name.split(" ")[1],
        }),
        ...(data.email && { email: data.email }),
        ...(data.address && { address: data.address }),
      },
    });
    if (user) {
      return { success: true, data: user };
    } else {
      return { success: false, data: user };
    }
  };

  static async addToCart(data: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    console.log('sddata', data);
    const cartAdd = await prisma.cart.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        quantity: data.quantity
      },
    });
    if (cartAdd) {
      return { success: true, data: cartAdd };
    } else {
      return { success: false, data: cartAdd };
    }
  }

  static async getCartByUserId(data: {
    userId: string;
  }) {
    const getCart = await prisma.cart.findMany({
      where: {
        userId: data.userId,
      },
      include: {
        product: true,
      },
    });
    console.log('check', getCart);
    if (getCart) {
      //   for (const productId of getCart) {
      //     console.log("productIds get", productId.productId)
      //     const productData = await prisma.product.findMany({
      //       where: {
      //         id: productId.productId,
      //       },
      //     });
      // }
      return { success: true, data: getCart };
    } else {
      return { success: false, data: getCart };
    }
  };

  static async updateAddToCart(data: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    let cart
    if (data.quantity > 0) {
      cart = await prisma.cart.updateMany({
        where: {
          userId: data.userId,
          productId: data.productId
        },
        data: {
          quantity: data.quantity
        },
      });
    } else if (data.quantity == 0) {
      cart = await prisma.cart.deleteMany({
        where: {
          userId: data.userId,
          productId: data.productId,
        },
      });
    }
    if (cart) {
      return { success: true, data: cart };
    } else {
      return { success: false, data: cart };
    }
  }

  static async createOrder(data: {
    name: string;
    orderId: number,
    userId: string;
    order: [{ productId: string; quantity: number; orderStatus: number }];
    address: string;
    mobile: string;
    email: string;
    paymentType: number;
  }) {
    try {
      const orderMaster = await prisma.orderMaster.create({
        data: {
          name: data.name,
          orderId: data.orderId,
          userId: data.userId,
          address: data.address,
          mobile: data.mobile,
          email: data.email,
          paymentType: data.paymentType,
          orders: {
            create: data.order.map(orderItem => ({
              productId: orderItem.productId,
              quantity: orderItem.quantity,
              orderStatus: orderItem.orderStatus,
            })),
          },
        },
      });

      console.log('Order created:', orderMaster);
      return { success: true, data: orderMaster };
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, data: null, error: error };
    }
  }


  static async getAllOrderHistory(data: {
    userId: string
  }) {
    const orderHistory = await prisma.orderMaster.findMany({
      where: { userId: data.userId },
      include: {
        orders: {
          include: {
            product: true,
          },
        },
      },
    });

    if (orderHistory) {
      return { success: true, data: orderHistory };
    } else {
      return { success: false, data: orderHistory };
    }
  }



}



class AdminService {
  static async createProduct(data: {
    name: string;
    price: string;
    description: string;
    points: []; // Assuming points is an array of objects
    image: { savedAs: string }[];
  }) {
    try {
      console.log('Received Data:', data);

      // Transform `points` into an array of strings
      // const pointsArray = data.points.map((pnt) => pnt.point);

      const createdProduct = await prisma.product.create({
        data: {
          name: data.name,
          price: data.price,
          description: data.description,
          points: data.points, // Ensure points is an array of strings
          image: data.image.map((img) => img.savedAs),
        },
      });

      console.log('Product Created:', createdProduct);

      return { success: true, data: createdProduct };
    } catch (error) {
      console.error('Error creating product:', error);

      return {
        success: false,
        message: 'Failed to create product. Please try again.',
        error: error,
      };
    }
  }



  static async getProductById(data: {
    productId: any;
  }) {
    console.log(data);
    const user = await prisma.product.findUnique({
      where: {
        id: data.productId,
      },
    });
    console.log("DMFN", user);
    if (user) {
      return { success: true, data: user };
    } else {
      return { success: false, data: user };
    }
  };

  static async updateproductById(data: {
    productId: string;
    name: string;
    price: string;
    description: string;
    points: string;
  }) {
    const user = await prisma.product.update({
      where: {
        id: data.productId,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.price && { price: data.price }),
        ...(data.description && { description: data.description }),
        ...(data.points && { points: data.points }),
      },
    });
    if (user) {
      return { success: true, data: user };
    } else {
      return { success: false, data: user };
    }
  };

  static async getAllProduct() {
    try {
      const products = await prisma.product.findMany({});
      console.log("db Data", products);

      if (products.length > 0) {
        return { success: true, data: products };
      } else {
        return { success: false, data: [] };
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, error: error };
    };
  };
}
export { UserService, AdminService };
