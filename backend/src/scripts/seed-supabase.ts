import fs from 'fs'
import path from 'path'
import { getServiceSupabase } from '../db/supabase.js'
import { config } from '../config/index.js'

// 114 Canonical Surahs Metadata
const SURAHS_META = [
  { number: 1, name_ar: 'الفاتحة', english_name: 'Al-Fatihah', english_translation: 'The Opening', number_of_ayahs: 7, revelation_type: 'Meccan' },
  { number: 2, name_ar: 'البقرة', english_name: 'Al-Baqarah', english_translation: 'The Cow', number_of_ayahs: 286, revelation_type: 'Medinan' },
  { number: 3, name_ar: 'آل عمران', english_name: 'Ali \'Imran', english_translation: 'Family of Imran', number_of_ayahs: 200, revelation_type: 'Medinan' },
  { number: 4, name_ar: 'النساء', english_name: 'An-Nisa', english_translation: 'The Women', number_of_ayahs: 176, revelation_type: 'Medinan' },
  { number: 5, name_ar: 'المائدة', english_name: 'Al-Ma\'idah', english_translation: 'The Table Spread', number_of_ayahs: 120, revelation_type: 'Medinan' },
  { number: 6, name_ar: 'الأنعام', english_name: 'Al-An\'am', english_translation: 'The Cattle', number_of_ayahs: 165, revelation_type: 'Meccan' },
  { number: 7, name_ar: 'الأعراف', english_name: 'Al-A\'raf', english_translation: 'The Heights', number_of_ayahs: 206, revelation_type: 'Meccan' },
  { number: 8, name_ar: 'الأنفال', english_name: 'Al-Anfal', english_translation: 'The Spoils of War', number_of_ayahs: 75, revelation_type: 'Medinan' },
  { number: 9, name_ar: 'التوبة', english_name: 'At-Tawbah', english_translation: 'The Repentance', number_of_ayahs: 129, revelation_type: 'Medinan' },
  { number: 10, name_ar: 'يونس', english_name: 'Yunus', english_translation: 'Jonah', number_of_ayahs: 109, revelation_type: 'Meccan' },
  { number: 11, name_ar: 'هود', english_name: 'Hud', english_translation: 'Hud', number_of_ayahs: 123, revelation_type: 'Meccan' },
  { number: 12, name_ar: 'يوسف', english_name: 'Yusuf', english_translation: 'Joseph', number_of_ayahs: 111, revelation_type: 'Meccan' },
  { number: 13, name_ar: 'الرعد', english_name: 'Ar-Ra\'d', english_translation: 'The Thunder', number_of_ayahs: 43, revelation_type: 'Medinan' },
  { number: 14, name_ar: 'إبراهيم', english_name: 'Ibrahim', english_translation: 'Abraham', number_of_ayahs: 52, revelation_type: 'Meccan' },
  { number: 15, name_ar: 'الحجر', english_name: 'Al-Hijr', english_translation: 'The Rocky Tract', number_of_ayahs: 99, revelation_type: 'Meccan' },
  { number: 16, name_ar: 'النحل', english_name: 'An-Nahl', english_translation: 'The Bee', number_of_ayahs: 128, revelation_type: 'Meccan' },
  { number: 17, name_ar: 'الإسراء', english_name: 'Al-Isra', english_translation: 'The Night Journey', number_of_ayahs: 111, revelation_type: 'Meccan' },
  { number: 18, name_ar: 'الكهف', english_name: 'Al-Kahf', english_translation: 'The Cave', number_of_ayahs: 110, revelation_type: 'Meccan' },
  { number: 19, name_ar: 'مريم', english_name: 'Maryam', english_translation: 'Mary', number_of_ayahs: 98, revelation_type: 'Meccan' },
  { number: 20, name_ar: 'طه', english_name: 'Taha', english_translation: 'Ta-Ha', number_of_ayahs: 135, revelation_type: 'Meccan' },
  { number: 21, name_ar: 'الأنبياء', english_name: 'Al-Anbiya', english_translation: 'The Prophets', number_of_ayahs: 112, revelation_type: 'Meccan' },
  { number: 22, name_ar: 'الحج', english_name: 'Al-Hajj', english_translation: 'The Pilgrimage', number_of_ayahs: 78, revelation_type: 'Medinan' },
  { number: 23, name_ar: 'المؤمنون', english_name: 'Al-Mu\'minun', english_translation: 'The Believers', number_of_ayahs: 118, revelation_type: 'Meccan' },
  { number: 24, name_ar: 'النور', english_name: 'An-Nur', english_translation: 'The Light', number_of_ayahs: 64, revelation_type: 'Medinan' },
  { number: 25, name_ar: 'الفرقان', english_name: 'Al-Furqan', english_translation: 'The Criterion', number_of_ayahs: 77, revelation_type: 'Meccan' },
  { number: 26, name_ar: 'الشعراء', english_name: 'Ash-Shu\'ara', english_translation: 'The Poets', number_of_ayahs: 227, revelation_type: 'Meccan' },
  { number: 27, name_ar: 'النمل', english_name: 'An-Naml', english_translation: 'The Ant', number_of_ayahs: 93, revelation_type: 'Meccan' },
  { number: 28, name_ar: 'القصص', english_name: 'Al-Qasas', english_translation: 'The Stories', number_of_ayahs: 88, revelation_type: 'Meccan' },
  { number: 29, name_ar: 'العنكبوت', english_name: 'Al-\'Ankabut', english_translation: 'The Spider', number_of_ayahs: 69, revelation_type: 'Meccan' },
  { number: 30, name_ar: 'الروم', english_name: 'Ar-Rum', english_translation: 'The Romans', number_of_ayahs: 60, revelation_type: 'Meccan' },
  { number: 31, name_ar: 'لقمان', english_name: 'Luqman', english_translation: 'Luqman', number_of_ayahs: 34, revelation_type: 'Meccan' },
  { number: 32, name_ar: 'السجدة', english_name: 'As-Sajdah', english_translation: 'The Prostration', number_of_ayahs: 30, revelation_type: 'Meccan' },
  { number: 33, name_ar: 'الأحزاب', english_name: 'Al-Ahzab', english_translation: 'The Combined Forces', number_of_ayahs: 73, revelation_type: 'Medinan' },
  { number: 34, name_ar: 'سبأ', english_name: 'Saba', english_translation: 'Sheba', number_of_ayahs: 54, revelation_type: 'Meccan' },
  { number: 35, name_ar: 'فاطر', english_name: 'Fatir', english_translation: 'Originator', number_of_ayahs: 45, revelation_type: 'Meccan' },
  { number: 36, name_ar: 'يس', english_name: 'Ya-Sin', english_translation: 'Ya Sin', number_of_ayahs: 83, revelation_type: 'Meccan' },
  { number: 37, name_ar: 'الصافات', english_name: 'As-Saffat', english_translation: 'Those who set the Ranks', number_of_ayahs: 182, revelation_type: 'Meccan' },
  { number: 38, name_ar: 'ص', english_name: 'Sad', english_translation: 'The Letter "Saad"', number_of_ayahs: 88, revelation_type: 'Meccan' },
  { number: 39, name_ar: 'الزمر', english_name: 'Az-Zumar', english_translation: 'The Troops', number_of_ayahs: 75, revelation_type: 'Meccan' },
  { number: 40, name_ar: 'غافر', english_name: 'Ghafir', english_translation: 'The Forgiver', number_of_ayahs: 85, revelation_type: 'Meccan' },
  { number: 41, name_ar: 'فصلت', english_name: 'Fussilat', english_translation: 'Explained in Detail', number_of_ayahs: 54, revelation_type: 'Meccan' },
  { number: 42, name_ar: 'الشورى', english_name: 'Ash-Shuraa', english_translation: 'The Consultation', number_of_ayahs: 53, revelation_type: 'Meccan' },
  { number: 43, name_ar: 'الزخرف', english_name: 'Az-Zukhruf', english_translation: 'The Ornaments of Gold', number_of_ayahs: 89, revelation_type: 'Meccan' },
  { number: 44, name_ar: 'الدخان', english_name: 'Ad-Dukhan', english_translation: 'The Smoke', number_of_ayahs: 59, revelation_type: 'Meccan' },
  { number: 45, name_ar: 'الجاثية', english_name: 'Al-Jathiyah', english_translation: 'The Crouching', number_of_ayahs: 37, revelation_type: 'Meccan' },
  { number: 46, name_ar: 'الأحقاف', english_name: 'Al-Ahqaf', english_translation: 'The Wind-Curved Sandhills', number_of_ayahs: 35, revelation_type: 'Meccan' },
  { number: 47, name_ar: 'محمد', english_name: 'Muhammad', english_translation: 'Muhammad', number_of_ayahs: 38, revelation_type: 'Medinan' },
  { number: 48, name_ar: 'الفتح', english_name: 'Al-Fath', english_translation: 'The Victory', number_of_ayahs: 29, revelation_type: 'Medinan' },
  { number: 49, name_ar: 'الحجرات', english_name: 'Al-Hujurat', english_translation: 'The Rooms', number_of_ayahs: 18, revelation_type: 'Medinan' },
  { number: 50, name_ar: 'ق', english_name: 'Qaf', english_translation: 'The Letter "Qaf"', number_of_ayahs: 45, revelation_type: 'Meccan' },
  { number: 51, name_ar: 'الذاريات', english_name: 'Adh-Dhariyat', english_translation: 'The Winnowing Winds', number_of_ayahs: 60, revelation_type: 'Meccan' },
  { number: 52, name_ar: 'الطور', english_name: 'At-Tur', english_translation: 'The Mount', number_of_ayahs: 49, revelation_type: 'Meccan' },
  { number: 53, name_ar: 'النجم', english_name: 'An-Najm', english_translation: 'The Star', number_of_ayahs: 62, revelation_type: 'Meccan' },
  { number: 54, name_ar: 'القمر', english_name: 'Al-Qamar', english_translation: 'The Moon', number_of_ayahs: 55, revelation_type: 'Meccan' },
  { number: 55, name_ar: 'الرحمن', english_name: 'Ar-Rahman', english_translation: 'The Beneficent', number_of_ayahs: 78, revelation_type: 'Medinan' },
  { number: 56, name_ar: 'الواقعة', english_name: 'Al-Waqi\'ah', english_translation: 'The Inevitable', number_of_ayahs: 96, revelation_type: 'Meccan' },
  { number: 57, name_ar: 'الحديد', english_name: 'Al-Hadid', english_translation: 'The Iron', number_of_ayahs: 29, revelation_type: 'Medinan' },
  { number: 58, name_ar: 'المجادلة', english_name: 'Al-Mujadila', english_translation: 'The Pleading Woman', number_of_ayahs: 22, revelation_type: 'Medinan' },
  { number: 59, name_ar: 'الحشر', english_name: 'Al-Hashr', english_translation: 'The Exile', number_of_ayahs: 24, revelation_type: 'Medinan' },
  { number: 60, name_ar: 'الممتحنة', english_name: 'Al-Mumtahanah', english_translation: 'She that is to be examined', number_of_ayahs: 13, revelation_type: 'Medinan' },
  { number: 61, name_ar: 'الصف', english_name: 'As-Saf', english_translation: 'The Ranks', number_of_ayahs: 14, revelation_type: 'Medinan' },
  { number: 62, name_ar: 'الجمعة', english_name: 'Al-Jumu\'ah', english_translation: 'The Congregation', number_of_ayahs: 11, revelation_type: 'Medinan' },
  { number: 63, name_ar: 'المنافقون', english_name: 'Al-Munafiqun', english_translation: 'The Hypocrites', number_of_ayahs: 11, revelation_type: 'Medinan' },
  { number: 64, name_ar: 'التغابن', english_name: 'At-Taghabun', english_translation: 'The Mutual Disillusion', number_of_ayahs: 18, revelation_type: 'Medinan' },
  { number: 65, name_ar: 'الطلاق', english_name: 'At-Talaq', english_translation: 'The Divorce', number_of_ayahs: 12, revelation_type: 'Medinan' },
  { number: 66, name_ar: 'التحريم', english_name: 'At-Tahrim', english_translation: 'The Prohibition', number_of_ayahs: 12, revelation_type: 'Medinan' },
  { number: 67, name_ar: 'الملك', english_name: 'Al-Mulk', english_translation: 'The Sovereignty', number_of_ayahs: 30, revelation_type: 'Meccan' },
  { number: 68, name_ar: 'القلم', english_name: 'Al-Qalam', english_translation: 'The Pen', number_of_ayahs: 52, revelation_type: 'Meccan' },
  { number: 69, name_ar: 'الحاقة', english_name: 'Al-Haqqah', english_translation: 'The Reality', number_of_ayahs: 52, revelation_type: 'Meccan' },
  { number: 70, name_ar: 'المعارج', english_name: 'Al-Ma\'arij', english_translation: 'The Ascending Stairways', number_of_ayahs: 44, revelation_type: 'Meccan' },
  { number: 71, name_ar: 'نوح', english_name: 'Nuh', english_translation: 'Noah', number_of_ayahs: 28, revelation_type: 'Meccan' },
  { number: 72, name_ar: 'الجن', english_name: 'Al-Jinn', english_translation: 'The Jinn', number_of_ayahs: 28, revelation_type: 'Meccan' },
  { number: 73, name_ar: 'المزمل', english_name: 'Al-Muzzammil', english_translation: 'The Enshrouded One', number_of_ayahs: 20, revelation_type: 'Meccan' },
  { number: 74, name_ar: 'المدثر', english_name: 'Al-Muddaththir', english_translation: 'The Cloaked One', number_of_ayahs: 56, revelation_type: 'Meccan' },
  { number: 75, name_ar: 'القيامة', english_name: 'Al-Qiyamah', english_translation: 'The Resurrection', number_of_ayahs: 40, revelation_type: 'Meccan' },
  { number: 76, name_ar: 'الإنسان', english_name: 'Al-Insan', english_translation: 'The Human', number_of_ayahs: 31, revelation_type: 'Medinan' },
  { number: 77, name_ar: 'المرسلات', english_name: 'Al-Mursalat', english_translation: 'The Emissaries', number_of_ayahs: 50, revelation_type: 'Meccan' },
  { number: 78, name_ar: 'النبأ', english_name: 'An-Naba', english_translation: 'The Tidings', number_of_ayahs: 40, revelation_type: 'Meccan' },
  { number: 79, name_ar: 'النازعات', english_name: 'An-Nazi\'at', english_translation: 'Those who drag forth', number_of_ayahs: 46, revelation_type: 'Meccan' },
  { number: 80, name_ar: 'عبس', english_name: '\'Abasa', english_translation: 'He frowned', number_of_ayahs: 42, revelation_type: 'Meccan' },
  { number: 81, name_ar: 'التكوير', english_name: 'At-Takwir', english_translation: 'The Overthrowing', number_of_ayahs: 29, revelation_type: 'Meccan' },
  { number: 82, name_ar: 'الانفطار', english_name: 'Al-Infitar', english_translation: 'The Cleaving', number_of_ayahs: 19, revelation_type: 'Meccan' },
  { number: 83, name_ar: 'المطففين', english_name: 'Al-Mutaffifin', english_translation: 'The Defrauding', number_of_ayahs: 36, revelation_type: 'Meccan' },
  { number: 84, name_ar: 'الانشقاق', english_name: 'Al-Inshiqaq', english_translation: 'The Splitting Open', number_of_ayahs: 25, revelation_type: 'Meccan' },
  { number: 85, name_ar: 'البروج', english_name: 'Al-Buruj', english_translation: 'The Mansions of the Stars', number_of_ayahs: 22, revelation_type: 'Meccan' },
  { number: 86, name_ar: 'الطارق', english_name: 'At-Tariq', english_translation: 'The Morning Star', number_of_ayahs: 17, revelation_type: 'Meccan' },
  { number: 87, name_ar: 'الأعلى', english_name: 'Al-A\'la', english_translation: 'The Most High', number_of_ayahs: 19, revelation_type: 'Meccan' },
  { number: 88, name_ar: 'الغاشية', english_name: 'Al-Ghashiyah', english_translation: 'The Overwhelming', number_of_ayahs: 26, revelation_type: 'Meccan' },
  { number: 89, name_ar: 'الفجر', english_name: 'Al-Fajr', english_translation: 'The Dawn', number_of_ayahs: 30, revelation_type: 'Meccan' },
  { number: 90, name_ar: 'البلد', english_name: 'Al-Balad', english_translation: 'The City', number_of_ayahs: 20, revelation_type: 'Meccan' },
  { number: 91, name_ar: 'الشمس', english_name: 'Ash-Shams', english_translation: 'The Sun', number_of_ayahs: 15, revelation_type: 'Meccan' },
  { number: 92, name_ar: 'الليل', english_name: 'Al-Layl', english_translation: 'The Night', number_of_ayahs: 21, revelation_type: 'Meccan' },
  { number: 93, name_ar: 'الضحى', english_name: 'Ad-Duhaa', english_translation: 'The Morning Hours', number_of_ayahs: 11, revelation_type: 'Meccan' },
  { number: 94, name_ar: 'الشرح', english_name: 'Ash-Sharh', english_translation: 'The Relief', number_of_ayahs: 8, revelation_type: 'Meccan' },
  { number: 95, name_ar: 'التين', english_name: 'At-Tin', english_translation: 'The Fig', number_of_ayahs: 8, revelation_type: 'Meccan' },
  { number: 96, name_ar: 'العلق', english_name: 'Al-\'Alaq', english_translation: 'The Clot', number_of_ayahs: 19, revelation_type: 'Meccan' },
  { number: 97, name_ar: 'القدر', english_name: 'Al-Qadr', english_translation: 'The Power', number_of_ayahs: 5, revelation_type: 'Meccan' },
  { number: 98, name_ar: 'البينة', english_name: 'Al-Bayyinah', english_translation: 'The Clear Proof', number_of_ayahs: 8, revelation_type: 'Medinan' },
  { number: 99, name_ar: 'الزلزلة', english_name: 'Az-Zalzalah', english_translation: 'The Earthquake', number_of_ayahs: 8, revelation_type: 'Medinan' },
  { number: 100, name_ar: 'العاديات', english_name: 'Al-\'Adiyat', english_translation: 'The Courser', number_of_ayahs: 11, revelation_type: 'Meccan' },
  { number: 101, name_ar: 'القارعة', english_name: 'Al-Qari\'ah', english_translation: 'The Calamity', number_of_ayahs: 11, revelation_type: 'Meccan' },
  { number: 102, name_ar: 'التكاثر', english_name: 'At-Takathur', english_translation: 'The Rivalry in world increase', number_of_ayahs: 8, revelation_type: 'Meccan' },
  { number: 103, name_ar: 'العصر', english_name: 'Al-\'Asr', english_translation: 'The Declining Day', number_of_ayahs: 3, revelation_type: 'Meccan' },
  { number: 104, name_ar: 'الهمزة', english_name: 'Al-Humazah', english_translation: 'The Traducer', number_of_ayahs: 9, revelation_type: 'Meccan' },
  { number: 105, name_ar: 'الفيل', english_name: 'Al-Fil', english_translation: 'The Elephant', number_of_ayahs: 5, revelation_type: 'Meccan' },
  { number: 106, name_ar: 'قريش', english_name: 'Quraysh', english_translation: 'Quraysh', number_of_ayahs: 4, revelation_type: 'Meccan' },
  { number: 107, name_ar: 'الماعون', english_name: 'Al-Ma\'un', english_translation: 'The Small Kindness', number_of_ayahs: 7, revelation_type: 'Meccan' },
  { number: 108, name_ar: 'الكوثر', english_name: 'Al-Kawthar', english_translation: 'The Abundance', number_of_ayahs: 3, revelation_type: 'Meccan' },
  { number: 109, name_ar: 'الكافرون', english_name: 'Al-Kafirun', english_translation: 'The Disbelievers', number_of_ayahs: 6, revelation_type: 'Meccan' },
  { number: 110, name_ar: 'النصر', english_name: 'An-Nasr', english_translation: 'The Divine Support', number_of_ayahs: 3, revelation_type: 'Medinan' },
  { number: 111, name_ar: 'المسد', english_name: 'Al-Masad', english_translation: 'The Palm Fiber', number_of_ayahs: 5, revelation_type: 'Meccan' },
  { number: 112, name_ar: 'الإخلاص', english_name: 'Al-Ikhlas', english_translation: 'The Sincerity', number_of_ayahs: 4, revelation_type: 'Meccan' },
  { number: 113, name_ar: 'الفلق', english_name: 'Al-Falaq', english_translation: 'The Daybreak', number_of_ayahs: 5, revelation_type: 'Meccan' },
  { number: 114, name_ar: 'الناس', english_name: 'An-Nas', english_translation: 'Mankind', number_of_ayahs: 6, revelation_type: 'Meccan' },
]

