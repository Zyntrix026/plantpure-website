import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Button } from "../../components/ui/button";

function CartDrawer() {
  const { items, isOpen, setOpen, setQty, remove, subtotal } = useCart();
  const navigate = useNavigate();
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border px-8 py-6">
          <SheetTitle className="font-serif text-2xl">Your Bag</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center">
              <ShoppingBag
                className="size-10 text-foreground/30"
                strokeWidth={1.25}
              />
              <p className="mt-6 font-serif text-xl">Your bag is empty</p>
              <p className="mt-2 text-sm text-foreground/50">
                Discover our botanical rituals.
              </p>
              <Button
                onClick={() => setOpen(false)}
                className="mt-8 rounded-full bg-foreground px-8 text-[11px] uppercase tracking-[0.2em] text-background hover:bg-[var(--sage)] hover:text-[var(--forest-deep)]"
              >
                Start shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-7">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="grid grid-cols-[88px_minmax(0,1fr)] gap-5"
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-card">
                    <img
                      src={i.image}
                      alt={i.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="truncate font-serif text-base">
                        {i.name}
                      </h4>
                      <button
                        onClick={() => remove(i.id)}
                        aria-label={`Remove ${i.name}`}
                        className="shrink-0 text-foreground/40 hover:text-[var(--terracotta)]"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs italic text-foreground/50">
                      {i.tagline}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-foreground/15">
                        <button
                          onClick={() => setQty(i.id, i.qty - 1)}
                          className="grid size-8 place-items-center text-foreground/70 hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{i.qty}</span>
                        <button
                          onClick={() => setQty(i.id, i.qty + 1)}
                          className="grid size-8 place-items-center text-foreground/70 hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="text-sm font-medium">
                        ₹{(i.price * i.qty).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border px-8 py-6">
            <div className="mb-5 flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                Subtotal
              </span>
              <span className="font-serif text-2xl">
                ₹{subtotal.toFixed(0)}
              </span>
            </div>
            <Button
              onClick={() => navigate("/checkout")}
              className="h-12 w-full rounded-full bg-foreground text-[11px] uppercase tracking-[0.2em] text-background hover:bg-[var(--sage)] hover:text-[var(--forest-deep)]"
            >
              Begin Checkout
            </Button>
            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-foreground/40">
              Free shipping on orders over ₹2000
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;