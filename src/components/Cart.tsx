import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { cn, formatPrice, getOfferLabel } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "./hooks/useCart";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { getPriceDataByLocale } from "@/helpers/general";
import { useRouter } from "next/router";

export const Cart = NiceModal.create(() => {
  const modal = useModal();
  const { store } = useCart();
  const { locale } = useRouter();

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [tab, setTab] = useState<"checkout" | "cart">("cart");

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 1000);
  }, []);

  const cartItems = isMounted ? store.cart.cart?.cart_data.items ?? [] : [];
  const cartSummary = isMounted ? store.cart.cart?.cart_summary : null;

  // const cartTotal = items.reduce(
  //   (total, { product }) => total + product.price,
  //   0
  // )

  return (
    <Sheet open={modal.visible} onOpenChange={modal.hide}>
      {/* <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger> */}
      <SheetContent className="flex w-full flex-col  sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6 border-b pb-3">
          <SheetTitle className="flex items-center gap-2 relative">
            Cart
            <div className="text-white bg-green-500 h-5 w-5 rounded-xl  text-xs flex items-center justify-center">
              {cartItems.length}
            </div>
          </SheetTitle>
        </SheetHeader>
        {tab === "cart" ? (
          <div>
            {cartItems.length > 0 ? (
              <>
                <div className="flex w-full flex-col pr-6 h-full">
                  <div className="h-full flex-1 overflow-x-hidden">
                    <div className={"flex w-full flex-col gap-5"}>
                      {cartItems.map((cartItem) =>
                        cartItem.items.map((item) => {
                          const priceData = getPriceDataByLocale(
                            locale as locale,
                            item.prices
                          );

                          return (
                            <div className="space-y-3">
                              <div
                                className={cn(
                                  "flex items-start justify-between gap-4"
                                )}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="relative aspect-square h-20 w-20 max-w-fit  overflow-hidden rounded-lg border">
                                    {item?.featured_image ? (
                                      <Image
                                        src={item?.featured_image}
                                        alt={item.title}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        fill
                                        className="absolute object-cover"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="flex h-full items-center justify-center bg-accent" />
                                    )}
                                  </div>

                                  <div className="flex flex-col gap-y-1 self-start">
                                    <span className="line-clamp-1 text-sm font-medium ">
                                      {item.title}
                                    </span>
                                    {item.offers && (
                                      <div className="bg-green-500 w-fit rounded text-xs py-0.5 px-2 text-white">
                                        {getOfferLabel(item.offers)}
                                      </div>
                                    )}
                                    {priceData?.price &&
                                    priceData?.price.regular_price !==
                                      priceData?.price.offer_price ? (
                                      <div className="flex items-center gap-3 mt-1 line-clamp-1">
                                        <p className=" font-medium  text-red-600">
                                          {formatPrice(
                                            priceData?.price.offer_price
                                          )}
                                        </p>
                                        <p className=" font-medium text-sm text-blue-600 line-through">
                                          {formatPrice(
                                            priceData?.price.regular_price || ""
                                          )}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className=" mt-1 line-clamp-1">
                                        <p className=" font-medium text-red-600">
                                          {formatPrice(
                                            priceData?.price.regular_price || ""
                                          )}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Separator />
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
                <div className={cn("space-y-4 pr-6 ")}>
                  <Separator />
                  <div className="space-y-1.5 text-sm font-medium">
                    <div className="flex">
                      <span className="flex-1">Order Total</span>
                      <span>{formatPrice(cartSummary?.total ?? 0)}</span>
                    </div>
                    <div className="flex text-green-500">
                      <span className="flex-1">Items Discount</span>
                      <span>- {formatPrice(cartSummary?.discount ?? 0)}</span>
                    </div>
                    <div className="flex ">
                      <span className="flex-1">Estimated VAT %</span>
                      <span>{formatPrice(cartSummary?.vat ?? 0)}</span>
                    </div>
                    <div className="flex ">
                      <span className="flex-1">Shipping</span>
                      <span>
                        {" "}
                        {cartSummary?.shipping_fee
                          ? formatPrice(cartSummary?.shipping_fee ?? 0)
                          : "FREE"}
                      </span>
                    </div>
                    <div className="flex ">
                      <span className="flex-1 ">
                        Total Amount (Inclusive of VAT)
                      </span>
                      <span className="text-blue-500">
                        {" "}
                        {formatPrice(cartSummary?.sub_total ?? 0)}
                      </span>
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetTrigger asChild>
                      <Link
                        aria-label="View your cart"
                        href="/cart"
                        className={buttonVariants({
                          size: "sm",
                          className: "w-full",
                        })}
                      >
                        Continue to checkout
                      </Link>
                    </SheetTrigger>
                  </SheetFooter>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-60 w-60 text-muted-foreground"
                >
                  <Image
                    src="/images/cart/empty-cart.png"
                    fill
                    alt="empty shopping cart hippo"
                  />
                </div>
                <div className="text-2xl font-semibold">Your cart is empty</div>
                <SheetTrigger asChild>
                  <Link
                    href="/products"
                    shallow
                    className={buttonVariants({
                      variant: "link",
                      size: "sm",
                      className: "t text-blue-400",
                    })}
                  >
                    Add items to your cart to checkout
                  </Link>
                </SheetTrigger>
              </div>
            )}
          </div>
        ) : cartItems.length > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6 h-full">
              <div className="h-full flex-1 overflow-x-hidden">
                <div className={"flex w-full flex-col gap-5"}>
                  {cartItems.map((cartItem) =>
                    cartItem.items.map((item) => {
                      const priceData = getPriceDataByLocale(
                        locale as locale,
                        item.prices
                      );

                      return (
                        <div className="space-y-3">
                          <div
                            className={cn(
                              "flex items-start justify-between gap-4"
                            )}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="relative aspect-square h-20 w-20 max-w-fit  overflow-hidden rounded-lg border">
                                {item?.featured_image ? (
                                  <Image
                                    src={item?.featured_image}
                                    alt={item.title}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    fill
                                    className="absolute object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center bg-accent" />
                                )}
                              </div>

                              <div className="flex flex-col gap-y-1 self-start">
                                <span className="line-clamp-1 text-sm font-medium ">
                                  {item.title}
                                </span>
                                {item.offers && (
                                  <div className="bg-green-500 w-fit rounded text-xs py-0.5 px-2 text-white">
                                    {getOfferLabel(item.offers)}
                                  </div>
                                )}
                                {priceData?.price &&
                                priceData?.price.regular_price !==
                                  priceData?.price.offer_price ? (
                                  <div className="flex items-center gap-3 mt-1 line-clamp-1">
                                    <p className=" font-medium  text-red-600">
                                      {formatPrice(
                                        priceData?.price.offer_price
                                      )}
                                    </p>
                                    <p className=" font-medium text-sm text-blue-600 line-through">
                                      {formatPrice(
                                        priceData?.price.regular_price || ""
                                      )}
                                    </p>
                                  </div>
                                ) : (
                                  <div className=" mt-1 line-clamp-1">
                                    <p className=" font-medium text-red-600">
                                      {formatPrice(
                                        priceData?.price.regular_price || ""
                                      )}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Separator />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
            <div className={cn("space-y-4 pr-6 ")}>
              <Separator />
              <div className="space-y-1.5 text-sm font-medium">
                <div className="flex">
                  <span className="flex-1">Order Total</span>
                  <span>{formatPrice(cartSummary?.total ?? 0)}</span>
                </div>
                <div className="flex text-green-500">
                  <span className="flex-1">Items Discount</span>
                  <span>- {formatPrice(cartSummary?.discount ?? 0)}</span>
                </div>
                <div className="flex ">
                  <span className="flex-1">Estimated VAT %</span>
                  <span>{formatPrice(cartSummary?.vat ?? 0)}</span>
                </div>
                <div className="flex ">
                  <span className="flex-1">Shipping</span>
                  <span>
                    {" "}
                    {cartSummary?.shipping_fee
                      ? formatPrice(cartSummary?.shipping_fee ?? 0)
                      : "FREE"}
                  </span>
                </div>
                <div className="flex ">
                  <span className="flex-1 ">
                    Total Amount (Inclusive of VAT)
                  </span>
                  <span className="text-blue-500">
                    {" "}
                    {formatPrice(cartSummary?.sub_total ?? 0)}
                  </span>
                </div>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    aria-label="View your cart"
                    href="/cart"
                    className={buttonVariants({
                      size: "sm",
                      className: "w-full",
                    })}
                  >
                    Continue to checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <Image
                src="/images/cart/empty-cart.png"
                fill
                alt="empty shopping cart hippo"
              />
            </div>
            <div className="text-2xl font-semibold">Your cart is empty</div>
            <SheetTrigger asChild>
              <Link
                href="/products"
                shallow
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "t text-blue-400",
                })}
              >
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
});
