-- ============================================================
-- SIH 2026 | IET DDUGU — Development Seed Data
-- Run after schema.sql for local testing
-- ============================================================

-- Sample announcements
INSERT INTO announcements (type, message, pinned, urgent, published, internal_name) VALUES
  ('announcement', 'Welcome to SIH 2026 at IET DDUGU! Registration will open soon. Stay tuned for updates.', true, false, true, 'Arpit'),
  ('announcement', 'All team leaders must submit their project abstracts by the deadline. Check the schedule section for details.', false, true, true, 'Rahul'),
  ('announcement', 'Mentoring sessions will be conducted in the CS department lab. Bring your laptops.', false, false, true, 'Arpit');

-- Sample schedule entries
INSERT INTO announcements (type, message, pinned, urgent, published, internal_name) VALUES
  ('schedule', 'Team registration opens — submit your team details through the official SIH portal.', false, false, true, 'Rahul'),
  ('schedule', 'Internal hackathon round at IET DDUGU campus. Venue: Main Auditorium, 9:00 AM.', false, true, true, 'Arpit');

-- Sample timeline entries
INSERT INTO timeline (title, description, event_date, event_time, display_order, visible) VALUES
  ('Registration Opens', 'Team registration begins on the SIH portal', '2026-08-01', '09:00', 1, true),
  ('Abstract Submission', 'Submit project abstracts for review', '2026-08-15', '23:59', 2, true),
  ('Internal Hackathon', 'Campus-level hackathon round at IET DDUGU', '2026-09-01', '09:00', 3, true),
  ('Grand Finale', 'National level SIH 2026 grand finale', '2026-10-15', NULL, 4, true);

-- Sample contacts
INSERT INTO contacts (name, phone, email, visible, display_order) VALUES
  ('Arpit Singh', '+919876543210', 'arpit@ietddugu.ac.in', true, 1),
  ('Rahul Kumar', '+919876543211', 'rahul@ietddugu.ac.in', true, 2),
  ('Priya Sharma', '+919876543212', 'priya@ietddugu.ac.in', true, 3);

-- Update settings with sample data
UPDATE settings SET value = 'Smart India Hackathon (SIH) is a nationwide initiative to provide students with a platform to solve pressing problems we face in our daily lives. IET DDUGU is proud to participate in SIH 2026 and invites all students to be part of this transformative journey.', updated_by = 'Arpit' WHERE key = 'about_content';
UPDATE settings SET value = 'https://chat.whatsapp.com/example', updated_by = 'Arpit' WHERE key = 'whatsapp_link';
UPDATE settings SET value = 'true', updated_by = 'Arpit' WHERE key = 'whatsapp_enabled';
