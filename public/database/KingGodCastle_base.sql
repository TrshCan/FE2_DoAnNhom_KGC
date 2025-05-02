CREATE DATABASE IF NOT EXISTS `KingGodCastle` DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_general_ci;

USE `KingGodCastle`;

-- USERS
CREATE TABLE
  users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    role ENUM ('user', 'admin') DEFAULT 'user'
  );

INSERT INTO
  users (email, password, username, role)
VALUES
  (
    'alice@example.com',
    'securepassword123',
    'alice_wonder',
    'user'
  ),
  ('admin@email.com', 'root', 'bob_builder', 'admin'),
  (
    'charlie@example.com',
    'randompass789',
    'charlie_chap',
    'user'
  );

-- HEROES
CREATE TABLE
  classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
  );

INSERT INTO
  classes (name, description)
VALUES
  (
    'Swiftness',
    'Masters of agility and precision, the Swiftness class dances through battle with unparalleled speed. Their fluid movements make them nearly untouchable, striking foes with deadly accuracy before vanishing from sight.'
  ),
  (
    'Mystique',
    'Enigmatic wielders of arcane power, the Mystique class commands ancient magic and mesmerizing illusions. Their unpredictable spells confound enemies, turning the tide of battle with otherworldly finesse.'
  ),
  (
    'Courage',
    'Unyielding champions of valor, the Courage class charges fearlessly into the fray, igniting the hearts of allies. Their bold presence inspires unwavering resolve, rallying comrades to triumph against all odds.'
  ),
  (
    'Tenacity',
    'Indomitable guardians of endurance, the Tenacity class stands firm through any ordeal, shielding allies with unshakable resolve. Their relentless spirit transforms hardship into unbreakable strength.'
  ),
  (
    'Shadow',
    'Elusive predators of the night, the Shadow class strikes from the darkness with lethal precision. Masters of stealth and deception, they sow fear in their enemies, vanishing before retaliation can strike.'
  ),
  (
    'Element',
    'Commanders of nature’s fury, the Element class channels the primal forces of fire, water, wind, and earth. Their dynamic assaults shift like the tides, overwhelming foes with the raw power of the elements.'
  );

CREATE TABLE
  regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
  );

INSERT INTO
  regions (name, description)
VALUES
  (
    'South',
    'A sun-drenched realm of vibrant landscapes, the South pulses with fiery passion and untamed beauty. Its sprawling deserts and lush jungles teem with life, challenging adventurers with trials of endurance and discovery.'
  ),
  (
    'North',
    'A frost-kissed expanse of rugged majesty, the North stands resolute under towering peaks and endless skies. Its icy winds carry tales of ancient heroes, beckoning the brave to carve their own legends.'
  ),
  (
    'East',
    'A land of dawn’s first light, the East shimmers with mystic allure and boundless opportunity. Its serene valleys and windswept cliffs hide secrets of forgotten lore, awaiting those bold enough to seek them.'
  ),
  (
    'West',
    'A frontier of untamed horizons, the West roars with the spirit of exploration and conquest. Its golden plains and stormy coasts promise riches and peril, forging heroes in the crucible of adventure.'
  ),
  (
    'Central',
    'The beating heart of the world, the Central region thrives with harmony and unrelenting vitality. Its rolling hills and radiant cities unite diverse cultures, offering a crucible for epic tales and grand destinies.'
  );

CREATE TABLE
  heroes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region_id INT,
    class_id INT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    FOREIGN KEY (region_id) REFERENCES regions (id) ON DELETE SET NULL,
    FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE SET NULL
  );

INSERT INTO
  heroes (name, region_id, class_id, title, description)
