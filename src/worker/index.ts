import { Hono } from "hono";
import { cors } from "hono/cors";

type CartItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

type CheckoutRequest = {
  cart: CartItem[];
  total: number;
};

type StripeLineItem = {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description: string;
    };
    unit_amount: number;
  };
  quantity: number;
};

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

app.get("/api/", (c) => c.json({ name: "Freelance IT Engineer", status: "online" }));

app.post("/api/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }

    console.log(`Contact form submission from ${name} (${email}): ${message}`);

    return c.json({ success: true, message: "Message received successfully" });
  } catch {
    return c.json({ success: false, error: "Invalid request body" }, 400);
  }
});

app.post("/api/checkout", async (c) => {
  try {
    const body = await c.req.json() as CheckoutRequest;
    const { cart, total } = body;

    if (!cart || !total) {
      return c.json({ success: false, error: "Missing cart or total" }, 400);
    }

    // Note: In production, use a secret key from environment
    // For now, this is a placeholder that should be configured via Cloudflare secrets
    const stripeKey = (c.env as Record<string, string>)?.STRIPE_SECRET_KEY || "";
    
    if (!stripeKey) {
      return c.json({ 
        success: false, 
        error: "Stripe not configured - contact administrator" 
      }, 500);
    }

    // Create line items from cart
    const lineItems: StripeLineItem[] = cart.map((item: CartItem) => ({
      price_data: {
        currency: "zar",
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe session
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[0]": "card",
        "line_items": JSON.stringify(lineItems),
        "mode": "payment",
        "success_url": `${c.req.header("origin")}/shop?success=true`,
        "cancel_url": `${c.req.header("origin")}/shop?cancelled=true`,
      }).toString(),
    });

    if (!response.ok) {
      console.error("Stripe error:", await response.text());
      return c.json({ success: false, error: "Failed to create checkout session" }, 500);
    }

    const session = await response.json() as Record<string, unknown>;
    return c.json({ sessionUrl: session.url, success: true });
  } catch (error) {
    console.error("Checkout error:", error);
    return c.json({ success: false, error: "Invalid request" }, 400);
  }
});

export default app;