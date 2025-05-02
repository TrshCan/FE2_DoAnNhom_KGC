-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2025 at 05:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kinggodcastle`
--
CREATE DATABASE IF NOT EXISTS `kinggodcastle` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `kinggodcastle`;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `name`, `description`) VALUES
(1, 'Swiftness', 'Masters of agility and precision, the Swiftness class dances through battle with unparalleled speed. Their fluid movements make them nearly untouchable, striking foes with deadly accuracy before vanishing from sight.'),
(2, 'Mystique', 'Enigmatic wielders of arcane power, the Mystique class commands ancient magic and mesmerizing illusions. Their unpredictable spells confound enemies, turning the tide of battle with otherworldly finesse.'),
(3, 'Courage', 'Unyielding champions of valor, the Courage class charges fearlessly into the fray, igniting the hearts of allies. Their bold presence inspires unwavering resolve, rallying comrades to triumph against all odds.'),
(4, 'Tenacity', 'Indomitable guardians of endurance, the Tenacity class stands firm through any ordeal, shielding allies with unshakable resolve. Their relentless spirit transforms hardship into unbreakable strength.'),
(5, 'Shadow', 'Elusive predators of the night, the Shadow class strikes from the darkness with lethal precision. Masters of stealth and deception, they sow fear in their enemies, vanishing before retaliation can strike.'),
(6, 'Element', 'Commanders of nature’s fury, the Element class channels the primal forces of fire, water, wind, and earth. Their dynamic assaults shift like the tides, overwhelming foes with the raw power of the elements.');

-- --------------------------------------------------------

--
-- Table structure for table `heroes`
--

CREATE TABLE `heroes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `region_id` int(11) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `heroes`
--

INSERT INTO `heroes` (`id`, `name`, `region_id`, `class_id`, `title`, `description`) VALUES
(1, 'Luniare', 2, 2, 'Blue Moonlight', 'Coming form the north where the Blue Moon rises, Luniare endlessly yearned for the Moon that rose every night, coming to harness its beauty to bless others.'),
(2, 'Shelda', 5, 4, 'Shield of Knights', 'Shelda always stands against enemies at the front line of the battlefield to honor her father, a legendary war hero.'),
(3, 'Evan', 5, 3, 'Sword of Valor', 'Evan, a talented swordman and tactician, ascended to the position of Knight Commander at such a tender age.'),
(4, 'Draco', 4, 6, 'Half-Dragon', 'Born between a dragon and a human, Draco cannot wield the full power of a dragon, but his might is still quite formidable.'),
(5, 'Neria', 2, 5, 'Hunter of the Red Moon', 'Neria is the leader of a secret sect called Red Moon, a group that seeks the root of the Curse of the Black Blood that spread throughout the world. After losing her kin to the cursed ones, she lives to eliminate the dark-blooded beings to the last of their kind.');

-- --------------------------------------------------------

--
-- Table structure for table `hero_base_stats`
--

