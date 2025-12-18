
-- db/seed.sql
INSERT INTO users (email, name) VALUES
('demo@finalogica.local', 'Demo User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO species (common_name, scientific_name, label_key, notes) VALUES
('Tench', 'Tinca tinca', 'tench', 'Freshwater, popular in Europe.'),
('Goldfish', 'Carassius auratus', 'goldfish', 'Freshwater, common pet.'),
('Great White Shark', 'Carcharodon carcharias', 'great_white_shark', 'Saltwater, apex predator.'),
('Sturgeon', 'Acipenser sturio', 'sturgeon', 'Anadromous, source of caviar.'),
('Clownfish', 'Amphiprion ocellaris', 'anemone_fish', 'Saltwater, lives in anemones.'),
('Coho Salmon', 'Oncorhynchus kisutch', 'coho', 'Anadromous, silver salmon.'),
('Barracuda', 'Sphyraena', 'barracuda', 'Saltwater, predatory fish.'),
('Gar', 'Lepisosteidae', 'gar', 'Freshwater, ancient ray-finned fish.'),
('Lionfish', 'Pterois', 'lionfish', 'Saltwater, invasive species.'),
('Pufferfish', 'Tetraodontidae', 'puffer', 'Saltwater, can inflate body.')
ON CONFLICT (label_key) DO NOTHING;
