insert into public.categories (name, slug, image_url) values
  ('Electronics', 'electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661'),
  ('Clothing', 'clothing', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f'),
  ('Cosmetics', 'cosmetics', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9'),
  ('Food', 'food', 'https://images.unsplash.com/photo-1542838132-92c53300491e'),
  ('Home Decor', 'home-decor', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38'),
  ('Books', 'books', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f'),
  ('Toys', 'toys', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7')
on conflict (slug) do nothing;

insert into public.products (name, description, price, category, tags, images, stock, metadata) values
('Crystal Clear Phone Case', 'Durable transparent case with raised edges for daily protection.', 29000, 'electronics', array['clear case','phone','tech','gift'], array['https://images.unsplash.com/photo-1603313011101-320f26a4f6f6'], 42, '{"recipient":["friend","girlfriend"],"occasion":["birthday"]}'),
('Wireless Earbuds Mini', 'Compact earbuds with clear calls and pocket charging case.', 89000, 'electronics', array['earbuds','music','tech'], array['https://images.unsplash.com/photo-1590658268037-6bf12165a8df'], 30, '{"recipient":["dad","friend"]}'),
('Smart LED Desk Lamp', 'Adjustable warm and cool light for reading, work, and night ambience.', 79000, 'electronics', array['lamp','study','home office'], array['https://images.unsplash.com/photo-1507473885765-e6ed057f782c'], 24, '{}'),
('Portable Power Bank 10000mAh', 'Slim power bank for travel, school, and busy commutes.', 65000, 'electronics', array['power bank','travel','practical'], array['https://images.unsplash.com/photo-1609592424857-26acec92644f'], 50, '{}'),
('Bluetooth Speaker Pebble', 'Soft-touch speaker with warm sound and splash resistance.', 99000, 'electronics', array['speaker','music','party'], array['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1'], 18, '{}'),
('Digital Photo Frame', 'Wi-Fi frame for family photos and memory slideshows.', 185000, 'electronics', array['family','photo','mom','dad'], array['https://images.unsplash.com/photo-1516321318423-f06f85e504b3'], 12, '{}'),
('Kindle-Style E Reader Light', 'Lightweight reader for books, notes, and long trips.', 210000, 'electronics', array['reader','books','travel'], array['https://images.unsplash.com/photo-1512820790803-83ca734da794'], 9, '{}'),
('Mini Thermal Photo Printer', 'Pocket printer for instant memories, labels, and scrapbook gifts.', 119000, 'electronics', array['photo','printer','cute'], array['https://images.unsplash.com/photo-1515879218367-8466d910aaa4'], 15, '{}'),

('Cashmere Blend Scarf', 'Soft scarf in calm neutral colors for cold Ulaanbaatar days.', 75000, 'clothing', array['scarf','winter','mom','dad'], array['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9'], 35, '{}'),
('Minimal Beanie', 'Warm rib-knit beanie with a clean everyday silhouette.', 35000, 'clothing', array['beanie','winter','friend'], array['https://images.unsplash.com/photo-1516762689617-e1cffcef479d'], 44, '{}'),
('Silk Hair Scrunchie Set', 'Gentle satin-finish scrunchies in gift-ready colors.', 22000, 'clothing', array['hair','girlfriend','cute'], array['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e'], 60, '{}'),
('Oversized Hoodie', 'Cozy cotton hoodie with relaxed fit and soft fleece lining.', 125000, 'clothing', array['hoodie','cozy','friend'], array['https://images.unsplash.com/photo-1556821840-3a63f95609a7'], 19, '{}'),
('Leather Card Holder', 'Slim card holder with premium stitching and boxed packaging.', 69000, 'clothing', array['wallet','dad','boyfriend'], array['https://images.unsplash.com/photo-1627123424574-724758594e93'], 27, '{}'),
('Warm Touch Gloves', 'Touchscreen-compatible gloves with a soft wool blend.', 39000, 'clothing', array['gloves','winter','practical'], array['https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5'], 38, '{}'),
('Linen Sleep Mask', 'Breathable sleep mask for better rest and travel comfort.', 28000, 'clothing', array['sleep','travel','self care'], array['https://images.unsplash.com/photo-1540555700478-4be289fbecef'], 41, '{}'),

('Rose Glow Lip Set', 'Three flattering lip shades in a small gift box.', 49000, 'cosmetics', array['lipstick','girlfriend','mom'], array['https://images.unsplash.com/photo-1586495777744-4413f21062fa'], 36, '{}'),
('Hydrating Sheet Mask Box', 'Ten calming masks for an easy spa night at home.', 32000, 'cosmetics', array['mask','spa','self care'], array['https://images.unsplash.com/photo-1596755389378-c31d21fd1273'], 80, '{}'),
('Vanilla Hand Cream Trio', 'Pocket hand creams with soft vanilla, rose, and citrus notes.', 27000, 'cosmetics', array['hand cream','cute','budget'], array['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc'], 74, '{}'),
('Signature Perfume 30ml', 'Elegant floral musk perfume for a memorable personal gift.', 145000, 'cosmetics', array['perfume','girlfriend','romantic'], array['https://images.unsplash.com/photo-1541643600914-78b084683601'], 16, '{}'),
('Men Grooming Kit', 'Beard oil, face wash, and travel comb in a clean pouch.', 88000, 'cosmetics', array['dad','boyfriend','grooming'], array['https://images.unsplash.com/photo-1621607512214-68297480165e'], 22, '{}'),
('Makeup Brush Travel Set', 'Compact brush set for daily makeup and travel bags.', 59000, 'cosmetics', array['makeup','travel','girlfriend'], array['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9'], 28, '{}'),
('Lavender Bath Salt Jar', 'Relaxing bath salt with lavender oil and reusable glass jar.', 24000, 'cosmetics', array['bath','relax','mom'], array['https://images.unsplash.com/photo-1540555700478-4be289fbecef'], 46, '{}'),

('Artisan Chocolate Box', 'Assorted dark, milk, and berry chocolates in premium wrapping.', 42000, 'food', array['chocolate','birthday','mom'], array['https://images.unsplash.com/photo-1549007994-cb92caebd54b'], 55, '{}'),
('Honey Sampler Trio', 'Wildflower, buckwheat, and herb honey jars from Mongolia.', 38000, 'food', array['honey','local','dad'], array['https://images.unsplash.com/photo-1587049352846-4a222e784d38'], 33, '{}'),
('Premium Tea Ceremony Set', 'Loose-leaf tea selection with an infuser and keepsake tin.', 68000, 'food', array['tea','mom','calm'], array['https://images.unsplash.com/photo-1544787219-7f47ccb76574'], 30, '{}'),
('Cookie Gift Tin', 'Butter cookies, almond crisps, and chocolate bites in a metal tin.', 33000, 'food', array['cookies','office','friend'], array['https://images.unsplash.com/photo-1499636136210-6f4ee915583e'], 49, '{}'),
('Coffee Lover Bundle', 'Fresh beans, filter packs, and a tasting card for coffee people.', 72000, 'food', array['coffee','dad','friend'], array['https://images.unsplash.com/photo-1447933601403-0c6688de566e'], 26, '{}'),
('Korean Snack Box', 'Sweet, spicy, and crunchy snack mix for movie nights.', 45000, 'food', array['snacks','friend','fun'], array['https://images.unsplash.com/photo-1621939514649-280e2ee25f60'], 31, '{}'),
('Fruit Arrangement Basket', 'Fresh seasonal fruit arranged for family visits and thank-yous.', 89000, 'food', array['fruit','family','healthy'], array['https://images.unsplash.com/photo-1610832958506-aa56368176cf'], 12, '{}'),

('Soy Candle Amber', 'Long-burning amber candle with a warm evening scent.', 39000, 'home-decor', array['candle','home','romantic'], array['https://images.unsplash.com/photo-1602874801006-e26c6694b1d6'], 52, '{}'),
('Ceramic Mug Pair', 'Two handmade-look mugs for tea, coffee, and cozy mornings.', 44000, 'home-decor', array['mug','couple','home'], array['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d'], 37, '{}'),
('Minimal Flower Vase', 'Matte ceramic vase that looks beautiful with fresh or dried flowers.', 58000, 'home-decor', array['vase','mom','decor'], array['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c'], 21, '{}'),
('Moon Night Light', 'Soft bedside lamp for dreamy bedrooms and gentle sleep routines.', 52000, 'home-decor', array['night light','kids','girlfriend'], array['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15'], 25, '{}'),
('Framed Ulaanbaatar Print', 'Minimal city print ready to hang in an apartment or office.', 65000, 'home-decor', array['art','local','home'], array['https://images.unsplash.com/photo-1518005020951-eccb494ad742'], 17, '{}'),
('Aroma Diffuser Stone', 'Quiet diffuser with soft mist and natural stone texture.', 89000, 'home-decor', array['diffuser','wellness','mom'], array['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108'], 18, '{}'),
('Desk Plant Set', 'Low-maintenance plant set with ceramic pots for a brighter desk.', 56000, 'home-decor', array['plant','office','friend'], array['https://images.unsplash.com/photo-1485955900006-10f4d324d411'], 20, '{}'),

('Mongolian Poetry Collection', 'A beautiful hardcover poetry collection for thoughtful readers.', 37000, 'books', array['poetry','mongolian','mom'], array['https://images.unsplash.com/photo-1544947950-fa07a98d237f'], 40, '{}'),
('Personal Finance Starter Book', 'Clear money habits and planning advice for young adults.', 29000, 'books', array['finance','dad','practical'], array['https://images.unsplash.com/photo-1589829085413-56de8ae18c73'], 34, '{}'),
('Mindful Journal', 'Guided prompts for gratitude, goals, and quiet daily reflection.', 32000, 'books', array['journal','self care','girlfriend'], array['https://images.unsplash.com/photo-1517842645767-c639042777db'], 58, '{}'),
('Fantasy Novel Box Set', 'Three immersive novels for weekend reading and escape.', 96000, 'books', array['fantasy','teen','friend'], array['https://images.unsplash.com/photo-1516979187457-637abb4f9353'], 14, '{}'),
('Cookbook for Two', 'Simple dinners, desserts, and celebration meals for two people.', 48000, 'books', array['cookbook','couple','home'], array['https://images.unsplash.com/photo-1589998059171-988d887df646'], 23, '{}'),
('Kids Picture Book Bundle', 'Colorful stories for early readers and bedtime routines.', 42000, 'books', array['kids','family','birthday'], array['https://images.unsplash.com/photo-1512820790803-83ca734da794'], 29, '{}'),
('Design Desk Calendar', 'Monthly calendar with illustrated cards and writable dates.', 25000, 'books', array['calendar','office','budget'], array['https://images.unsplash.com/photo-1506784365847-bbad939e9335'], 61, '{}'),

('Wooden Puzzle Cube', 'Tactile puzzle cube for curious kids and desk-break thinkers.', 26000, 'toys', array['puzzle','kids','brain'], array['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1'], 45, '{}'),
('Plush Bear Classic', 'Soft plush bear with ribbon and gift bag packaging.', 34000, 'toys', array['plush','cute','girlfriend'], array['https://images.unsplash.com/photo-1559454403-b8fb88521f11'], 40, '{}'),
('Mini Building Blocks Set', 'Creative blocks for ages 6+ with colorful tiny builds.', 49000, 'toys', array['blocks','kids','creative'], array['https://images.unsplash.com/photo-1587654780291-39c9404d746b'], 32, '{}'),
('Board Game Night Pack', 'Fast family board game with simple rules and replay value.', 69000, 'toys', array['board game','family','friend'], array['https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09'], 20, '{}'),
('Remote Control Mini Car', 'Rechargeable mini car for indoor racing and playful breaks.', 59000, 'toys', array['car','kids','fun'], array['https://images.unsplash.com/photo-1594736797933-d0401ba2fe65'], 24, '{}'),
('DIY Bracelet Kit', 'Colorful beads and charms for handmade friendship bracelets.', 31000, 'toys', array['craft','friend','kids'], array['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338'], 53, '{}'),
('Science Experiment Box', 'Safe home experiments with cards, tools, and discovery prompts.', 74000, 'toys', array['science','kids','learning'], array['https://images.unsplash.com/photo-1532094349884-543bc11b234d'], 18, '{}')
on conflict do nothing;