CREATE TABLE `hero_base_stats` (
  `id` int(11) NOT NULL,
  `hero_id` int(11) NOT NULL,
  `ATK` int(11) DEFAULT 0,
  `Spell` int(11) DEFAULT 0,
  `ATK_SPEED` decimal(5,2) DEFAULT 1.00,
  `MP` int(11) DEFAULT 0,
  `HP` int(11) DEFAULT 0,
  `Damage_Dealt` int(11) DEFAULT 0,
  `Normal_Attack_Amplification` decimal(5,2) DEFAULT 1.00,
  `Skill_Amplification` decimal(5,2) DEFAULT 1.00,
  `Special_Damage` int(11) DEFAULT 0,
  `Physical_CRIT_Damage` decimal(5,2) DEFAULT 1.50,
  `Spell_CRIT_Damage` decimal(5,2) DEFAULT 1.50,
  `Physical_CRIT_Chance` decimal(5,2) DEFAULT 0.05,
  `Spell_CRIT_Chance` decimal(5,2) DEFAULT 0.05,
  `Physical_DEF` int(11) DEFAULT 0,
  `Spell_DEF` int(11) DEFAULT 0,
  `Mighty_Block` int(11) DEFAULT 0,
  `Damage_Taken` int(11) DEFAULT 0,
  `EVA` decimal(5,2) DEFAULT 0.05,
  `Outgoing_Healing` int(11) DEFAULT 0,
  `Guard` int(11) DEFAULT 0,
  `Physical_HP_Drain` decimal(5,2) DEFAULT 0.00,
  `Spell_HP_Drain` decimal(5,2) DEFAULT 0.00,
  `Execution_Rate` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hero_base_stats`
--

INSERT INTO `hero_base_stats` (`id`, `hero_id`, `ATK`, `Spell`, `ATK_SPEED`, `MP`, `HP`, `Damage_Dealt`, `Normal_Attack_Amplification`, `Skill_Amplification`, `Special_Damage`, `Physical_CRIT_Damage`, `Spell_CRIT_Damage`, `Physical_CRIT_Chance`, `Spell_CRIT_Chance`, `Physical_DEF`, `Spell_DEF`, `Mighty_Block`, `Damage_Taken`, `EVA`, `Outgoing_Healing`, `Guard`, `Physical_HP_Drain`, `Spell_HP_Drain`, `Execution_Rate`) VALUES
(1, 1, 40, 100, 0.80, 140, 350, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 5, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(2, 2, 60, 20, 0.60, 70, 750, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 25, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(3, 3, 90, 30, 1.20, 90, 450, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 10, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(4, 4, 80, 70, 0.90, 110, 550, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 15, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(5, 5, 100, 10, 1.10, 80, 400, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 5, 1, 0.00, 1, 0, 0.00, 0.00, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `hero_skills`
--

CREATE TABLE `hero_skills` (
  `id` int(11) NOT NULL,
  `hero_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` enum('passive','awakening','ultimate') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hero_skills`
--

INSERT INTO `hero_skills` (`id`, `hero_id`, `name`, `description`, `type`) VALUES
(1, 1, 'Lunar Aegis', '<Blessing of the Blue Moon> grants 1 Mighty Block to the target.', 'passive'),
(2, 1, 'Moonlit Resilience', 'After the end of <Blessing of the Blue Moon>, buff remains for an additional 2 turns.', 'passive'),
(3, 1, 'Swift Blessing', 'Luniare recovers 100% MP if the target\'s is after Luniare at the begining of the battle. +20% Movement Speed on the target of <Blessing of the Blue Moon>.', 'awakening'),
(4, 1, 'Protection of the Moon', 'No longer grants Protection when <Blessing of the Blue Moon> is cast. +2 Mighty Blocks to the target of <Blessing of the Blue Moon>', 'awakening'),
(5, 1, 'Blessing of the Blue Moon', 'Concentrates for 5 turns, granting 15/60/120/250+SP Protection to the linked target and giving 90/100/110/120% of ATK and Spell Power converted into the target hero\'s base stats.', 'ultimate'),
(6, 2, 'Knight’s Bulwark', '+50% For all obtained Protection.', 'passive'),
(7, 2, 'Defiant Stand', ' -20 MP Cost of <Iron Will>.', 'passive'),
(8, 2, 'Absolute Will', 'Obtains 2-8 Mighty Blocks when using <Iron Will>. (can\'t be stacked)', 'awakening'),
(9, 2, 'Explosive Will', 'Consumes current Protection when using <Iron Will>. Upon consuming/depleting Protection, deals spell skill damage equal to consuming/depleting Protection + 50% of Spell power to all enemies', 'awakening'),
(10, 2, 'Iron Will', 'Generates 30/120/250/700 + SP Protection upon herself with her willpower.', 'ultimate'),
(11, 3, 'Valiant Strike', 'Recover 100% of MP at the start of the battle', 'passive'),
(12, 3, 'Tactician’s Edge', '+40% Spell Power', 'passive'),
(13, 3, 'Wave Slash', '+20% final damage of <Crescent Slash> for each enemy hit by <Crescent Slash> (max +100%)', 'awakening'),
(14, 3, 'Unleash Sword Aura', 'Emits aura with his sword that deals spell normal damage equal to 30% of Spell Power to enemies next to target on normal attacks', 'awakening'),
(15, 3, 'Crescent Slash', 'Unleash a piercing aura with his sword, dealing 20/35/50/65+ SP damage to 3 enemies in front of him.', 'ultimate'),
(16, 4, 'Drake’s Flame', 'When all targets of <Flamebreath> are killed, MP is returned in proportion to the remaining skill damage count', 'passive'),
(17, 4, 'Stormfang Slash', 'Drain +50% of the Spell Power damage as HP', 'passive'),
(18, 4, 'Ignite', 'Gradually increases final damage of <Flamebreath> by 15% while target is on it for every turn (max 135%)', 'awakening'),
(19, 4, 'Concentrated Flame', '-45 MP Cost and +70% Spell Power for <Flamebreath>. Total turn of <Flamebreath> is reduced to 4 and can\'t be stacked', 'awakening'),
(20, 4, 'Flamebreath', 'Breathes out flame, dealing 10 + 60% SP damage to all enemies in front of him once for 10 turns.', 'ultimate'),
(21, 5, 'Crimson Fang', '+1% final damage per 1% HP lost by target of <Annihilation Time> (max +60%)', 'passive'),
(22, 5, 'Bloodseeker’s Mark', '+1% final damage dealt by <Annihilation Time> for every 3% Attack Speed that exceeds 100% (max +50%)', 'passive'),
(23, 5, ' Everlasting Night', '+1 attack count of <Annihilation Time> that is being cast when a target is killed by the skill (max 3)', 'awakening'),
(24, 5, 'Shroud of Night', 'Hides for 2 round when using <Annihilation Time>, becoming untargetable to attacks for the duration', 'awakening'),
(25, 5, 'Annihilation Time', 'For the next 4 rounds, shoots enhanced arrows that deal (450+SP/10)% of ATK. During <Annihilation Time>, Neria\'s Movement Speed is fixed to 100.', 'ultimate');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`user_id`, `item_id`, `quantity`) VALUES
(1, 1, 8),
(1, 5, 1),
(1, 6, 3),
(1, 9, 2),
(2, 3, 1),
(2, 4, 1),
(2, 10, 5),
(3, 1, 6),
(3, 8, 2),
(3, 9, 1);

