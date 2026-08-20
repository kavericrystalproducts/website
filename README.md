# Kaveri Crystal Products — Final Static WhatsApp Checkout

## Final flow
Home → Best Sellers → Catalog → Product Page → Add to Cart → Checkout → **Place Order on WhatsApp**

No backend and no payment gateway.

### WhatsApp order
The customer enters their basic details and clicks Place Order on WhatsApp. WhatsApp opens with:
- Order ID
- Customer name
- WhatsApp number
- Email
- Products
- Selected weight/option
- Quantity
- Line totals
- Grand total

You handle payment and shipping manually in WhatsApp:
1. Send your UPI QR.
2. Customer pays.
3. Confirm payment.
4. Ask for shipping details.
5. Ship.
6. Send tracking ID.

### Configure your WhatsApp
In `assets/app.js`, change:
`WHATSAPP_NUMBER="917626999369"`

For India, use country code + number with no plus, spaces or hyphens, e.g.:
`WHATSAPP_NUMBER="917626999369"`

### Product pages
All 250 products use:
`product.html?id=PRODUCT_ID`

Relevant products have 100g, 200g, 500g and 1kg options. Products where weight does not make sense show product details instead.

### Hosting
Upload the complete folder to GitHub, enable GitHub Pages, then connect your GoDaddy domain using the DNS records shown by GitHub.

## Checkout address
The checkout collects house/street, area, city, state, PIN code and optional order notes, and all of these are included in the WhatsApp order message.


## Supplier image mapping
See `data/supplier-image-mapping.json` and `IMAGE-MAPPING-NOTES.md` for the supplier-catalog image mapping used for tumbles, rough stones, towers and chips.