VALUES
  (
    'Luniare',
    2,
    2,
    'Blue Moonlight',
    'Coming form the north where the Blue Moon rises, Luniare endlessly yearned for the Moon that rose every night, coming to harness its beauty to bless others.'
  ),
  (
    'Shelda',
    5,
    4,
    'Shield of Knights',
    'Shelda always stands against enemies at the front line of the battlefield to honor her father, a legendary war hero.'
  ),
  (
    'Evan',
    5,
    3,
    'Sword of Valor',
    'Evan, a talented swordman and tactician, ascended to the position of Knight Commander at such a tender age.'
  ),
  (
    'Draco',
    4,
    6,
    'Half-Dragon',
    'Born between a dragon and a human, Draco cannot wield the full power of a dragon, but his might is still quite formidable.'
  ),
  (
    'Neria',
    2,
    5,
    'Hunter of the Red Moon',
    'Neria is the leader of a secret sect called Red Moon, a group that seeks the root of the Curse of the Black Blood that spread throughout the world. After losing her kin to the cursed ones, she lives to eliminate the dark-blooded beings to the last of their kind.'
  );

-- HERO SKILLS
CREATE TABLE
  hero_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hero_id INT NOT NULL,
    name VARCHAR(100),
    description TEXT,
    type ENUM ('passive', 'awakening', 'ultimate'),
    FOREIGN KEY (hero_id) REFERENCES heroes (id) ON DELETE CASCADE
  );

INSERT INTO
  hero_skills (hero_id, name, description, type)
VALUES
  -- Luniare (hero_id = 1, North, Mystique)
  (
    1,
    'Lunar Aegis',
    '<Blessing of the Blue Moon> grants 1 Mighty Block to the target.',
    'passive'
  ),
  (
    1,
    'Moonlit Resilience',
    'After the end of <Blessing of the Blue Moon>, buff remains for an additional 2 turns.',
    'passive'
  ),
  (
    1,
    'Swift Blessing',
    "Luniare recovers 100% MP if the target's is after Luniare at the begining of the battle. +20% Movement Speed on the target of <Blessing of the Blue Moon>.",
    'awakening'
  ),
  (
    1,
    'Protection of the Moon',
    'No longer grants Protection when <Blessing of the Blue Moon> is cast. +2 Mighty Blocks to the target of <Blessing of the Blue Moon>',
    'awakening'
  ),
  (
    1,
    'Blessing of the Blue Moon',
    "Concentrates for 5 turns, granting 15/60/120/250+SP Protection to the linked target and giving 90/100/110/120% of ATK and Spell Power converted into the target hero's base stats.",
    'ultimate'
  ),
  -- Shelda (hero_id = 2, Central, Tenacity)
  (
    2,
    'Knight’s Bulwark',
    '+50% For all obtained Protection.',
    'passive'
  ),
  (
    2,
    'Defiant Stand',
    ' -20 MP Cost of <Iron Will>.',
    'passive'
  ),
  (
    2,
    'Absolute Will',
    "Obtains 2-8 Mighty Blocks when using <Iron Will>. (can't be stacked)",
    'awakening'
  ),
  (
    2,
    'Explosive Will',
    'Consumes current Protection when using <Iron Will>. Upon consuming/depleting Protection, deals spell skill damage equal to consuming/depleting Protection + 50% of Spell power to all enemies',
    'awakening'
  ),
  (
    2,
    'Iron Will',
    'Generates 30/120/250/700 + SP Protection upon herself with her willpower.',
    'ultimate'
  ),
  -- Evan (hero_id = 3, Central, Courage)
  (
    3,
    'Valiant Strike',
    'Recover 100% of MP at the start of the battle',
    'passive'
  ),
  (
    3,
    'Tactician’s Edge',
    '+40% Spell Power',
    'passive'
  ),
  (
    3,
    'Wave Slash',
    '+20% final damage of <Crescent Slash> for each enemy hit by <Crescent Slash> (max +100%)',
    'awakening'
  ),
  (
    3,
    'Unleash Sword Aura',
    'Emits aura with his sword that deals spell normal damage equal to 30% of Spell Power to enemies next to target on normal attacks',
    'awakening'
  ),
  (
    3,
    'Crescent Slash',
    'Unleash a piercing aura with his sword, dealing 20/35/50/65+ SP damage to 3 enemies in front of him.',
    'ultimate'
  ),
  -- Draco (hero_id = 4, West, Element)
  (
    4,
    'Drake’s Flame',
    'When all targets of <Flamebreath> are killed, MP is returned in proportion to the remaining skill damage count',
    'passive'
  ),
  (
    4,
    'Stormfang Slash',
    'Drain +50% of the Spell Power damage as HP',
    'passive'
  ),
  (
    4,
    'Ignite',
    'Gradually increases final damage of <Flamebreath> by 15% while target is on it for every turn (max 135%)',
    'awakening'
  ),
  (
    4,
    'Concentrated Flame',
    "-45 MP Cost and +70% Spell Power for <Flamebreath>. Total turn of <Flamebreath> is reduced to 4 and can't be stacked",
    'awakening'
  ),
  (
    4,
    'Flamebreath',
    'Breathes out flame, dealing 10 + 60% SP damage to all enemies in front of him once for 10 turns.',
    'ultimate'
  ),
  -- Neria (hero_id = 5, North, Shadow)
  (
    5,
    'Crimson Fang',
    '+1% final damage per 1% HP lost by target of <Annihilation Time> (max +60%)',
    'passive'
  ),
  (
    5,
    'Bloodseeker’s Mark',
    '+1% final damage dealt by <Annihilation Time> for every 3% Attack Speed that exceeds 100% (max +50%)',
    'passive'
  ),
  (
    5,
    ' Everlasting Night',
    '+1 attack count of <Annihilation Time> that is being cast when a target is killed by the skill (max 3)',
    'awakening'
  ),
  (
    5,
    'Shroud of Night',
    'Hides for 2 round when using <Annihilation Time>, becoming untargetable to attacks for the duration',
    'awakening'
  ),
  (
    5,
    'Annihilation Time',
    "For the next 4 rounds, shoots enhanced arrows that deal (450+SP/10)% of ATK. During <Annihilation Time>, Neria's Movement Speed is fixed to 100.",
    'ultimate'
  );