-- --------------------------------------------------------

--
-- Table structure for table `item_effects`
--

CREATE TABLE `item_effects` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `stat_name` varchar(50) NOT NULL,
  `modifier_type` enum('flat','percent','special') DEFAULT 'flat',
  `value` decimal(6,2) NOT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_effects`
--

INSERT INTO `item_effects` (`id`, `item_id`, `stat_name`, `modifier_type`, `value`, `note`) VALUES
(1, 1, 'MP', 'flat', 50.00, 'Restores 50 mana instantly upon consumption.'),
(2, 1, 'HP', 'flat', 100.00, 'Heals 100 health over 10 seconds.'),
(3, 4, 'ATK', 'percent', 0.15, 'Increases attack power by 15% for heroes like Neria.'),
(4, 4, 'Execution_Rate', 'flat', 0.05, 'Grants a 5% chance to execute low-HP enemies.'),
(5, 5, 'Special_Damage', 'flat', 20.00, 'Adds 20 fire damage to all attacks for heroes like Draco.'),
(6, 5, 'Spell', 'percent', 0.20, 'Boosts spell power by 20%, stacking up to 60% with repeated casts.'),
(7, 9, 'Mighty_Block', 'flat', 15.00, 'Increases block chance by 15 for tanks like Shelda.'),
(8, 10, 'Skill_Amplification', 'percent', 0.25, 'Boosts skill damage by 25% for 30 seconds after consumption.');

-- --------------------------------------------------------

--
-- Table structure for table `regions`
--

CREATE TABLE `regions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `regions`
--

INSERT INTO `regions` (`id`, `name`, `description`) VALUES
(1, 'South', 'A sun-drenched realm of vibrant landscapes, the South pulses with fiery passion and untamed beauty. Its sprawling deserts and lush jungles teem with life, challenging adventurers with trials of endurance and discovery.'),
(2, 'North', 'A frost-kissed expanse of rugged majesty, the North stands resolute under towering peaks and endless skies. Its icy winds carry tales of ancient heroes, beckoning the brave to carve their own legends.'),
(3, 'East', 'A land of dawn’s first light, the East shimmers with mystic allure and boundless opportunity. Its serene valleys and windswept cliffs hide secrets of forgotten lore, awaiting those bold enough to seek them.'),
(4, 'West', 'A frontier of untamed horizons, the West roars with the spirit of exploration and conquest. Its golden plains and stormy coasts promise riches and peril, forging heroes in the crucible of adventure.'),
(5, 'Central', 'The beating heart of the world, the Central region thrives with harmony and unrelenting vitality. Its rolling hills and radiant cities unite diverse cultures, offering a crucible for epic tales and grand destinies.');

