insert into public.categories (name, slug, image_url)
values ('Jewelry', 'jewelry', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338')
on conflict (slug) do update
set name = excluded.name,
    image_url = excluded.image_url;

insert into public.products (name, description, price, category, tags, images, stock, metadata)
select *
from (
  values
    (
      'Gold Heart Necklace',
      'Minimal heart pendant necklace in warm gold tone, ready for gifting.',
      99000,
      'jewelry',
      array['necklace','gold','girlfriend','romantic','gift'],
      array['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338'],
      24,
      '{"recipient":["girlfriend","wife"],"occasion":["anniversary","birthday"]}'::jsonb
    ),
    (
      'Pearl Drop Earrings',
      'Elegant pearl drop earrings for dinners, dates, and special occasions.',
      79000,
      'jewelry',
      array['earrings','pearl','mom','girlfriend','elegant'],
      array['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'],
      18,
      '{"recipient":["mom","girlfriend"],"occasion":["gift","celebration"]}'::jsonb
    ),
    (
      'Classic Bracelet Chain',
      'Clean everyday bracelet with adjustable chain and premium gift box.',
      69000,
      'jewelry',
      array['bracelet','gold','friend','minimal'],
      array['https://images.unsplash.com/photo-1611591437281-460bfbe1220a'],
      31,
      '{"recipient":["friend","girlfriend"],"occasion":["birthday"]}'::jsonb
    ),
    (
      'Couple Ring Set',
      'Simple matching ring set for couples who like understated details.',
      119000,
      'jewelry',
      array['ring','couple','romantic','anniversary'],
      array['https://images.unsplash.com/photo-1605100804763-247f67b3557e'],
      14,
      '{"recipient":["girlfriend","boyfriend"],"occasion":["anniversary"]}'::jsonb
    ),
    (
      'Initial Charm Pendant',
      'Personal initial charm pendant with a polished gold finish.',
      59000,
      'jewelry',
      array['pendant','initial','personal','gift'],
      array['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0'],
      27,
      '{"recipient":["friend","girlfriend","mom"],"occasion":["birthday","thank-you"]}'::jsonb
    )
) as new_products(name, description, price, category, tags, images, stock, metadata)
where not exists (
  select 1
  from public.products existing
  where existing.name = new_products.name
);