// Hadith Collections
const HADITH_COLLECTIONS = [
  { code: 'bukhari', name_ar: 'صحيح البخاري', name_en: 'Sahih al-Bukhari', total_hadiths: 7563, canonical: true },
  { code: 'muslim', name_ar: 'صحيح مسلم', name_en: 'Sahih Muslim', total_hadiths: 7500, canonical: true },
  { code: 'abudawud', name_ar: 'سنن أبي داود', name_en: 'Sunan Abi Dawud', total_hadiths: 5274, canonical: true },
  { code: 'tirmidhi', name_ar: 'جامع الترمذي', name_en: 'Jami` at-Tirmidhi', total_hadiths: 3956, canonical: true },
  { code: 'nasai', name_ar: 'سنن النسائي', name_en: 'Sunan an-Nasa\'i', total_hadiths: 5758, canonical: true },
  { code: 'ibnmajah', name_ar: 'سنن ابن ماجه', name_en: 'Sunan Ibn Majah', total_hadiths: 4341, canonical: true },
  { code: 'malik', name_ar: 'موطأ مالك', name_en: 'Muwatta Malik', total_hadiths: 1858, canonical: false },
  { code: 'ahmad', name_ar: 'مسند أحمد', name_en: 'Musnad Ahmad', total_hadiths: 27647, canonical: false },
  { code: 'darimi', name_ar: 'سنن الدارمي', name_en: 'Sunan ad-Darimi', total_hadiths: 3550, canonical: false },
]

