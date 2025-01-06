import { Button } from "@/components/ui/button";
import { ShopifyService } from "@/services/shopify";

export default async function Authorize({
  searchParams,
}: {
  searchParams: {
    shop: string;
  };
}) {
  const { shop } = await searchParams;

  console.log(await ShopifyService.getInstallationUrl(shop));

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Button>Click me</Button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Hello
      </footer>
    </div>
  );
}