-- HERO BASE STATS
CREATE TABLE
  hero_base_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hero_id INT NOT NULL,
    ATK INT DEFAULT 0, -- Attack Power
    Spell INT DEFAULT 0, -- Spell Power
    ATK_SPEED DECIMAL(5, 2) DEFAULT 1.0, -- Attack Speed
    MP INT DEFAULT 0, -- Mana Points
    HP INT DEFAULT 0, -- Hit Points
    Damage_Dealt INT DEFAULT 0, -- Total Damage Dealt
    Normal_Attack_Amplification DECIMAL(5, 2) DEFAULT 1.0, -- Boost to normal attacks
    Skill_Amplification DECIMAL(5, 2) DEFAULT 1.0, -- Boost to skills
    Special_Damage INT DEFAULT 0, -- Additional special damage
    Physical_CRIT_Damage DECIMAL(5, 2) DEFAULT 1.5, -- Critical Hit Damage (Physical)
    Spell_CRIT_Damage DECIMAL(5, 2) DEFAULT 1.5, -- Critical Hit Damage (Spell)
    Physical_CRIT_Chance DECIMAL(5, 2) DEFAULT 0.05, -- Chance to Crit (Physical) (0 to 1)
    Spell_CRIT_Chance DECIMAL(5, 2) DEFAULT 0.05, -- Chance to Crit (Spell) (0 to 1)
    Physical_DEF INT DEFAULT 0, -- Physical Defense
    Spell_DEF INT DEFAULT 0, -- Spell Defense
    Mighty_Block INT DEFAULT 0, -- Chance to block damage
    Damage_Taken INT DEFAULT 0, -- Total Damage Taken
    EVA DECIMAL(5, 2) DEFAULT 0.05, -- Evasion Chance (0 to 1)
    Outgoing_Healing INT DEFAULT 0, -- Healing Output
    Guard INT DEFAULT 0, -- Guard Strength
    Physical_HP_Drain DECIMAL(5, 2) DEFAULT 0.0, -- Percentage of physical damage converted to HP
    Spell_HP_Drain DECIMAL(5, 2) DEFAULT 0.0, -- Percentage of spell damage converted to HP
    Execution_Rate DECIMAL(5, 2) DEFAULT 0.0, -- Chance to execute low-HP enemies (0 to 1)
    FOREIGN KEY (hero_id) REFERENCES heroes (id) ON DELETE CASCADE
  );