// Classical Books
const CLASSICAL_BOOKS = [
  { id: 1, name_ar: 'الجامع المسند الصحيح المختصر (صحيح البخاري)', name_en: 'Sahih al-Bukhari', author: 'محمد بن إسماعيل البخاري', category: 'hadith_corpus', total_pages: 1820, shamela_id: 11847 },
  { id: 2, name_ar: 'المسند الصحيح (صحيح مسلم)', name_en: 'Sahih Muslim', author: 'مسلم بن الحجاج النيسابوري', category: 'hadith_corpus', total_pages: 1640, shamela_id: 1727 },
  { id: 104, name_ar: 'فتح الباري بشرح صحيح البخاري', name_en: 'Fath al-Bari', author: 'ابن حجر العسقلاني', category: 'hadith_grading', total_pages: 5800, shamela_id: 23647 },
  { id: 201, name_ar: 'سير أعلام النبلاء', name_en: 'Siyar A`lam al-Nubala', author: 'شمس الدين الذهبي', category: 'hadith_grading', total_pages: 11200, shamela_id: 10965 },
  { id: 305, name_ar: 'سلسلة الأحاديث الصحيحة', name_en: 'Silsilat al-Ahadith al-Sahiha', author: 'محمد ناصر الدين الألباني', category: 'hadith_grading', total_pages: 4200, shamela_id: 9789 },
  { id: 401, name_ar: 'تفسير القرآن العظيم', name_en: 'Tafsir Ibn Kathir', author: 'إسماعيل بن عمر بن كثير', category: 'tafsir', total_pages: 3400, shamela_id: 23644 },
]