-- --------------------------------------------------------

--
-- Table structure for table `sundries`
--

CREATE TABLE `sundries` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `type` enum('consumable','armor','weapon','ammo','food','ingredient','material','relic','accessory','legacy','currency') DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sundries`
--

INSERT INTO `sundries` (`id`, `name`, `type`, `description`) VALUES
(1, 'Lunar Elixir', 'consumable', 'A shimmering potion infused with the North’s Blue Moon essence, restoring mana and vitality to weary heroes like Luniare, who draw strength from its celestial glow.'),
(2, 'Starforged Plate', 'armor', 'Forged in the Central region’s ancient smithies, this radiant armor bolsters the resilience of warriors like Shelda, deflecting blows with unyielding might.'),
(3, 'Dawnblade', 'weapon', 'A masterfully crafted sword from the Central region, its edge gleams with the light of dawn, wielded by heroes like Evan to carve paths through enemy ranks.'),
(4, 'Red Moon Talisman', 'accessory', 'A crimson amulet pulsing with the North’s vengeful spirit, enhancing the precision of assassins like Neria as they hunt the cursed under the Red Moon’s gaze.'),
(5, 'Drake’s Embercore', 'relic', 'A smoldering gem from the West’s volcanic depths, imbued with draconic fire, granting heroes like Draco the power to unleash searing elemental fury.'),
(6, 'Moonlit Thread', 'material', 'Gossamer strands woven from the North’s lunar mists, used by mystics like Luniare to craft enchanted garments that shimmer with arcane protection.'),
(7, 'Sacred Reliquary', 'legacy', 'An ancient artifact from the Central region, said to hold the valor of fallen knights, empowering heroes like Evan with the strength of their forebears.'),
(8, 'Viper’s Fang', 'weapon', 'A sleek dagger forged in the North’s shadows, its venomous edge favored by Nerias for silent strikes against the cursed, leaving no trace.'),
(9, 'Guardian’s Crest', 'accessory', 'A sturdy emblem etched with the Central region’s sigils, worn by tanks like Shelda to bolster their resolve and shield allies from harm.'),
(10, 'Astral Shard', 'consumable', 'A crystalline fragment from the North’s starry skies, consumed by mystics like Luniare to briefly amplify their spellcasting with cosmic radiance.');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `slot1` int(11) DEFAULT NULL,
  `slot2` int(11) DEFAULT NULL,
  `slot3` int(11) DEFAULT NULL,
  `slot4` int(11) DEFAULT NULL,
  `slot5` int(11) DEFAULT NULL,
  `slot6` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `user_id`, `name`, `slot1`, `slot2`, `slot3`, `slot4`, `slot5`, `slot6`) VALUES
(1, 1, 'Moonlit Vanguard', 1, 2, 3, NULL, NULL, NULL),
(2, 1, 'Drake’s Fury', 3, 1, NULL, NULL, NULL, NULL),
(3, 2, 'Blade of Shadows', 4, 5, NULL, NULL, NULL, NULL),
(4, 3, 'Crimson Bastion', 7, 6, 8, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `team_relics`
--

CREATE TABLE `team_relics` (
  `team_id` int(11) NOT NULL,
  `relic_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team_relics`
--

INSERT INTO `team_relics` (`team_id`, `relic_id`) VALUES
(1, 5),
(2, 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `username`, `role`) VALUES
(1, 'alice@example.com', 'securepassword123', 'alice_wonder', 'user'),
(2, 'admin@email.com', 'root', 'bob_builder', 'admin'),
(3, 'charlie@example.com', 'randompass789', 'charlie_chap', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `user_heroes`
--

CREATE TABLE `user_heroes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `hero_id` int(11) NOT NULL,
  `level` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_heroes`
--

INSERT INTO `user_heroes` (`id`, `user_id`, `hero_id`, `level`) VALUES
(1, 1, 1, 3),
(2, 1, 2, 2),
(3, 1, 4, 4),
(4, 2, 3, 1),
(5, 2, 5, 2),
(6, 3, 1, 2),
(7, 3, 2, 3),
(8, 3, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_hero_accessories`
--