INSERT INTO
  hero_base_stats (
    hero_id,
    ATK,
    Spell,
    ATK_SPEED,
    MP,
    HP,
    Damage_Dealt,
    Normal_Attack_Amplification,
    Skill_Amplification,
    Special_Damage,
    Physical_CRIT_Damage,
    Spell_CRIT_Damage,
    Physical_CRIT_Chance,
    Spell_CRIT_Chance,
    Physical_DEF,
    Spell_DEF,
    Mighty_Block,
    Damage_Taken,
    EVA,
    Outgoing_Healing,
    Guard,
    Physical_HP_Drain,
    Spell_HP_Drain,
    Execution_Rate
  )
VALUES
  -- Luniare (hero_id = 1, North, Mystique): Spell-based healer/support
  (
    1,
    40,
    100,
    0.8,
    140,
    350,
    1,
    0.0,
    0.0,
    1,
    1.5,
    1.5,
    0.0,
    0.0,
    0,
    0,
    5,
    1,
    0.0,
    1,
    0,
    0.0,
    0.0,
    0.0
  ),
  -- Shelda (hero_id = 2, Central, Tenacity): Defensive tank
  (
    2,
    60,
    20,
    0.6,
    70,
    750,
    1,
    0.0,
    0.0,
    1,
    1.5,
    1.5,
    0.0,
    0.0,
    0,
    0,
    25,
    1,
    0.0,
    1,
    0,
    0.0,
    0.0,
    0.0
  ),
  -- Evan (hero_id = 3, Central, Courage): Melee DPS/leader
  (
    3,
    90,
    30,
    1.2,
    90,
    450,
    1,
    0.0,
    0.0,
    1,
    1.5,
    1.5,
    0.0,
    0.0,
    0,
    0,
    10,
    1,
    0.0,
    1,
    0,
    0.0,
    0.0,
    0.0
  ),
  -- Draco (hero_id = 4, West, Element): Hybrid bruiser
  (
    4,
    80,
    70,
    0.9,
    110,
    550,
    1,
    0.0,
    0.0,
    1,
    1.5,
    1.5,
    0.0,
    0.0,
    0,
    0,
    15,
    1,
    0.0,
    1,
    0,
    0.0,
    0.0,
    0.0
  ),
  -- Neria (hero_id = 5, North, Shadow): Stealthy assassin
  (
    5,
    100,
    10,
    1.1,
    80,
    400,
    1,
    0.0,
    0.0,
    1,
    1.5,
    1.5,
    0.0,
    0.0,
    0,
    0,
    5,
    1,
    0.0,
    1,
    0,
    0.0,
    0.0,
    0.0
  );

-- USER-HERO OWNERSHIP
CREATE TABLE
  user_heroes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hero_id INT NOT NULL,
    level INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (hero_id) REFERENCES heroes (id) ON DELETE CASCADE
  );

INSERT INTO
  user_heroes (user_id, hero_id, level)
VALUES
  -- User 1: A seasoned player with a balanced roster
  (1, 1, 3), -- Luniare (Mystique, North), level 3, weaving moonlight blessings
  (1, 2, 2), -- Shelda (Tenacity, Central), level 2, standing as an unyielding shield
  (1, 4, 4), -- Draco (Element, West), level 4, unleashing draconic fury
  -- User 2: A new player focusing on offense
  (2, 3, 1), -- Evan (Courage, Central), level 1, a rising swordsman
  (2, 5, 2), -- Neria (Shadow, North), level 2, hunting under the Red Moon
  -- User 3: A strategic player with a healer and tank
  (3, 1, 2), -- Luniare (Mystique, North), level 2, supporting with lunar grace
  (3, 2, 3), -- Shelda (Tenacity, Central), level 3, anchoring the battlefield
  (3, 5, 1);