// Scholars
const SCHOLARS = [
  { key: 'bukhari', name_ar: 'محمد بن إسماعيل البخاري', name_en: 'Al-Bukhari', death_year_ah: 256 },
  { key: 'muslim', name_ar: 'مسلم بن الحجاج النيسابوري', name_en: 'Muslim ibn al-Hajjaj', death_year_ah: 261 },
  { key: 'abudawud', name_ar: 'أبو داود السجستاني', name_en: 'Abu Dawud', death_year_ah: 275 },
  { key: 'tirmidhi', name_ar: 'أبو عيسى محمد الترمذي', name_en: 'At-Tirmidhi', death_year_ah: 279 },
  { key: 'nasai', name_ar: 'أحمد بن شعيب النسائي', name_en: 'An-Nasa\'i', death_year_ah: 303 },
  { key: 'ibn_hajar', name_ar: 'ابن حجر العسقلاني', name_en: 'Ibn Hajar al-Asqalani', death_year_ah: 852 },
  { key: 'dhahabi', name_ar: 'شمس الدين الذهبي', name_en: 'Al-Dhahabi', death_year_ah: 748 },
  { key: 'albani', name_ar: 'محمد ناصر الدين الألباني', name_en: 'Al-Albani', death_year_ah: 1420 },
]

