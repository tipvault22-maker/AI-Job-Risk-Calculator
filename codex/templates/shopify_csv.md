Columns:
Handle,Title,Body (HTML),Vendor,Tags,Published,Option1 Name,Option1 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Image Src,Variant Requires Shipping

Rules:
- Vendor=TipVault22
- Tags include: {category}, fast-ship, jackpot (and weekly/best-seller when applicable)
- Prices end .99 or .95; Compare At = round(Price*1.5, 2)
- Inventory: Inventory Tracker=shopify, Qty=999, Policy=continue
- Physical: Variant Grams ≤ 1500, Variant Requires Shipping=TRUE
- Digital: Variant Grams=0, Variant Requires Shipping=FALSE