-- Neria (Shadow, North), level 1, striking from the shadows
-- USER HERO STATS (UPGRADABLE)
CREATE TABLE
  user_hero_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_hero_id INT NOT NULL,
    ATK INT DEFAULT 0, -- Attack Power
    Spell INT DEFAULT 0, -- Spell Power
    ATK_SPEED DECIMAL(5, 2) DEFAULT 1.0, -- Attack Speed
    MP INT DEFAULT 0, -- Mana Points
    HP INT DEFAULT 0, -- Hit Points
    Damage_Dealt INT DEFAULT 0, -- Total Damage Dealt
    Normal_Attack_Amplification DECIMAL(5, 2) DEFAULT 1.0, -- Boost to normal attacks
    Skill_Amplification DECIMAL(5, 2) DEFAULT 1.0, -- Boost to skills
    Special_Damage INT DEFAULT 0, -- Additional special damage
    Physical_CRIT_Damage DECIMAL(5, 2) DEFAULT 1.5, -- Critical Hit Damage (Physical)
    Spell_CRIT_Damage DECIMAL(5, 2) DEFAULT 1.5, -- Critical Hit Damage (Spell)
    Physical_CRIT_Chance DECIMAL(5, 2) DEFAULT 0.05, -- Chance to Crit (Physical) (0 to 1)
    Spell_CRIT_Chance DECIMAL(5, 2) DEFAULT 0.05, -- Chance to Crit (Spell) (0 to 1)
    Physical_DEF INT DEFAULT 0, -- Physical Defense
    Spell_DEF INT DEFAULT 0, -- Spell Defense
    Mighty_Block INT DEFAULT 0, -- Chance to block damage
    Damage_Taken INT DEFAULT 0, -- Total Damage Taken
    EVA DECIMAL(5, 2) DEFAULT 0.05, -- Evasion Chance (0 to 1)
    Outgoing_Healing INT DEFAULT 0, -- Healing Output
    Guard INT DEFAULT 0, -- Guard Strength
    Physical_HP_Drain DECIMAL(5, 2) DEFAULT 0.0, -- Percentage of physical damage converted to HP
    Spell_HP_Drain DECIMAL(5, 2) DEFAULT 0.0, -- Percentage of spell damage converted to HP
    Execution_Rate DECIMAL(5, 2) DEFAULT 0.0, -- Chance to execute low-HP enemies (0 to 1)
    FOREIGN KEY (user_hero_id) REFERENCES user_heroes (id) ON DELETE CASCADE
  );

INSERT INTO
  user_hero_stats (
    user_hero_id,
    ATK,
    Spell,
    ATK_SPEED,
    MP,
    HP,
    Damage_Dealt,
    Normal_Attack_Amplification,
    Skill_Amplification,
    Special_Damage,
    Physical_CRIT_Damage,
    Spell_CRIT_Damage,
    Physical_CRIT_Chance,
    Spell_CRIT_Chance,
    Physical_DEF,
    Spell_DEF,
    Mighty_Block,
    Damage_Taken,
    EVA,
    Outgoing_Healing,
    Guard,
    Physical_HP_Drain,
    Spell_HP_Drain,
    Execution_Rate
  )
VALUES
  -- Luniare (hero_id = 1, North, Mystique): Spell-based healer/support
  (
    1,
    40,
    100,
    0.8,
    140,
    350,
    1,
    0.0,
    0.0,
    1,
    1.5,
    1.5,
    0.0,
    0.0,
    0,
    0,
    5,
    1,
    0.0,
    1,
    0,
    0.0,
    0.0,
    0.0
  ),
  -- Shelda (hero_id = 2, Central, Tenacity): Defensive tank
  (
    2,
    60,
    20,
    0.6,
    70,
    750,
    1,
    0.0,
    0.0,
    1,
    1.5,
    1.5,
    0.0,
    0.0,
    0,
    0,
    25,
    1,
    0.0,
    1,
    0,
    0.0,
    0.0,
    0.0
  ),
  -- Evan (hero_id = 3, Central, Courage): Melee DPS/leader
  (
    3,
    90,
    30,
    1.2,
    90,
    450,
    1,
    0.0,
    0.0,
    1,
    1.5,
    1.5,
    0.0,
    0.0,
    0,
    0,
    10,
    1,
    0.0,
    1,
    0,
    0.0,
    0.0,
    0.0
  ),
  -- Draco (hero_id = 4, West, Element): Hybrid bruiser
  (
    4,
    80,
    70,
    0.9,
    110,
    550,
    1,
    0.0,
    0.0,
    1,
    1.5,
    1.5,
    0.0,
    0.0,
    0,
    0,
    15,
    1,
    0.0,
    1,
    0,
    0.0,
    0.0,
    0.0
  ),
  -- Neria (hero_id = 5, North, Shadow): Stealthy assassin
  (
    5,
    100,
    10,
    1.1,
    80,
    400,
    1,
    0.0,
    0.0,
    1,
    1.5,
    1.5,
    0.0,
    0.0,
    0,
    0,
    5,
    1,
    0.0,
    1,
    0,
    0.0,
    0.0,
    0.0
  );