CREATE TABLE `user_hero_accessories` (
  `user_hero_id` int(11) NOT NULL,
  `accessory_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_hero_accessories`
--

INSERT INTO `user_hero_accessories` (`user_hero_id`, `accessory_id`) VALUES
(2, 4),
(2, 9),
(5, 4),
(7, 9),
(8, 4);

-- --------------------------------------------------------

--
-- Table structure for table `user_hero_legacies`
--

CREATE TABLE `user_hero_legacies` (
  `user_hero_id` int(11) NOT NULL,
  `legacy_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_hero_legacies`
--

INSERT INTO `user_hero_legacies` (`user_hero_id`, `legacy_id`) VALUES
(1, 7),
(2, 7),
(3, 7),
(4, 7),
(5, 7),
(6, 7),
(7, 7),
(8, 7);

-- --------------------------------------------------------

--
-- Table structure for table `user_hero_stats`
--

CREATE TABLE `user_hero_stats` (
  `id` int(11) NOT NULL,
  `user_hero_id` int(11) NOT NULL,
  `ATK` int(11) DEFAULT 0,
  `Spell` int(11) DEFAULT 0,
  `ATK_SPEED` decimal(5,2) DEFAULT 1.00,
  `MP` int(11) DEFAULT 0,
  `HP` int(11) DEFAULT 0,
  `Damage_Dealt` int(11) DEFAULT 0,
  `Normal_Attack_Amplification` decimal(5,2) DEFAULT 1.00,
  `Skill_Amplification` decimal(5,2) DEFAULT 1.00,
  `Special_Damage` int(11) DEFAULT 0,
  `Physical_CRIT_Damage` decimal(5,2) DEFAULT 1.50,
  `Spell_CRIT_Damage` decimal(5,2) DEFAULT 1.50,
  `Physical_CRIT_Chance` decimal(5,2) DEFAULT 0.05,
  `Spell_CRIT_Chance` decimal(5,2) DEFAULT 0.05,
  `Physical_DEF` int(11) DEFAULT 0,
  `Spell_DEF` int(11) DEFAULT 0,
  `Mighty_Block` int(11) DEFAULT 0,
  `Damage_Taken` int(11) DEFAULT 0,
  `EVA` decimal(5,2) DEFAULT 0.05,
  `Outgoing_Healing` int(11) DEFAULT 0,
  `Guard` int(11) DEFAULT 0,
  `Physical_HP_Drain` decimal(5,2) DEFAULT 0.00,
  `Spell_HP_Drain` decimal(5,2) DEFAULT 0.00,
  `Execution_Rate` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_hero_stats`
--

INSERT INTO `user_hero_stats` (`id`, `user_hero_id`, `ATK`, `Spell`, `ATK_SPEED`, `MP`, `HP`, `Damage_Dealt`, `Normal_Attack_Amplification`, `Skill_Amplification`, `Special_Damage`, `Physical_CRIT_Damage`, `Spell_CRIT_Damage`, `Physical_CRIT_Chance`, `Spell_CRIT_Chance`, `Physical_DEF`, `Spell_DEF`, `Mighty_Block`, `Damage_Taken`, `EVA`, `Outgoing_Healing`, `Guard`, `Physical_HP_Drain`, `Spell_HP_Drain`, `Execution_Rate`) VALUES
(1, 1, 40, 100, 0.80, 140, 350, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 5, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(2, 2, 60, 20, 0.60, 70, 750, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 25, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(3, 3, 90, 30, 1.20, 90, 450, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 10, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(4, 4, 80, 70, 0.90, 110, 550, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 15, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(5, 5, 100, 10, 1.10, 80, 400, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 5, 1, 0.00, 1, 0, 0.00, 0.00, 0.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `heroes`
--
ALTER TABLE `heroes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `region_id` (`region_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `hero_base_stats`
--
ALTER TABLE `hero_base_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hero_id` (`hero_id`);

--
-- Indexes for table `hero_skills`
--
ALTER TABLE `hero_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hero_id` (`hero_id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`user_id`,`item_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `item_effects`
--
ALTER TABLE `item_effects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sundries`
--
ALTER TABLE `sundries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `slot1` (`slot1`),
  ADD KEY `slot2` (`slot2`),
  ADD KEY `slot3` (`slot3`),
  ADD KEY `slot4` (`slot4`),
  ADD KEY `slot5` (`slot5`),
  ADD KEY `slot6` (`slot6`);

--
-- Indexes for table `team_relics`
--
ALTER TABLE `team_relics`
  ADD PRIMARY KEY (`team_id`,`relic_id`),
  ADD KEY `relic_id` (`relic_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_heroes`
--
ALTER TABLE `user_heroes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `hero_id` (`hero_id`);

--
-- Indexes for table `user_hero_accessories`
--
ALTER TABLE `user_hero_accessories`
  ADD PRIMARY KEY (`user_hero_id`,`accessory_id`),
  ADD KEY `accessory_id` (`accessory_id`);

--
-- Indexes for table `user_hero_legacies`
--
ALTER TABLE `user_hero_legacies`
  ADD PRIMARY KEY (`user_hero_id`),
  ADD KEY `legacy_id` (`legacy_id`);

--
-- Indexes for table `user_hero_stats`
--
ALTER TABLE `user_hero_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_hero_id` (`user_hero_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `heroes`
--
ALTER TABLE `heroes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `hero_base_stats`
--
ALTER TABLE `hero_base_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `hero_skills`
--
ALTER TABLE `hero_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `item_effects`
--
ALTER TABLE `item_effects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `regions`
--
ALTER TABLE `regions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sundries`
--
ALTER TABLE `sundries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_heroes`
--
ALTER TABLE `user_heroes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user_hero_stats`
--
ALTER TABLE `user_hero_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `heroes`
--
ALTER TABLE `heroes`
  ADD CONSTRAINT `heroes_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `heroes_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `hero_base_stats`
--
ALTER TABLE `hero_base_stats`
  ADD CONSTRAINT `hero_base_stats_ibfk_1` FOREIGN KEY (`hero_id`) REFERENCES `heroes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_skills`
--
ALTER TABLE `hero_skills`
  ADD CONSTRAINT `hero_skills_ibfk_1` FOREIGN KEY (`hero_id`) REFERENCES `heroes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `sundries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `item_effects`
--
ALTER TABLE `item_effects`
  ADD CONSTRAINT `item_effects_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `sundries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teams_ibfk_2` FOREIGN KEY (`slot1`) REFERENCES `user_heroes` (`id`),
  ADD CONSTRAINT `teams_ibfk_3` FOREIGN KEY (`slot2`) REFERENCES `user_heroes` (`id`),
  ADD CONSTRAINT `teams_ibfk_4` FOREIGN KEY (`slot3`) REFERENCES `user_heroes` (`id`),
  ADD CONSTRAINT `teams_ibfk_5` FOREIGN KEY (`slot4`) REFERENCES `user_heroes` (`id`),
  ADD CONSTRAINT `teams_ibfk_6` FOREIGN KEY (`slot5`) REFERENCES `user_heroes` (`id`),
  ADD CONSTRAINT `teams_ibfk_7` FOREIGN KEY (`slot6`) REFERENCES `user_heroes` (`id`);

--
-- Constraints for table `team_relics`
--
ALTER TABLE `team_relics`
  ADD CONSTRAINT `team_relics_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `team_relics_ibfk_2` FOREIGN KEY (`relic_id`) REFERENCES `sundries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_heroes`
--
ALTER TABLE `user_heroes`
  ADD CONSTRAINT `user_heroes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_heroes_ibfk_2` FOREIGN KEY (`hero_id`) REFERENCES `heroes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_hero_accessories`
--
ALTER TABLE `user_hero_accessories`
  ADD CONSTRAINT `user_hero_accessories_ibfk_1` FOREIGN KEY (`user_hero_id`) REFERENCES `user_heroes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_hero_accessories_ibfk_2` FOREIGN KEY (`accessory_id`) REFERENCES `sundries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_hero_legacies`
--
ALTER TABLE `user_hero_legacies`
  ADD CONSTRAINT `user_hero_legacies_ibfk_1` FOREIGN KEY (`user_hero_id`) REFERENCES `user_heroes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_hero_legacies_ibfk_2` FOREIGN KEY (`legacy_id`) REFERENCES `sundries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_hero_stats`
--
ALTER TABLE `user_hero_stats`
  ADD CONSTRAINT `user_hero_stats_ibfk_1` FOREIGN KEY (`user_hero_id`) REFERENCES `user_heroes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