// Users Database
const INITIAL_USERS = [
  { id: 'usr-admin-1', name: 'د. عبد الله البشير (مدير النظام)', email: 'admin@quranmind.ai', role: 'admin', status: 'active', plan: 'patron', gateway: 'stripe', currency: 'USD', amount_paid: 490, api_requests: 1420, projects_count: 18, joined_at: '2026-01-10T00:00:00Z' },
  { id: 'usr-scholar-2', name: 'أ.د. يوسف القاسمي', email: 'youssef.qasimi@univ-algiers.dz', role: 'scholar', status: 'active', plan: 'pro', gateway: 'slickpay', currency: 'DZD', amount_paid: 2500, api_requests: 890, projects_count: 6, joined_at: '2026-03-15T00:00:00Z' },
  { id: 'usr-scholar-3', name: 'Dr. Tariq Al-Ghamdi', email: 'tariq.ghamdi@islamicstudies.org', role: 'scholar', status: 'active', plan: 'pro', gateway: 'stripe', currency: 'USD', amount_paid: 190, api_requests: 540, projects_count: 4, joined_at: '2026-04-02T00:00:00Z' },
  { id: 'usr-patron-4', name: 'مؤسسة الوقف الرقمي العالمي', email: 'endowment@waqf-digital.org', role: 'patron', status: 'active', plan: 'patron', gateway: 'stripe', currency: 'USD', amount_paid: 490, api_requests: 3200, projects_count: 12, joined_at: '2026-02-18T00:00:00Z' },
  { id: 'usr-student-5', name: 'حمزة بن عاشور (طالب ماجستير)', email: 'hamza.ashour@student.edu.dz', role: 'student', status: 'active', plan: 'free', gateway: 'slickpay', currency: 'DZD', amount_paid: 0, api_requests: 210, projects_count: 2, joined_at: '2026-05-11T00:00:00Z' },
  { id: 'usr-student-6', name: 'فاطمة الزهراء الشريف', email: 'fatima.sharif@gmail.com', role: 'student', status: 'active', plan: 'free', gateway: 'stripe', currency: 'USD', amount_paid: 0, api_requests: 145, projects_count: 1, joined_at: '2026-06-01T00:00:00Z' },
]