-- SUNDRES (ALL ITEMS)
CREATE TABLE
  sundries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    type ENUM (
      'consumable',
      'armor',
      'weapon',
      'ammo',
      'food',
      'ingredient',
      'material',
      'relic',
      'accessory',
      'legacy',
      'currency'
    ),
    description TEXT
  );

INSERT INTO
  sundries (name, type, description)
VALUES
  (
    'Lunar Elixir',
    'consumable',
    'A shimmering potion infused with the North’s Blue Moon essence, restoring mana and vitality to weary heroes like Luniare, who draw strength from its celestial glow.'
  ),
  (
    'Starforged Plate',
    'armor',
    'Forged in the Central region’s ancient smithies, this radiant armor bolsters the resilience of warriors like Shelda, deflecting blows with unyielding might.'
  ),
  (
    'Dawnblade',
    'weapon',
    'A masterfully crafted sword from the Central region, its edge gleams with the light of dawn, wielded by heroes like Evan to carve paths through enemy ranks.'
  ),
  (
    'Red Moon Talisman',
    'accessory',
    'A crimson amulet pulsing with the North’s vengeful spirit, enhancing the precision of assassins like Neria as they hunt the cursed under the Red Moon’s gaze.'
  ),
  (
    'Drake’s Embercore',
    'relic',
    'A smoldering gem from the West’s volcanic depths, imbued with draconic fire, granting heroes like Draco the power to unleash searing elemental fury.'
  ),
  (
    'Moonlit Thread',
    'material',
    'Gossamer strands woven from the North’s lunar mists, used by mystics like Luniare to craft enchanted garments that shimmer with arcane protection.'
  ),
  (
    'Sacred Reliquary',
    'legacy',
    'An ancient artifact from the Central region, said to hold the valor of fallen knights, empowering heroes like Evan with the strength of their forebears.'
  ),
  (
    'Viper’s Fang',
    'weapon',
    'A sleek dagger forged in the North’s shadows, its venomous edge favored by Nerias for silent strikes against the cursed, leaving no trace.'
  ),
  (
    'Guardian’s Crest',
    'accessory',
    'A sturdy emblem etched with the Central region’s sigils, worn by tanks like Shelda to bolster their resolve and shield allies from harm.'
  ),
  (
    'Astral Shard',
    'consumable',
    'A crystalline fragment from the North’s starry skies, consumed by mystics like Luniare to briefly amplify their spellcasting with cosmic radiance.'
  );

CREATE TABLE
  item_effects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    stat_name VARCHAR(50) NOT NULL, -- e.g., 'ATK', 'Skill_Amplification', 'Extra_Hit'
    modifier_type ENUM ('flat', 'percent', 'special') DEFAULT 'flat', -- flat = +10, percent = +10%
    value DECIMAL(6, 2) NOT NULL,
    note TEXT, -- e.g., 'Stacks each turn up to 240%', or special behavior notes
    FOREIGN KEY (item_id) REFERENCES sundries (id) ON DELETE CASCADE
  );

INSERT INTO
  item_effects (item_id, stat_name, modifier_type, value, note)
