-- Sample data for staging environment
-- Wedding photography sample data

-- Sample tags
INSERT INTO public.tags (name, description)
VALUES 
  ('wedding', 'Wedding photography'),
  ('portrait', 'Portrait photography'),
  ('landscape', 'Landscape photography'),
  ('sample', 'Sample images for testing')
ON CONFLICT (name) DO NOTHING;

-- Sample images
INSERT INTO public.images (title, description, image_path, thumbnail_path, tags, is_premium, download_count, created_at)
VALUES 
  ('Sample Wedding Photo 1', 'A beautiful sample wedding photo', 'sample/wedding1.jpg', 'sample/thumbnails/wedding1.jpg', ARRAY['wedding', 'sample'], false, 0, NOW()),
  ('Sample Wedding Photo 2', 'Another beautiful sample wedding photo', 'sample/wedding2.jpg', 'sample/thumbnails/wedding2.jpg', ARRAY['wedding', 'sample'], false, 0, NOW()),
  ('Sample Portrait', 'A sample portrait photo', 'sample/portrait1.jpg', 'sample/thumbnails/portrait1.jpg', ARRAY['portrait', 'sample'], false, 0, NOW()),
  ('Premium Sample Photo', 'A premium sample photo', 'sample/premium1.jpg', 'sample/thumbnails/premium1.jpg', ARRAY['wedding', 'premium', 'sample'], true, 0, NOW())
ON CONFLICT DO NOTHING;

-- Sample users (for testing only)
INSERT INTO public.users (email, created_at, clerk_id)
VALUES 
  ('test@example.com', NOW(), 'test_clerk_id_1'),
  ('premium@example.com', NOW(), 'test_clerk_id_2')
ON CONFLICT DO NOTHING;

-- Give premium access to test user
INSERT INTO public.user_premium_access (user_id, purchased_at)
SELECT id, NOW() FROM public.users WHERE email = 'premium@example.com'
ON CONFLICT DO NOTHING; 