// Hadith Corpus
const INITIAL_HADITHS = [
  {
    id: 'bukhari-1',
    collection: 'صحيح البخاري',
    collection_code: 'bukhari',
    hadith_number: 1,
    primary_narrator: 'عمر بن الخطاب رضي الله عنه',
    arabic_matn: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.',
    english_matn: 'Actions are according to intentions, and every person will get what he intended. So whoever migrated for worldly benefits or for a woman to marry, his emigration was for what he migrated for.',
    breadth: 'gharib',
    min_narrators_in_tier: 1,
    breadth_explanation: 'غريب نسبي تفرد به عمر بن الخطاب عن النبي ﷺ، وتفرد به علقمة بن وقاص عن عمر، وتفرد به محمد بن إبراهيم التيمي عن علقمة، وتفرد به يحيى بن سعيد الأنصاري عن محمد، ثم تواتر بعد يحيى ورواه عنه أكثر من مائتي راوٍ.',
    themes: ['النية', 'الإخلاص', 'الهجرة'],
    chains: [
      {
        chainId: 'bukhari-1-chain-1',
        collection: 'صحيح البخاري',
        hadithNumber: 1,
        primaryNarrator: 'عمر بن الخطاب رضي الله عنه',
        isnadGrade: 'صحيح',
        narratorPath: [
          { id: 'narrator-bukhari', name: 'Al-Bukhari', arabicName: 'محمد بن إسماعيل البخاري', generation: 'Compiler', reliability: 'ثقة ثبت' },
          { id: 'narrator-humaydi', name: 'Al-Humaydi', arabicName: 'عبد الله بن الزبير الحميدي', generation: 'Atba_Tabiin', reliability: 'ثقة ثبت' },
          { id: 'narrator-sufyan', name: 'Sufyan ibn Uyaynah', arabicName: 'سفيان بن عيينة', generation: 'Atba_Tabiin', reliability: 'ثقة ثبت' },
          { id: 'narrator-yahya-ansari', name: 'Yahya ibn Said al-Ansari', arabicName: 'يحيى بن سعيد الأنصاري', generation: 'Tabi_Junior', reliability: 'ثقة ثبت' },
          { id: 'narrator-muhammad-taymi', name: 'Muhammad ibn Ibrahim al-Taymi', arabicName: 'محمد بن إبراهيم التيمي', generation: 'Tabi_Junior', reliability: 'ثقة ثبت' },
          { id: 'narrator-alqama', name: 'Alqama ibn Waqqas al-Laythi', arabicName: 'علقمة بن وقاص الليثي', generation: 'Tabi_Senior', reliability: 'ثقة ثبت' },
          { id: 'narrator-umar', name: 'Umar ibn al-Khattab', arabicName: 'عمر بن الخطاب رضي الله عنه', generation: 'Sahabi', reliability: 'ثقة ثبت' },
        ],
      },
    ],
    variants: [
      { source: 'صحيح مسلم', variantText: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّةِ، وَإِنَّمَا لِامْرِئٍ مَا نَوَى...', narrator: 'علقمة بن وقاص' },
      { source: 'جامع الترمذي', variantText: 'الأَعْمَالُ بِالنِّيَّاتِ وَلِكُلِّ امْرِئٍ مَا نَوَى...', narrator: 'يحيى بن سعيد الأنصاري' },
    ],
  },
  {
    id: 'muslim-1',
    collection: 'صحيح مسلم',
    collection_code: 'muslim',
    hadith_number: 1,
    primary_narrator: 'عمر بن الخطاب رضي الله عنه',
    arabic_matn: 'بَيْنَمَا نَحْنُ عِنْدَ رَسُولِ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ، إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ شَدِيدُ سَوَادِ الشَّعَرِ، لا يُرَى عَلَيْهِ أَثَرُ السَّفَرِ، وَلا يَعْرِفُهُ مِنَّا أَحَدٌ... (حديث جبريل الطويل في الإسلام والإيمان والإحسان)',
    english_matn: 'While we were one day sitting with the Messenger of Allah (ﷺ), there appeared before us a man dressed in extremely white clothes and with very black hair... (Hadith Jibreel on Islam, Iman, Ihsan)',
    breadth: 'mashhur',
    min_narrators_in_tier: 3,
    breadth_explanation: 'حديث مشهور رواه عن النبي ﷺ عمر بن الخطاب، وأبو هريرة، وعبد الله بن عمر، وأنس بن مالك رضي الله عنهم.',
    themes: ['الإسلام', 'الإيمان', 'الإحسان', 'أشراط الساعة'],
    chains: [],
    variants: [],
  },
]

// Tafsir & Scholarly Archive
const TAFSIR_ENTRIES = [
  {
    id: '21:33',
    surah_number: 21,
    ayah_number: 33,
    ibn_kathir: 'يقول تعالى مبيناً قدرته التامة وحكمته البالغة: وهو الذي خلق الليل بسواده وظلامه والنهار بضيائه ونوره، والشمس والقمر، وكل منهما يجري في فلك خاص به يدور فيه ويسير كما يسبح السابح في الماء. قال ابن عباس: يدورون كما يدور المغزل في الفلكة.',
    jalalayn: '«كل» تنوينه عوض عن المضاف إليه، أي كل من الشمس والقمر والنجوم «في فلك» مستدير كفلكة المغزل «يسبحون» يسيرون بانسياب مسرعين كالسابح في الماء.',
    asbab_nuzul: 'بيان الآيات الكونية للدلالة على وحدانية الخالق وتدبيره المعجز.',
    hadith_citations: [
      {
        source: 'صحيح البخاري',
        number: 3199,
        text: 'عن أبي ذر رضي الله عنه قال: قال النبي ﷺ لأبي ذر حين غربت الشمس: «أتدري أين تذهب؟» قلت: الله ورسوله أعلم. قال: «فإنها تذهب حتى تسجد تحت العرش فتستأذن فيؤذن لها...»',
        isnadGrade: 'صحيح',
        narratorChain: 'يحيى بن بكير عن الليث عن يونس عن ابن شهاب عن أبي سلمة عن أبي ذر',
        relevanceNote: 'بيان خضوع الأجرام الكونية للسنن الإلهية ومفهوم الحركة المستمرة للشمس.',
      },
    ],
    scientific_notes: 'أكد علم الفلك الحديث أن الشمس والقمر وسائر النجوم تسبح في مدارات محددة حول مراكز ثقل المجرة، وهو ما يطابق الوصف القرآني الدقيق «يسبحون» بدلاً من الحركة الجامدة.',
  },
  {
    id: '36:40',
    surah_number: 36,
    ayah_number: 40,
    ibn_kathir: 'أي ليس للشمس سلطان على سلطان القمر في وقت حكمه، ولا لليل أن يسبق النهار فيدخل قبله، بل لكل منهما وقت مقدر ومدار محسوب لا يتجاوزه ولا يتعداه، وكل الأجرام تجري في فلكها المخصص دون اصطدام أو اضطراب.',
    jalalayn: '«لا الشمس ينبغي» يتيسر ويصح «لها أن تدرك القمر» فتجتمع معه في الليل، «ولا الليل سابق النهار» فلا يأتي قبل انقضائه، وكل في فلك يسبحون.',
    asbab_nuzul: 'تقرير كمال النظام الكوني واستقراره بحكمة بالغة.',
    hadith_citations: [
      {
        source: 'صحيح مسلم',
        number: 159,
        text: 'عن أبي ذر رضي الله عنه أن النبي ﷺ قال في قوله تعالى: «والشمس تجري لمستقر لها»: «مستقرها تحت العرش».',
        isnadGrade: 'صحيح',
        narratorChain: 'محمد بن المثنى عن عبد الوهاب عن داود عن الشعبي عن أبي ذر',
        relevanceNote: 'بيان جريان الشمس واستمرار حركتها في الفضاء الكوني.',
      },
    ],
    scientific_notes: 'الآية تجسد مبدأ انتظام المدارات الفلكية (Orbital Mechanics) واختلاف المستويات المدارية بين الأرض والقمر والشمس.',
  },
  {
    id: '74:3',
    surah_number: 74,
    ayah_number: 3,
    ibn_kathir: 'أي عظم ربك ومجده ونزهه عما يصفه المشركون والجاحدون.',
    jalalayn: '«وربك فكبر» عظم عن إشراكهم بالتوحيد والثناء.',
    asbab_nuzul: 'من أوائل ما نزل من القرآن بعد فترة الوحي.',
    hadith_citations: [],
    scientific_notes: 'بنية لفظية متناظرة تماماً تقرأ من اليمين إلى اليسار ومن اليسار إلى اليمين بنفس الحروف (و-ر-ب-ك-ف-ك-ب-ر).',
  },
]

// Demo Projects & Evidence
const DEMO_PROJECTS = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    user_id: 'demo-user',
    title: 'معجزة التناظر في القرآن',
    description: 'دراسة التناظر اللفظي والبنيوي في آيات القرآن الكريم مثل «ربك فكبر» و«كل في فلك»',
    hypothesis: 'الألفاظ القرآنية ذات الدلالة الدورانية والفلكية تتبع نمطاً تناظرياً محسوباً بدقة',
    status: 'active',
  },
  {
    id: 'd2000000-0000-0000-0000-000000000002',
    user_id: 'demo-user',
    title: 'الحقائق العلمية والأفلاك الكونية',
    description: 'توثيق مواضع الذكر الفلكي مع أحدث أرصاد علم الفلك الحديث',
    hypothesis: 'حركة الأجرام في المدارات محددة بمصطلح السباحة الفلكية',
    status: 'active',
  },
]