VALUES
  -- Lunar Elixir (ID 1, consumable): Restores mana and vitality
  (
    1,
    'MP',
    'flat',
    50.00,
    'Restores 50 mana instantly upon consumption.'
  ),
  (
    1,
    'HP',
    'flat',
    100.00,
    'Heals 100 health over 10 seconds.'
  ),
  -- Red Moon Talisman (ID 4, accessory): Enhances assassin precision
  (
    4,
    'ATK',
    'percent',
    0.15,
    'Increases attack power by 15% for heroes like Neria.'
  ),
  (
    4,
    'Execution_Rate',
    'flat',
    0.05,
    'Grants a 5% chance to execute low-HP enemies.'
  ),
  -- Drake’s Embercore (ID 5, relic): Grants draconic fire power
  (
    5,
    'Special_Damage',
    'flat',
    20.00,
    'Adds 20 fire damage to all attacks for heroes like Draco.'
  ),
  (
    5,
    'Spell',
    'percent',
    0.20,
    'Boosts spell power by 20%, stacking up to 60% with repeated casts.'
  ),
  -- Guardian’s Crest (ID 9, accessory): Bolsters tank resolve
  (
    9,
    'Mighty_Block',
    'flat',
    15.00,
    'Increases block chance by 15 for tanks like Shelda.'
  ),
  -- Astral Shard (ID 10, consumable): Amplifies spellcasting
  (
    10,
    'Skill_Amplification',
    'percent',
    0.25,
    'Boosts skill damage by 25% for 30 seconds after consumption.'
  );

-- INVENTORY
CREATE TABLE
  inventory (
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 0,
    PRIMARY KEY (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES sundries (id) ON DELETE CASCADE
  );

INSERT INTO
  inventory (user_id, item_id, quantity)
VALUES
  -- User 1: Owns Luniare (ID 1), Shelda (ID 2), Draco (ID 4)
  (1, 1, 8), -- Lunar Elixir: Consumable for Luniare’s mana and health restoration
  (1, 5, 1), -- Drake’s Embercore: Relic to boost Draco’s fiery elemental might
  (1, 9, 2), -- Guardian’s Crest: Accessory to enhance Shelda’s tanking resolve
  (1, 6, 3), -- Moonlit Thread: Material for Luniare’s mystical crafting
  -- User 2: Owns Evan (ID 3), Neria (ID 5)
  (2, 3, 1), -- Dawnblade: Weapon to sharpen Evan’s swordsmanship
  (2, 4, 1), -- Red Moon Talisman: Accessory to amplify Neria’s assassin precision
  (2, 10, 5), -- Astral Shard: Consumable to boost Neria’s skill damage temporarily
  -- User 3: Owns Luniare (ID 1), Shelda (ID 2), Neria (ID 5)
  (3, 1, 6), -- Lunar Elixir: Consumable for Luniare’s spellcasting sustenance
  (3, 9, 1), -- Guardian’s Crest: Accessory for Shelda’s unyielding defense
  (3, 8, 2);

-- Viper’s Fang: Weapon for Neria’s silent, venomous strikes
-- TEAM COMPOSITION
CREATE TABLE
  teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100),
    slot1 INT,
    slot2 INT,
    slot3 INT,
    slot4 INT,
    slot5 INT,
    slot6 INT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (slot1) REFERENCES user_heroes (id),
    FOREIGN KEY (slot2) REFERENCES user_heroes (id),
    FOREIGN KEY (slot3) REFERENCES user_heroes (id),
    FOREIGN KEY (slot4) REFERENCES user_heroes (id),
    FOREIGN KEY (slot5) REFERENCES user_heroes (id),
    FOREIGN KEY (slot6) REFERENCES user_heroes (id)
  );

INSERT INTO
  teams (
    user_id,
    name,
    slot1,
    slot2,
    slot3,
    slot4,
    slot5,
    slot6
  )
