-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 25, 2025 lúc 06:56 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.3.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `kinggodcastle`
--
CREATE DATABASE IF NOT EXISTS `kinggodcastle` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `kinggodcastle`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `classes`
--

INSERT INTO `classes` (`id`, `name`, `description`, `icon`) VALUES
(1, 'Swiftness', 'Masters of agility and precision, the Swiftness class dances through battle with unparalleled speed. Their fluid movements make them nearly untouchable, striking foes with deadly accuracy before vanishing from sight.', NULL),
(2, 'Mystique', 'Enigmatic wielders of arcane power, the Mystique class commands ancient magic and mesmerizing illusions. Their unpredictable spells confound enemies, turning the tide of battle with otherworldly finesse.', NULL),
(3, 'Courage', 'Unyielding champions of valor, the Courage class charges fearlessly into the fray, igniting the hearts of allies. Their bold presence inspires unwavering resolve, rallying comrades to triumph against all odds.', NULL),
(4, 'Tenacity', 'Indomitable guardians of endurance, the Tenacity class stands firm through any ordeal, shielding allies with unshakable resolve. Their relentless spirit transforms hardship into unbreakable strength.', NULL),
(5, 'Shadow', 'Elusive predators of the night, the Shadow class strikes from the darkness with lethal precision. Masters of stealth and deception, they sow fear in their enemies, vanishing before retaliation can strike.', NULL),
(6, 'Element', 'Commanders of nature’s fury, the Element class channels the primal forces of fire, water, wind, and earth. Their dynamic assaults shift like the tides, overwhelming foes with the raw power of the elements.', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `enemies`
--

CREATE TABLE `enemies` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `region_id` int(11) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `enemy_base_stats`
--

CREATE TABLE `enemy_base_stats` (
  `id` int(11) NOT NULL,
  `enemy_id` int(11) NOT NULL,
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

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `enemy_skills`
--

CREATE TABLE `enemy_skills` (
  `id` int(11) NOT NULL,
  `enemy_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` enum('passive','awakening','ultimate') DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `friends`
--

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','accepted') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `friends`
--

INSERT INTO `friends` (`id`, `user_id`, `friend_id`, `created_at`, `status`) VALUES
(35, 4, 18, '2025-05-25 09:01:34', 'accepted'),
(36, 18, 4, '2025-05-25 09:01:43', 'accepted');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `heroes`
--

CREATE TABLE `heroes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `region_id` int(11) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `illustration` varchar(100) DEFAULT NULL,
  `card` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `heroes`
--

INSERT INTO `heroes` (`id`, `name`, `region_id`, `class_id`, `title`, `description`, `icon`, `illustration`, `card`) VALUES
(1, 'Luniare', 2, 2, 'Blue Moonlight', 'Coming form the north where the Blue Moon rises, Luniare endlessly yearned for the Moon that rose every night, coming to harness its beauty to bless others.', 'Unit_10230.png', 'Unit_Illust_10230_02.png', '19-2.png'),
(2, 'Shelda', 5, 4, 'Shield of Knights', 'Shelda always stands against enemies at the front line of the battlefield to honor her father, a legendary war hero.', 'Unit_10000_00.png', 'Unit_Illust_10000_00.png', '12_2.png'),
(3, 'Evan', 5, 3, 'Sword of Valor', 'Evan, a talented swordman and tactician, ascended to the position of Knight Commander at such a tender age.', 'Unit_10030.png', 'Unit_Illust_10030.png', '5_2.png'),
(4, 'Draco', 4, 6, 'Half-Dragon', 'Born between a dragon and a human, Draco cannot wield the full power of a dragon, but his might is still quite formidable.', 'Unit_10080_01.png', 'Unit_Illust_10080.png', '6_2.png'),
(5, 'Neria', 2, 5, 'Hunter of the Red Moon', 'Neria is the leader of a secret sect called Red Moon, a group that seeks the root of the Curse of the Black Blood that spread throughout the world. After losing her kin to the cursed ones, she lives to eliminate the dark-blooded beings to the last of their kind.', 'Unit_10350_99_00.png', 'Unit_Illust_10350_03.png', '21-2.png');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hero_base_stats`
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
-- Đang đổ dữ liệu cho bảng `hero_base_stats`
--

INSERT INTO `hero_base_stats` (`id`, `hero_id`, `ATK`, `Spell`, `ATK_SPEED`, `MP`, `HP`, `Damage_Dealt`, `Normal_Attack_Amplification`, `Skill_Amplification`, `Special_Damage`, `Physical_CRIT_Damage`, `Spell_CRIT_Damage`, `Physical_CRIT_Chance`, `Spell_CRIT_Chance`, `Physical_DEF`, `Spell_DEF`, `Mighty_Block`, `Damage_Taken`, `EVA`, `Outgoing_Healing`, `Guard`, `Physical_HP_Drain`, `Spell_HP_Drain`, `Execution_Rate`) VALUES
(1, 1, 40, 100, 0.80, 140, 350, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 5, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(2, 2, 60, 20, 0.60, 70, 750, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 25, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(3, 3, 90, 30, 1.20, 90, 450, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 10, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(4, 4, 80, 70, 0.90, 110, 550, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 15, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(5, 5, 100, 10, 1.10, 80, 400, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 5, 1, 0.00, 1, 0, 0.00, 0.00, 0.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hero_skills`
--

CREATE TABLE `hero_skills` (
  `id` int(11) NOT NULL,
  `hero_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` enum('passive','awakening','ultimate') DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hero_skills`
--

INSERT INTO `hero_skills` (`id`, `hero_id`, `name`, `description`, `type`, `icon`) VALUES
(1, 1, 'Lunar Aegis', '<Blessing of the Blue Moon> grants 1 Mighty Block to the target.', 'passive', NULL),
(2, 1, 'Moonlit Resilience', 'After the end of <Blessing of the Blue Moon>, buff remains for an additional 2 turns.', 'passive', NULL),
(3, 1, 'Swift Blessing', 'Luniare recovers 100% MP if the target\'s is after Luniare at the begining of the battle. +20% Movement Speed on the target of <Blessing of the Blue Moon>.', 'awakening', NULL),
(4, 1, 'Protection of the Moon', 'No longer grants Protection when <Blessing of the Blue Moon> is cast. +2 Mighty Blocks to the target of <Blessing of the Blue Moon>', 'awakening', NULL),
(5, 1, 'Blessing of the Blue Moon', 'Concentrates for 5 turns, granting 15/60/120/250+SP Protection to the linked target and giving 90/100/110/120% of ATK and Spell Power converted into the target hero\'s base stats.', 'ultimate', NULL),
(6, 2, 'Knight’s Bulwark', '+50% For all obtained Protection.', 'passive', NULL),
(7, 2, 'Defiant Stand', ' -20 MP Cost of <Iron Will>.', 'passive', NULL),
(8, 2, 'Absolute Will', 'Obtains 2-8 Mighty Blocks when using <Iron Will>. (can\'t be stacked)', 'awakening', NULL),
(9, 2, 'Explosive Will', 'Consumes current Protection when using <Iron Will>. Upon consuming/depleting Protection, deals spell skill damage equal to consuming/depleting Protection + 50% of Spell power to all enemies', 'awakening', NULL),
(10, 2, 'Iron Will', 'Generates 30/120/250/700 + SP Protection upon herself with her willpower.', 'ultimate', NULL),
(11, 3, 'Valiant Strike', 'Recover 100% of MP at the start of the battle', 'passive', NULL),
(12, 3, 'Tactician’s Edge', '+40% Spell Power', 'passive', NULL),
(13, 3, 'Wave Slash', '+20% final damage of <Crescent Slash> for each enemy hit by <Crescent Slash> (max +100%)', 'awakening', NULL),
(14, 3, 'Unleash Sword Aura', 'Emits aura with his sword that deals spell normal damage equal to 30% of Spell Power to enemies next to target on normal attacks', 'awakening', NULL),
(15, 3, 'Crescent Slash', 'Unleash a piercing aura with his sword, dealing 20/35/50/65+ SP damage to 3 enemies in front of him.', 'ultimate', NULL),
(16, 4, 'Drake’s Flame', 'When all targets of <Flamebreath> are killed, MP is returned in proportion to the remaining skill damage count', 'passive', NULL),
(17, 4, 'Stormfang Slash', 'Drain +50% of the Spell Power damage as HP', 'passive', NULL),
(18, 4, 'Ignite', 'Gradually increases final damage of <Flamebreath> by 15% while target is on it for every turn (max 135%)', 'awakening', NULL),
(19, 4, 'Concentrated Flame', '-45 MP Cost and +70% Spell Power for <Flamebreath>. Total turn of <Flamebreath> is reduced to 4 and can\'t be stacked', 'awakening', NULL),
(20, 4, 'Flamebreath', 'Breathes out flame, dealing 10 + 60% SP damage to all enemies in front of him once for 10 turns.', 'ultimate', NULL),
(21, 5, 'Crimson Fang', '+1% final damage per 1% HP lost by target of <Annihilation Time> (max +60%)', 'passive', NULL),
(22, 5, 'Bloodseeker’s Mark', '+1% final damage dealt by <Annihilation Time> for every 3% Attack Speed that exceeds 100% (max +50%)', 'passive', NULL),
(23, 5, ' Everlasting Night', '+1 attack count of <Annihilation Time> that is being cast when a target is killed by the skill (max 3)', 'awakening', NULL),
(24, 5, 'Shroud of Night', 'Hides for 2 round when using <Annihilation Time>, becoming untargetable to attacks for the duration', 'awakening', NULL),
(25, 5, 'Annihilation Time', 'For the next 4 rounds, shoots enhanced arrows that deal (450+SP/10)% of ATK. During <Annihilation Time>, Neria\'s Movement Speed is fixed to 100.', 'ultimate', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `inventory`
--

CREATE TABLE `inventory` (
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `inventory`
--

INSERT INTO `inventory` (`user_id`, `item_id`, `quantity`) VALUES
(1, 5, 1),
(1, 6, 3),
(1, 9, 2),
(2, 3, 1),
(2, 4, 1),
(2, 10, 5),
(3, 1, 6),
(3, 8, 2),
(3, 9, 1),
(4, 1, 8);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `item_effects`
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
-- Đang đổ dữ liệu cho bảng `item_effects`
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
-- Cấu trúc bảng cho bảng `level_requirements`
--

CREATE TABLE `level_requirements` (
  `level` int(11) NOT NULL,
  `xp_required` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `level_requirements`
--

INSERT INTO `level_requirements` (`level`, `xp_required`) VALUES
(1, 0),
(2, 10),
(3, 60),
(4, 160),
(5, 310),
(6, 510),
(7, 760),
(8, 1060),
(9, 1410),
(10, 1810),
(11, 2260),
(12, 2760),
(13, 3310),
(14, 3910),
(15, 4560),
(16, 5260),
(17, 6010),
(18, 6810),
(19, 7660),
(20, 8560),
(21, 9510),
(22, 10510),
(23, 11560),
(24, 12660),
(25, 13810),
(26, 15010),
(27, 16260),
(28, 17560),
(29, 18910),
(30, 20310),
(31, 21760),
(32, 23260),
(33, 24810),
(34, 26410),
(35, 28060),
(36, 29760),
(37, 31510),
(38, 33310),
(39, 35160),
(40, 37060),
(41, 39010),
(42, 41010),
(43, 43060),
(44, 45160),
(45, 47310),
(46, 49510),
(47, 51760),
(48, 54060),
(49, 56410),
(50, 58810),
(51, 61260),
(52, 63760),
(53, 66310),
(54, 68910),
(55, 71560),
(56, 74260),
(57, 77010),
(58, 79810),
(59, 82660),
(60, 85560),
(61, 88510),
(62, 91510),
(63, 94560),
(64, 97660),
(65, 100810),
(66, 104010),
(67, 107260),
(68, 110560),
(69, 113910),
(70, 117310),
(71, 120760),
(72, 124260),
(73, 127810),
(74, 131410),
(75, 135060),
(76, 138760),
(77, 142510),
(78, 146310),
(79, 150160),
(80, 154060),
(81, 158010),
(82, 162010),
(83, 166060),
(84, 170160),
(85, 174310),
(86, 178510),
(87, 182760),
(88, 187060),
(89, 191410),
(90, 195810),
(91, 200260),
(92, 204760),
(93, 209310),
(94, 213910),
(95, 218560),
(96, 223260),
(97, 228010),
(98, 232810),
(99, 237660),
(100, 242560);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mails`
--

CREATE TABLE `mails` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `sender_email` varchar(255) NOT NULL,
  `receiver_email` varchar(255) NOT NULL,
  `received_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `mails`
--

INSERT INTO `mails` (`id`, `title`, `content`, `sender_email`, `receiver_email`, `received_at`) VALUES
(1, 'Chào mừng bạn đến với hệ thống!', 'Chúng tôi rất vui vì bạn đã tham gia.', 'admin@he-thong.com', 'user1@example.com', '2025-04-20 02:05:42'),
(2, 'Xác nhận đăng ký', 'Vui lòng nhấn vào liên kết bên dưới để xác nhận đăng ký tài khoản của bạn.', 'noreply@he-thong.com', 'user2@example.com', '2025-04-20 02:05:42'),
(3, 'Khuyến mãi đặc biệt', 'Giảm giá 50% cho tất cả sản phẩm trong hôm nay!', 'marketing@he-thong.com', 'user3@example.com', '2025-04-20 02:05:42'),
(4, 'Thông báo bảo trì', 'Hệ thống sẽ bảo trì vào lúc 2 giờ sáng ngày mai.', 'admin@he-thong.com', 'user4@example.com', '2025-04-20 02:05:42'),
(5, 'Hướng dẫn sử dụng', 'Dưới đây là hướng dẫn sử dụng chi tiết cho người mới bắt đầu...', 'support@he-thong.com', 'user5@example.com', '2025-04-20 02:05:42'),
(6, 'test', 'test', 'test', '', '2025-05-18 08:52:35');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(18, 17, 17, 'cxcxzc', '2025-05-02 02:17:10'),
(19, 17, 4, 'xczxczxccdffdg', '2025-05-02 02:18:15'),
(20, 4, 4, 'gffdg', '2025-05-02 02:18:45'),
(21, 4, 1, 'fdfsdf', '2025-05-02 02:19:00'),
(22, 4, 17, 'fdsfsdf', '2025-05-02 02:19:20'),
(23, 17, 4, 'xin chao', '2025-05-02 02:19:40'),
(24, 4, 17, 'chào nha', '2025-05-02 02:19:56'),
(0, 1, 4, 'feage', '2025-05-18 07:20:45'),
(18, 17, 17, 'cxcxzc', '2025-05-02 02:17:10'),
(19, 17, 4, 'xczxczxccdffdg', '2025-05-02 02:18:15'),
(20, 4, 4, 'gffdg', '2025-05-02 02:18:45'),
(21, 4, 1, 'fdfsdf', '2025-05-02 02:19:00'),
(22, 4, 17, 'fdsfsdf', '2025-05-02 02:19:20'),
(23, 17, 4, 'xin chao', '2025-05-02 02:19:40'),
(24, 4, 17, 'chào nha', '2025-05-02 02:19:56'),
(0, 1, 4, 'feage', '2025-05-18 07:20:45'),
(18, 17, 17, 'cxcxzc', '2025-05-02 02:17:10'),
(19, 17, 4, 'xczxczxccdffdg', '2025-05-02 02:18:15'),
(20, 4, 4, 'gffdg', '2025-05-02 02:18:45'),
(21, 4, 1, 'fdfsdf', '2025-05-02 02:19:00'),
(22, 4, 17, 'fdsfsdf', '2025-05-02 02:19:20'),
(23, 17, 4, 'xin chao', '2025-05-02 02:19:40'),
(24, 4, 17, 'chào nha', '2025-05-02 02:19:56'),
(0, 1, 4, 'feage', '2025-05-18 07:20:45'),
(18, 17, 17, 'cxcxzc', '2025-05-02 02:17:10'),
(19, 17, 4, 'xczxczxccdffdg', '2025-05-02 02:18:15'),
(20, 4, 4, 'gffdg', '2025-05-02 02:18:45'),
(21, 4, 1, 'fdfsdf', '2025-05-02 02:19:00'),
(22, 4, 17, 'fdsfsdf', '2025-05-02 02:19:20'),
(23, 17, 4, 'xin chao', '2025-05-02 02:19:40'),
(24, 4, 17, 'chào nha', '2025-05-02 02:19:56'),
(0, 1, 4, 'feage', '2025-05-18 07:20:45'),
(18, 17, 17, 'cxcxzc', '2025-05-02 02:17:10'),
(19, 17, 4, 'xczxczxccdffdg', '2025-05-02 02:18:15'),
(20, 4, 4, 'gffdg', '2025-05-02 02:18:45'),
(21, 4, 1, 'fdfsdf', '2025-05-02 02:19:00'),
(22, 4, 17, 'fdsfsdf', '2025-05-02 02:19:20'),
(23, 17, 4, 'xin chao', '2025-05-02 02:19:40'),
(24, 4, 17, 'chào nha', '2025-05-02 02:19:56'),
(0, 1, 4, 'feage', '2025-05-18 07:20:45'),
(18, 17, 17, 'cxcxzc', '2025-05-02 02:17:10'),
(19, 17, 4, 'xczxczxccdffdg', '2025-05-02 02:18:15'),
(20, 4, 4, 'gffdg', '2025-05-02 02:18:45'),
(21, 4, 1, 'fdfsdf', '2025-05-02 02:19:00'),
(22, 4, 17, 'fdsfsdf', '2025-05-02 02:19:20'),
(23, 17, 4, 'xin chao', '2025-05-02 02:19:40'),
(24, 4, 17, 'chào nha', '2025-05-02 02:19:56'),
(0, 1, 4, 'feage', '2025-05-18 07:20:45'),
(18, 17, 17, 'cxcxzc', '2025-05-02 02:17:10'),
(19, 17, 4, 'xczxczxccdffdg', '2025-05-02 02:18:15'),
(20, 4, 4, 'gffdg', '2025-05-02 02:18:45'),
(21, 4, 1, 'fdfsdf', '2025-05-02 02:19:00'),
(22, 4, 17, 'fdsfsdf', '2025-05-02 02:19:20'),
(23, 17, 4, 'xin chao', '2025-05-02 02:19:40'),
(24, 4, 17, 'chào nha', '2025-05-02 02:19:56'),
(25, 18, 4, 'dsadsadas', '2025-05-25 08:24:03'),
(26, 4, 18, 'dsdsad', '2025-05-25 08:24:11'),
(27, 18, 4, 'dsadasd', '2025-05-25 08:25:40'),
(28, 4, 18, 'sdsadsad123', '2025-05-25 08:25:50'),
(29, 18, 4, 'dsadasdas', '2025-05-25 09:10:57'),
(30, 4, 18, 'fdfdsfsdf', '2025-05-25 09:20:16'),
(31, 4, 18, 'dsdasdasdas12312321312', '2025-05-25 09:36:43'),
(32, 18, 4, 'sadsadasdasdasd', '2025-05-25 09:36:51'),
(18, 17, 17, 'cxcxzc', '2025-05-02 02:17:10'),
(19, 17, 4, 'xczxczxccdffdg', '2025-05-02 02:18:15'),
(20, 4, 4, 'gffdg', '2025-05-02 02:18:45'),
(21, 4, 1, 'fdfsdf', '2025-05-02 02:19:00'),
(22, 4, 17, 'fdsfsdf', '2025-05-02 02:19:20'),
(23, 17, 4, 'xin chao', '2025-05-02 02:19:40'),
(24, 4, 17, 'chào nha', '2025-05-02 02:19:56'),
(25, 18, 4, 'dsadsadas', '2025-05-25 08:24:03'),
(26, 4, 18, 'dsdsad', '2025-05-25 08:24:11'),
(27, 18, 4, 'dsadasd', '2025-05-25 08:25:40'),
(28, 4, 18, 'sdsadsad123', '2025-05-25 08:25:50'),
(29, 18, 4, 'dsadasdas', '2025-05-25 09:10:57'),
(30, 4, 18, 'fdfdsfsdf', '2025-05-25 09:20:16'),
(31, 4, 18, 'dsdasdasdas12312321312', '2025-05-25 09:36:43'),
(32, 18, 4, 'sadsadasdasdasd', '2025-05-25 09:36:51'),
(18, 17, 17, 'cxcxzc', '2025-05-02 02:17:10'),
(19, 17, 4, 'xczxczxccdffdg', '2025-05-02 02:18:15'),
(20, 4, 4, 'gffdg', '2025-05-02 02:18:45'),
(21, 4, 1, 'fdfsdf', '2025-05-02 02:19:00'),
(22, 4, 17, 'fdsfsdf', '2025-05-02 02:19:20'),
(23, 17, 4, 'xin chao', '2025-05-02 02:19:40'),
(24, 4, 17, 'chào nha', '2025-05-02 02:19:56'),
(25, 18, 4, 'dsadsadas', '2025-05-25 08:24:03'),
(26, 4, 18, 'dsdsad', '2025-05-25 08:24:11'),
(27, 18, 4, 'dsadasd', '2025-05-25 08:25:40'),
(28, 4, 18, 'sdsadsad123', '2025-05-25 08:25:50'),
(29, 18, 4, 'dsadasdas', '2025-05-25 09:10:57'),
(30, 4, 18, 'fdfdsfsdf', '2025-05-25 09:20:16'),
(31, 4, 18, 'dsdasdasdas12312321312', '2025-05-25 09:36:43'),
(32, 18, 4, 'sadsadasdasdasd', '2025-05-25 09:36:51');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quests`
--

CREATE TABLE `quests` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('Pending','Completed') DEFAULT 'Pending',
  `type` enum('daily','weekly') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `quests`
--

INSERT INTO `quests` (`id`, `title`, `description`, `status`, `type`, `created_at`) VALUES
(1, 'Đăng nhập mỗi ngày', 'Đăng nhập vào game ít nhất 1 lần trong ngày', 'Completed', 'daily', '2025-05-25 15:40:14'),
(2, 'Hoàn thành 3 trận đấu', 'Chơi và hoàn thành 3 trận bất kỳ trong ngày', 'Pending', 'daily', '2025-05-25 15:40:14'),
(3, 'Thu thập 5 vật phẩm', 'Nhặt đủ 5 vật phẩm trong bản đồ bất kỳ', 'Pending', 'daily', '2025-05-25 15:40:14'),
(4, 'Giúp đỡ 1 người chơi', 'Gửi quà hoặc hỗ trợ người chơi khác 1 lần', 'Pending', 'daily', '2025-05-25 15:40:14'),
(5, 'Đăng nhập 5 ngày liên tiếp', 'Mỗi ngày đăng nhập, tổng cộng 5 ngày trong tuần', 'Pending', 'weekly', '2025-05-25 15:40:14'),
(6, 'Thắng 10 trận đấu', 'Chiến thắng tổng cộng 10 trận trong tuần', 'Pending', 'weekly', '2025-05-25 15:40:14'),
(7, 'Nâng cấp vật phẩm 3 lần', 'Sử dụng hệ thống nâng cấp để nâng cấp vật phẩm 3 lần', 'Pending', 'weekly', '2025-05-25 15:40:14'),
(8, 'Tham gia chế độ đấu hạng', 'Tham gia ít nhất 3 trận trong chế độ đấu hạng', 'Pending', 'weekly', '2025-05-25 15:40:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `regions`
--

CREATE TABLE `regions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `regions`
--

INSERT INTO `regions` (`id`, `name`, `description`, `icon`) VALUES
(1, 'South', 'A sun-drenched realm of vibrant landscapes, the South pulses with fiery passion and untamed beauty. Its sprawling deserts and lush jungles teem with life, challenging adventurers with trials of endurance and discovery.', NULL),
(2, 'North', 'A frost-kissed expanse of rugged majesty, the North stands resolute under towering peaks and endless skies. Its icy winds carry tales of ancient heroes, beckoning the brave to carve their own legends.', NULL),
(3, 'East', 'A land of dawn’s first light, the East shimmers with mystic allure and boundless opportunity. Its serene valleys and windswept cliffs hide secrets of forgotten lore, awaiting those bold enough to seek them.', NULL),
(4, 'West', 'A frontier of untamed horizons, the West roars with the spirit of exploration and conquest. Its golden plains and stormy coasts promise riches and peril, forging heroes in the crucible of adventure.', NULL),
(5, 'Central', 'The beating heart of the world, the Central region thrives with harmony and unrelenting vitality. Its rolling hills and radiant cities unite diverse cultures, offering a crucible for epic tales and grand destinies.', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sundries`
--

CREATE TABLE `sundries` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `type` enum('consumable','armor','weapon','ammo','food','ingredient','material','relic','accessory','legacy','currency') DEFAULT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `sundries`
--

INSERT INTO `sundries` (`id`, `name`, `type`, `description`, `icon`) VALUES
(1, 'Lunar Elixir', 'consumable', 'A shimmering potion infused with the North’s Blue Moon essence, restoring mana and vitality to weary heroes like Luniare, who draw strength from its celestial glow.', NULL),
(2, 'Starforged Plate', 'armor', 'Forged in the Central region’s ancient smithies, this radiant armor bolsters the resilience of warriors like Shelda, deflecting blows with unyielding might.', NULL),
(3, 'Dawnblade', 'weapon', 'A masterfully crafted sword from the Central region, its edge gleams with the light of dawn, wielded by heroes like Evan to carve paths through enemy ranks.', NULL),
(4, 'Red Moon Talisman', 'accessory', 'A crimson amulet pulsing with the North’s vengeful spirit, enhancing the precision of assassins like Neria as they hunt the cursed under the Red Moon’s gaze.', NULL),
(5, 'Drake’s Embercore', 'relic', 'A smoldering gem from the West’s volcanic depths, imbued with draconic fire, granting heroes like Draco the power to unleash searing elemental fury.', NULL),
(6, 'Moonlit Thread', 'material', 'Gossamer strands woven from the North’s lunar mists, used by mystics like Luniare to craft enchanted garments that shimmer with arcane protection.', NULL),
(7, 'Sacred Reliquary', 'legacy', 'An ancient artifact from the Central region, said to hold the valor of fallen knights, empowering heroes like Evan with the strength of their forebears.', NULL),
(8, 'Viper’s Fang', 'weapon', 'A sleek dagger forged in the North’s shadows, its venomous edge favored by Nerias for silent strikes against the cursed, leaving no trace.', NULL),
(9, 'Guardian’s Crest', 'accessory', 'A sturdy emblem etched with the Central region’s sigils, worn by tanks like Shelda to bolster their resolve and shield allies from harm.', NULL),
(10, 'Astral Shard', 'consumable', 'A crystalline fragment from the North’s starry skies, consumed by mystics like Luniare to briefly amplify their spellcasting with cosmic radiance.', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `teams`
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
-- Đang đổ dữ liệu cho bảng `teams`
--

INSERT INTO `teams` (`id`, `user_id`, `name`, `slot1`, `slot2`, `slot3`, `slot4`, `slot5`, `slot6`) VALUES
(1, 1, 'Moonlit Vanguard', 1, 2, 3, NULL, NULL, NULL),
(2, 1, 'Drake’s Fury', 3, 1, NULL, NULL, NULL, NULL),
(3, 2, 'Blade of Shadows', 4, 5, NULL, NULL, NULL, NULL),
(4, 3, 'Crimson Bastion', 7, 6, 8, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `team_relics`
--

CREATE TABLE `team_relics` (
  `team_id` int(11) NOT NULL,
  `relic_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `team_relics`
--

INSERT INTO `team_relics` (`team_id`, `relic_id`) VALUES
(1, 5),
(2, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `icon` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `username`, `role`, `icon`) VALUES
(1, 'alice@example.com', 'securepassword123', 'alice_wonder', 'user', NULL),
(2, 'admin@email.com', '$2y$10$TTyBX9wXkCgrJRIY/8.1IOBSdwMlhbBpt5ZL8LJAS75aWHaLszQOW', 'bob_builder', 'user', NULL),
(3, 'charlie@example.com', 'randompass789', 'charlie_chap', 'user', NULL),
(4, 'admin@gmail.com', '$2y$10$5BkEOcLyJ3k2o/DacN5EXeHjQJWkTJPGJKot.H3PmDZLqcnRb0Vue', 'username 1', 'user', NULL),
(5, 'admin1@gmail.com', '$2y$10$4NnPSSa39pyuYLZOxiM0UeTUYO3HBLUV5HTwSM0.YExmVTEfDmc8.', 'admin1@gmail.com', 'user', NULL),
(6, 'ng@gmail.com', '$2y$10$Naq6e32jtsUnRe/5ESjwfOiYESep8Wbmk9sMY4csJwXv3M8Q76XZe', 'ssksk', 'user', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_heroes`
--

CREATE TABLE `user_heroes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `hero_id` int(11) NOT NULL,
  `level` int(11) DEFAULT 1,
  `xp` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user_heroes`
--

INSERT INTO `user_heroes` (`id`, `user_id`, `hero_id`, `level`, `xp`) VALUES
(1, 4, 1, 3, 10),
(2, 4, 2, 2, 10),
(3, 4, 4, 4, 90),
(4, 4, 3, 1, 0),
(5, 4, 5, 2, 0),
(6, 2, 1, 2, 0),
(7, 2, 2, 3, 0),
(8, 2, 3, 1, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_hero_accessories`
--

CREATE TABLE `user_hero_accessories` (
  `user_hero_id` int(11) NOT NULL,
  `accessory_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user_hero_accessories`
--

INSERT INTO `user_hero_accessories` (`user_hero_id`, `accessory_id`) VALUES
(2, 4),
(2, 9),
(5, 4),
(7, 9),
(8, 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_hero_legacies`
--

CREATE TABLE `user_hero_legacies` (
  `user_hero_id` int(11) NOT NULL,
  `legacy_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user_hero_legacies`
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
-- Cấu trúc bảng cho bảng `user_hero_stats`
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
-- Đang đổ dữ liệu cho bảng `user_hero_stats`
--

INSERT INTO `user_hero_stats` (`id`, `user_hero_id`, `ATK`, `Spell`, `ATK_SPEED`, `MP`, `HP`, `Damage_Dealt`, `Normal_Attack_Amplification`, `Skill_Amplification`, `Special_Damage`, `Physical_CRIT_Damage`, `Spell_CRIT_Damage`, `Physical_CRIT_Chance`, `Spell_CRIT_Chance`, `Physical_DEF`, `Spell_DEF`, `Mighty_Block`, `Damage_Taken`, `EVA`, `Outgoing_Healing`, `Guard`, `Physical_HP_Drain`, `Spell_HP_Drain`, `Execution_Rate`) VALUES
(1, 1, 40, 100, 0.80, 140, 350, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 5, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(2, 2, 60, 20, 0.60, 70, 750, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 25, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(3, 3, 90, 30, 1.20, 90, 450, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 10, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(4, 4, 80, 70, 0.90, 110, 550, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 15, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(5, 5, 100, 10, 1.10, 80, 400, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 5, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(6, 6, 40, 100, 0.80, 140, 350, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 5, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(7, 7, 60, 20, 0.60, 70, 750, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 25, 1, 0.00, 1, 0, 0.00, 0.00, 0.00),
(8, 8, 90, 30, 1.20, 90, 450, 1, 0.00, 0.00, 1, 1.50, 1.50, 0.00, 0.00, 0, 0, 10, 1, 0.00, 1, 0, 0.00, 0.00, 0.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `xp_amounts`
--

CREATE TABLE `xp_amounts` (
  `id` int(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `value` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `xp_amounts`
--

INSERT INTO `xp_amounts` (`id`, `type`, `value`) VALUES
(1, 'win_match', 100),
(2, 'xp_bottle', 5),
(3, 'summon_duplicate', 25),
(4, 'complete_quest', 50),
(5, 'defeat_boss', 200),
(6, 'daily_login', 10),
(7, 'friend_support', 15),
(8, 'upgrade_hero', 30),
(9, 'collect_item', 8),
(10, 'participate_event', 40),
(11, 'win_match', 100),
(12, 'xp_bottle', 5),
(13, 'summon_duplicate', 25),
(14, 'complete_quest', 50),
(15, 'defeat_boss', 200),
(16, 'daily_login', 10),
(17, 'friend_support', 15),
(18, 'upgrade_hero', 30),
(19, 'collect_item', 8),
(20, 'participate_event', 40),
(21, 'win_match', 100),
(22, 'xp_bottle', 5),
(23, 'summon_duplicate', 25),
(24, 'complete_quest', 50),
(25, 'defeat_boss', 200),
(26, 'daily_login', 10),
(27, 'friend_support', 15),
(28, 'upgrade_hero', 30),
(29, 'collect_item', 8),
(30, 'participate_event', 40),
(31, 'win_match', 100),
(32, 'xp_bottle', 5),
(33, 'summon_duplicate', 25),
(34, 'complete_quest', 50),
(35, 'defeat_boss', 200),
(36, 'daily_login', 10),
(37, 'friend_support', 15),
(38, 'upgrade_hero', 30),
(39, 'collect_item', 8),
(40, 'participate_event', 40);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `enemies`
--
ALTER TABLE `enemies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `region_id` (`region_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Chỉ mục cho bảng `enemy_base_stats`
--
ALTER TABLE `enemy_base_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enemy_id` (`enemy_id`);

--
-- Chỉ mục cho bảng `enemy_skills`
--
ALTER TABLE `enemy_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enemy_id` (`enemy_id`);

--
-- Chỉ mục cho bảng `heroes`
--
ALTER TABLE `heroes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `region_id` (`region_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Chỉ mục cho bảng `hero_base_stats`
--
ALTER TABLE `hero_base_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hero_id` (`hero_id`);

--
-- Chỉ mục cho bảng `hero_skills`
--
ALTER TABLE `hero_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hero_id` (`hero_id`);

--
-- Chỉ mục cho bảng `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`user_id`,`item_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Chỉ mục cho bảng `item_effects`
--
ALTER TABLE `item_effects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`);

--
-- Chỉ mục cho bảng `level_requirements`
--
ALTER TABLE `level_requirements`
  ADD PRIMARY KEY (`level`);

--
-- Chỉ mục cho bảng `mails`
--
ALTER TABLE `mails`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `sundries`
--
ALTER TABLE `sundries`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `teams`
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
-- Chỉ mục cho bảng `team_relics`
--
ALTER TABLE `team_relics`
  ADD PRIMARY KEY (`team_id`,`relic_id`),
  ADD KEY `relic_id` (`relic_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Chỉ mục cho bảng `user_heroes`
--
ALTER TABLE `user_heroes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `hero_id` (`hero_id`);

--
-- Chỉ mục cho bảng `user_hero_accessories`
--
ALTER TABLE `user_hero_accessories`
  ADD PRIMARY KEY (`user_hero_id`,`accessory_id`),
  ADD KEY `accessory_id` (`accessory_id`);

--
-- Chỉ mục cho bảng `user_hero_legacies`
--
ALTER TABLE `user_hero_legacies`
  ADD PRIMARY KEY (`user_hero_id`),
  ADD KEY `legacy_id` (`legacy_id`);

--
-- Chỉ mục cho bảng `user_hero_stats`
--
ALTER TABLE `user_hero_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_hero_id` (`user_hero_id`);

--
-- Chỉ mục cho bảng `xp_amounts`
--
ALTER TABLE `xp_amounts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `enemies`
--
ALTER TABLE `enemies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `enemy_base_stats`
--
ALTER TABLE `enemy_base_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `enemy_skills`
--
ALTER TABLE `enemy_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `heroes`
--
ALTER TABLE `heroes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `hero_base_stats`
--
ALTER TABLE `hero_base_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `hero_skills`
--
ALTER TABLE `hero_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `item_effects`
--
ALTER TABLE `item_effects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `mails`
--
ALTER TABLE `mails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `regions`
--
ALTER TABLE `regions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `sundries`
--
ALTER TABLE `sundries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `user_heroes`
--
ALTER TABLE `user_heroes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `user_hero_stats`
--
ALTER TABLE `user_hero_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `xp_amounts`
--
ALTER TABLE `xp_amounts`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `enemies`
--
ALTER TABLE `enemies`
  ADD CONSTRAINT `enemies_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `enemies_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `enemy_base_stats`
--
ALTER TABLE `enemy_base_stats`
  ADD CONSTRAINT `enemy_base_stats_ibfk_1` FOREIGN KEY (`enemy_id`) REFERENCES `enemies` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `enemy_skills`
--
ALTER TABLE `enemy_skills`
  ADD CONSTRAINT `enemy_skills_ibfk_1` FOREIGN KEY (`enemy_id`) REFERENCES `enemies` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `heroes`
--
ALTER TABLE `heroes`
  ADD CONSTRAINT `heroes_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `heroes_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `hero_base_stats`
--
ALTER TABLE `hero_base_stats`
  ADD CONSTRAINT `hero_base_stats_ibfk_1` FOREIGN KEY (`hero_id`) REFERENCES `heroes` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `hero_skills`
--
ALTER TABLE `hero_skills`
  ADD CONSTRAINT `hero_skills_ibfk_1` FOREIGN KEY (`hero_id`) REFERENCES `heroes` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `sundries` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `item_effects`
--
ALTER TABLE `item_effects`
  ADD CONSTRAINT `item_effects_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `sundries` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `teams`
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
-- Các ràng buộc cho bảng `team_relics`
--
ALTER TABLE `team_relics`
  ADD CONSTRAINT `team_relics_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `team_relics_ibfk_2` FOREIGN KEY (`relic_id`) REFERENCES `sundries` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_heroes`
--
ALTER TABLE `user_heroes`
  ADD CONSTRAINT `user_heroes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_heroes_ibfk_2` FOREIGN KEY (`hero_id`) REFERENCES `heroes` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_hero_accessories`
--
ALTER TABLE `user_hero_accessories`
  ADD CONSTRAINT `user_hero_accessories_ibfk_1` FOREIGN KEY (`user_hero_id`) REFERENCES `user_heroes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_hero_accessories_ibfk_2` FOREIGN KEY (`accessory_id`) REFERENCES `sundries` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_hero_legacies`
--
ALTER TABLE `user_hero_legacies`
  ADD CONSTRAINT `user_hero_legacies_ibfk_1` FOREIGN KEY (`user_hero_id`) REFERENCES `user_heroes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_hero_legacies_ibfk_2` FOREIGN KEY (`legacy_id`) REFERENCES `sundries` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_hero_stats`
--
ALTER TABLE `user_hero_stats`
  ADD CONSTRAINT `user_hero_stats_ibfk_1` FOREIGN KEY (`user_hero_id`) REFERENCES `user_heroes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
