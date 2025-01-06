import fetchApi from "@/lib/fetch-api";
import { createAdminApiClient } from "@shopify/admin-api-client";
import { UserService } from "./user";
import { ShopService } from "./shop";
import { Shop } from "@prisma/client";
import { HmacHasher } from "@/lib/hmac-hasher";

class ShopifyService {
  static async getInstallationUrl(shop: string) {
    return `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_CLIENT_ID}&scope=${process.env.SHOPIFY_API_SCOPES}&redirect_uri=${process.env.SHOPIFY_API_REDIRECT_URI}`;
  }

  static async shopCallback(shopDomain: string, code: string) {
    const response = (await fetchApi({
      endpoint: `https://${shopDomain}/admin/oauth/access_token`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        client_id: process.env.SHOPIFY_API_CLIENT_ID!,
        client_secret: process.env.SHOPIFY_API_CLIENT_SECRET!,
        code,
      },
    })) as {
      success: boolean;
      data: { access_token: string; scope: string };
      error: unknown;
    };

    if (response.success) {
      const client = createAdminApiClient({
        storeDomain: shopDomain,
        apiVersion: "2024-10",
        accessToken: response.data.access_token,
      });

      const { data } = await client.request(`#graphql
        query {
          shop {
            name
            email
            myshopifyDomain
            shopOwnerName
          }
        }
      `);

      const user = await UserService.createUser({
        name: data.shop.shopOwnerName,
        email: data.shop.email,
        // random password for now
        password: HmacHasher.createHmacHash(
          Math.random().toString(36).slice(-8)
        ),
      });

      await ShopService.createShop({
        firstName: data.shop.name,
        domain: data.shop.myshopifyDomain,
        accessToken: response.data.access_token,
        scope: response.data.scope,
        user: user,
      });
    }
  }

  static client(shop: Shop) {
    return createAdminApiClient({
      storeDomain: shop.domain,
      apiVersion: "2024-10",
      accessToken: shop.accessToken,
    });
  }
}

export { ShopifyService };