VALUES
  -- User 1: Balanced team with support, tank, and DPS
  (1, 'Moonlit Vanguard', 1, 2, 3, NULL, NULL, NULL),
  -- Slot1: Luniare (user_heroes.id 1, healer/support, Mystique)
  -- Slot2: Shelda (user_heroes.id 2, tank, Tenacity)
  -- Slot3: Draco (user_heroes.id 3, DPS, Element)
  -- User 1: Offensive-focused team
  (1, 'Drake’s Fury', 3, 1, NULL, NULL, NULL, NULL),
  -- Slot1: Draco (user_heroes.id 3, DPS, Element)
  -- Slot2: Luniare (user_heroes.id 1, support, Mystique)
  -- User 2: Small offensive team
  (
    2,
    'Blade of Shadows',
    4,
    5,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  -- Slot1: Evan (user_heroes.id 4, DPS, Courage)
  -- Slot2: Neria (user_heroes.id 5, DPS/assassin, Shadow)
  -- User 3: Defensive team with support
  (3, 'Crimson Bastion', 7, 6, 8, NULL, NULL, NULL);

-- Slot1: Shelda (user_heroes.id 7, tank, Tenacity)
-- Slot2: Luniare (user_heroes.id 6, healer/support, Mystique)
-- Slot3: Neria (user_heroes.id 8, DPS/assassin, Shadow)
-- Max 3 relics each team
CREATE TABLE
  team_relics (
    team_id INT NOT NULL,
    relic_id INT NOT NULL,
    PRIMARY KEY (team_id, relic_id),
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE,
    FOREIGN KEY (relic_id) REFERENCES sundries (id) ON DELETE CASCADE
  );

INSERT INTO
  team_relics (team_id, relic_id)
VALUES
  -- Team 1 (User 1, Moonlit Vanguard): Luniare, Shelda, Draco
  (1, 5), -- Drake’s Embercore: Boosts Draco’s fiery damage for this balanced team
  -- Team 2 (User 1, Drake’s Fury): Draco, Luniare
  (2, 5);

-- Drake’s Embercore: Enhances Draco’s elemental might in this offensive lineup
-- Max 5 accessories each hero


CREATE TABLE
  user_hero_accessories (
    user_hero_id INT NOT NULL,
    accessory_id INT NOT NULL,
    PRIMARY KEY (user_hero_id, accessory_id),
    FOREIGN KEY (user_hero_id) REFERENCES user_heroes (id) ON DELETE CASCADE,
    FOREIGN KEY (accessory_id) REFERENCES sundries (id) ON DELETE CASCADE
  );

INSERT INTO
  user_hero_accessories (user_hero_id, accessory_id)
VALUES
  -- User 1’s heroes
  (2, 9), -- Shelda (user_hero_id 2): Guardian’s Crest enhances tanking with Mighty_Block
  (2, 4), -- Shelda: Red Moon Talisman adds ATK for secondary damage
  -- User 2’s heroes
  (5, 4), -- Neria (user_hero_id 5): Red Moon Talisman boosts ATK and Execution_Rate
  -- User 3’s heroes
  (7, 9), -- Shelda (user_hero_id 7): Guardian’s Crest strengthens her defensive role
  (8, 4);

-- Neria (user_hero_id 8): Red Moon Talisman amplifies her assassin strikes
-- Max 1 legacy each hero

CREATE TABLE
  user_hero_legacies (
    user_hero_id INT PRIMARY KEY,
    legacy_id INT NOT NULL,
    FOREIGN KEY (user_hero_id) REFERENCES user_heroes (id) ON DELETE CASCADE,
    FOREIGN KEY (legacy_id) REFERENCES sundries (id) ON DELETE CASCADE
  );
  INSERT INTO user_hero_legacies (user_hero_id, legacy_id) VALUES
  (1, 7),  -- Luniare (user_hero_id 1, User 1): Sacred Reliquary channels valor for her blessings
  (2, 7),  -- Shelda (user_hero_id 2, User 1): Reliquary honors her knightly heritage
  (3, 7),  -- Draco (user_hero_id 3, User 1): Reliquary fuels his draconic might
  (4, 7),  -- Evan (user_hero_id 4, User 2): Reliquary empowers his sword of valor
  (5, 7),  -- Neria (user_hero_id 5, User 2): Reliquary sharpens her vengeful hunt
  (6, 7),  -- Luniare (user_hero_id 6, User 3): Reliquary enhances her lunar grace
  (7, 7),  -- Shelda (user_hero_id 7, User 3): Reliquary fortifies her defensive stand
  (8, 7);  -- Neria (user_hero_id 8, User 3): Reliquary aids her Red Moon crusade