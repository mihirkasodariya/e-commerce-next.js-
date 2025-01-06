import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

class ShopService {
  static async createShop(data: {
    firstName: string;
    domain: string;
    accessToken: string;
    scope: string;
    user: User;
  }) {
    const shop = await prisma.shop.findUnique({
      where: {
        domain: data.domain,
      },
    });

    if (shop) {
      return await prisma.shop.update({
        where: {
          domain: data.domain,
        },
        data: {
          name: data.firstName,
          accessToken: data.accessToken,
          scope: data.scope,
          userId: data.user.id,
        },
      });
    }

    return await prisma.shop.create({
      data: {
        name: data.firstName,
        domain: data.domain,
        accessToken: data.accessToken,
        scope: data.scope,
        userId: data.user.id,
      },
    });
  }
}

export { ShopService };