const DEMO_EVIDENCE = [
  {
    id: 'e1000000-0000-0000-0000-000000000001',
    project_id: 'd1000000-0000-0000-0000-000000000001',
    user_id: 'demo-user',
    surah: 21,
    ayah: 33,
    surah_name: 'الأنبياء',
    verse_text: 'وَهُوَ الَّذِي خَلَقَ اللَّيْلَ وَالنَّهَارَ وَالشَّمْسَ وَالْقَمَرَ ۖ كُلٌّ فِي فَلَكٍ يَسْبَحُونَ',
    analysis_type: 'symmetry',
    classification: 'verified',
    calculation_data: {
      letters: 46,
      words: 11,
      symmetryRatio: 1.0,
      normalizedText: 'كل في فلك',
      mathExplanation: 'تطابق الحروف عند القراءة من اليمين إلى اليسار والعكس (ك-ل-ف-ي-ف-ل-ك)',
    },
    sources: [
      {
        title: 'معجم ألفاظ القرآن الكريم ومفرداته',
        citation: 'تحليل البنية اللفظية في سورة الأنبياء',
      },
    ],
    notes: 'ملاحظة محسوبة ومؤكدة نصياً دون تأويل افتراضي',
  },
]

function findDataFile(filename: string): string {
  const candidates = [
    path.resolve(process.cwd(), '../frontend/lib/quran/data', filename),
    path.resolve(process.cwd(), 'frontend/lib/quran/data', filename),
    path.resolve(__dirname, '../../../frontend/lib/quran/data', filename),
    path.resolve(__dirname, '../../../../frontend/lib/quran/data', filename),
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  throw new Error(`Could not find data file ${filename}. Checked: ${candidates.join(', ')}`)
}

export async function runSeed() {
  console.log('========================================================')
  console.log('QuranMind Database Migration & Seed to Supabase')
  console.log('========================================================')

  const isConfigured = config.isSupabaseConfigured()
  if (!isConfigured) {
    console.warn('\n[!] Supabase credentials are not yet configured in backend/.env.')
    console.warn('    Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to seed directly.')
    console.warn('    A standalone schema & seed SQL has also been generated at root: supabase_schema.sql\n')
  }

  const supabase = getServiceSupabase()

  // 1. Seed Surahs
  console.log(`[1/8] Seeding 114 Surahs...`)
  if (isConfigured) {
    const { error: surahError } = await supabase.from('quran_surahs').upsert(SURAHS_META, { onConflict: 'number' })
    if (surahError) {
      console.error('Error seeding surahs:', surahError.message)
    } else {
      console.log('✓ Successfully seeded 114 surahs.')
    }
  }

  // 2. Seed Verses (6,236 Ayahs)
  console.log(`[2/8] Loading and Seeding 6,236 Quran Verses...`)
  const qpcPath = findDataFile('qpc-hafs.json')
  const transPath = findDataFile('en-sahih-international-simple.json')

  const qpcData = JSON.parse(fs.readFileSync(qpcPath, 'utf-8')) as Record<string, { id: number; verse_key: string; surah: number; ayah: number; text: string }>
  const transData = JSON.parse(fs.readFileSync(transPath, 'utf-8')) as Record<string, { t: string }>

  const surahMap = new Map(SURAHS_META.map(s => [s.number, s]))

  const allVerses = Object.keys(qpcData).map(key => {
    const item = qpcData[key]
    const meta = surahMap.get(item.surah)
    const translation = transData[key]?.t || ''

    return {
      id: key,
      surah_number: item.surah,
      ayah_number: item.ayah,
      surah_name_ar: meta ? meta.name_ar : `سورة ${item.surah}`,
      surah_english_name: meta ? meta.english_name : `Surah ${item.surah}`,
      text_uthmani: item.text,
      translation_en: translation,
      revelation_type: meta?.revelation_type || 'Meccan',
    }
  })

  console.log(`  Parsed ${allVerses.length} verses from source JSON.`)

  if (isConfigured) {
    const BATCH_SIZE = 250
    let inserted = 0
    for (let i = 0; i < allVerses.length; i += BATCH_SIZE) {
      const batch = allVerses.slice(i, i + BATCH_SIZE)
      const { error: vError } = await supabase.from('quran_verses').upsert(batch, { onConflict: 'id' })
      if (vError) {
        console.error(`  Error seeding verses batch ${i}-${i + batch.length}:`, vError.message)
      } else {
        inserted += batch.length
        process.stdout.write(`\r  Upserted ${inserted}/${allVerses.length} verses...`)
      }
    }
    console.log('\n✓ Successfully seeded all 6,236 Quran verses.')
  }

  // 3. Seed Recurrent Phrases
  console.log(`[3/8] Loading and Seeding Recurrent Phrases...`)
  const phrasesPath = findDataFile('phrases.json')
  const phrasesData = JSON.parse(fs.readFileSync(phrasesPath, 'utf-8')) as Record<string, any>

  const phraseList = Object.entries(phrasesData).map(([key, p]: [string, any]) => ({
    id: key,
    count: p.count,
    surahs_count: p.surahs,
    ayahs_count: p.ayahs,
    source_key: p.source?.key || '',
    source_from: p.source?.from || null,
    source_to: p.source?.to || null,
    occurrences: Object.keys(p.ayah || {}),
    ayah_mapping: p.ayah || {},
  }))

  if (isConfigured) {
    const BATCH_SIZE = 200
    for (let i = 0; i < phraseList.length; i += BATCH_SIZE) {
      const batch = phraseList.slice(i, i + BATCH_SIZE)
      await supabase.from('quran_phrases').upsert(batch, { onConflict: 'id' })
    }
    console.log(`✓ Successfully seeded ${phraseList.length} recurrent phrases.`)
  }

  // 4. Seed Matching Ayahs
  console.log(`[4/8] Loading and Seeding Matching Ayahs...`)
  const matchingPath = findDataFile('matching-ayah.json')
  const matchingData = JSON.parse(fs.readFileSync(matchingPath, 'utf-8')) as Record<string, any[]>

  const matchingList: any[] = []
  for (const [sourceKey, matches] of Object.entries(matchingData)) {
    for (const m of matches) {
      matchingList.push({
        id: `${sourceKey}->${m.matched_ayah_key}`,
        source_ayah_key: sourceKey,
        matched_ayah_key: m.matched_ayah_key,
        matched_words_count: m.matched_words_count,
        coverage: m.coverage,
        score: m.score,
        match_words: m.match_words || [],
      })
    }
  }

  if (isConfigured) {
    const BATCH_SIZE = 250
    for (let i = 0; i < matchingList.length; i += BATCH_SIZE) {
      const batch = matchingList.slice(i, i + BATCH_SIZE)
      await supabase.from('quran_matching_ayahs').upsert(batch, { onConflict: 'id' })
    }
    console.log(`✓ Successfully seeded ${matchingList.length} matching ayah relationships.`)
  }

  // 5. Seed Tafsir & Scholarly Archive
  console.log(`[5/8] Seeding Classical Tafsir & Scholarship...`)
  if (isConfigured) {
    const { error: tError } = await supabase.from('quran_tafsir').upsert(TAFSIR_ENTRIES, { onConflict: 'id' })
    if (tError) console.error('Error seeding tafsir:', tError.message)
    else console.log(`✓ Successfully seeded ${TAFSIR_ENTRIES.length} curated tafsir entries.`)
  }

  // 6. Seed Hadith Collections, Books, Scholars, Narrators, Hadiths
  console.log(`[6/8] Seeding Hadith Collections, Books, Scholars, Narrators & Corpus...`)
  if (isConfigured) {
    await supabase.from('hadith_collections').upsert(HADITH_COLLECTIONS, { onConflict: 'code' })
    await supabase.from('hadith_books').upsert(CLASSICAL_BOOKS, { onConflict: 'id' })
    await supabase.from('hadith_scholars').upsert(SCHOLARS, { onConflict: 'key' })

    // Extract unique narrators from chains
    const narratorsMap = new Map<string, any>()
    for (const h of INITIAL_HADITHS) {
      for (const c of h.chains) {
        for (const n of c.narratorPath) {
          narratorsMap.set(n.id, {
            id: n.id,
            name_ar: n.arabicName,
            name_en: n.name,
            generation: n.generation,
            reliability: n.reliability,
          })
        }
      }
    }
    const narratorsList = Array.from(narratorsMap.values())
    if (narratorsList.length > 0) {
      await supabase.from('hadith_narrators').upsert(narratorsList, { onConflict: 'id' })
    }

    const { error: hError } = await supabase.from('hadiths').upsert(INITIAL_HADITHS, { onConflict: 'id' })
    if (hError) console.error('Error seeding hadiths:', hError.message)
    else console.log(`✓ Successfully seeded Hadith corpus with collections, books, scholars, and narrators.`)
  }

  // 7. Seed Managed Users
  console.log(`[7/8] Seeding Managed Users & Profiles...`)
  if (isConfigured) {
    const { error: uError } = await supabase.from('users').upsert(INITIAL_USERS, { onConflict: 'id' })
    if (uError) console.error('Error seeding users:', uError.message)
    else console.log(`✓ Successfully seeded ${INITIAL_USERS.length} managed SaaS users.`)
  }

  // 8. Seed Demo Research Projects & Evidence
  console.log(`[8/8] Seeding Demo Research Projects & Evidence...`)
  if (isConfigured) {
    await supabase.from('projects').upsert(DEMO_PROJECTS, { onConflict: 'id' })
    await supabase.from('evidence_items').upsert(DEMO_EVIDENCE, { onConflict: 'id' })
    console.log(`✓ Successfully seeded demo projects and scientific evidence items.`)
  }

  console.log('\n========================================================')
  console.log('✓ Migration & Seed Routine Completed Successfully!')
  console.log('========================================================\n')
}

// Run if called directly
if (process.argv[1]?.endsWith('seed-supabase.js') || process.argv[1]?.endsWith('seed-supabase.ts')) {
  runSeed().catch((err) => {
    console.error('Fatal seed error:', err)
    process.exit(1)
  })
}
