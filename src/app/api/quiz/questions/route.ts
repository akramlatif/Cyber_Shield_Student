import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quiz from '@/lib/models/Quiz';

/** Quiz seed data — loaded into DB if it is empty */
const SEED_QUESTIONS = [
    // Passwords
    { question: 'What is the minimum recommended length for a strong password?', options: ['6 characters', '8 characters', '12 characters', '20 characters'], correctIndex: 2, category: 'passwords', difficulty: 'easy', explanation: 'Security experts recommend at least 12 characters for strong passwords. Longer is always better.' },
    { question: 'Which of the following is the MOST secure password?', options: ['password123', 'P@ssw0rd', 'Tr0ub4dor&3', 'CorrectHorseBatteryStaple!'], correctIndex: 3, category: 'passwords', difficulty: 'medium', explanation: 'Long passphrases like "CorrectHorseBatteryStaple!" are highly secure due to length and entropy.' },
    { question: 'What does a password manager help you do?', options: ['Browse the web anonymously', 'Store and generate unique passwords for every site', 'Encrypt your hard drive', 'Block phishing emails'], correctIndex: 1, category: 'passwords', difficulty: 'easy', explanation: 'Password managers generate and securely store unique passwords for all your accounts.' },
    { question: 'What is two-factor authentication (2FA)?', options: ['Using two passwords', 'Requiring two forms of verification to log in', 'Encrypting data twice', 'Logging in from two devices'], correctIndex: 1, category: 'passwords', difficulty: 'easy', explanation: '2FA requires something you know (password) plus something you have (phone) or are (biometric).' },
    { question: 'Which character type is NOT typically counted in password entropy?', options: ['Uppercase letters', 'Numbers', 'Spaces', 'None of the above'], correctIndex: 3, category: 'passwords', difficulty: 'hard', explanation: 'All character types including spaces can be used and contribute to password entropy.' },

    // Phishing
    { question: 'What is phishing?', options: ['Catching fish using the internet', 'A cyberattack using deceptive emails or websites to steal information', 'A type of malware', 'Scanning for open network ports'], correctIndex: 1, category: 'phishing', difficulty: 'easy', explanation: 'Phishing tricks users into revealing sensitive info by impersonating trusted entities.' },
    { question: 'Which of these is a sign of a phishing email?', options: ['Sent from your bank\'s official domain', 'Contains your full name and account number', 'Creates urgency ("Act now or your account will be closed!")', 'Has no attachments'], correctIndex: 2, category: 'phishing', difficulty: 'easy', explanation: 'Creating false urgency is a hallmark of phishing attacks designed to make you act without thinking.' },
    { question: 'What is spear phishing?', options: ['Phishing attacks targeting a specific individual or organization', 'Phishing via SMS messages', 'Phishing via phone calls', 'Bulk phishing emails sent to thousands'], correctIndex: 0, category: 'phishing', difficulty: 'medium', explanation: 'Spear phishing is highly targeted, using personalized info to appear more convincing.' },
    { question: 'What should you do before clicking a link in an email?', options: ['Click it to see where it goes', 'Hover over it to preview the actual URL', 'Forward it to friends first', 'Open it in incognito mode immediately'], correctIndex: 1, category: 'phishing', difficulty: 'easy', explanation: 'Hovering reveals the real URL destination, helping you spot mismatches or suspicious domains.' },
    { question: 'Which URL is MOST likely to be a phishing site?', options: ['https://google.com', 'https://paypal.com/login', 'https://paypa1-secure.xyz/login/verify', 'https://microsoft.com'], correctIndex: 2, category: 'phishing', difficulty: 'medium', explanation: 'Misspelled domains (paypa1 vs paypal), suspicious TLDs (.xyz), and keywords like "verify" are phishing signals.' },

    // Social Engineering
    { question: 'What is social engineering in cybersecurity?', options: ['Building social media platforms', 'Manipulating people psychologically to reveal information or take actions', 'Engineering social networks', 'Hacking social media accounts'], correctIndex: 1, category: 'social-engineering', difficulty: 'easy', explanation: 'Social engineering exploits human psychology rather than technical vulnerabilities.' },
    { question: 'What is pretexting?', options: ['Sending a fake text message', 'Creating a fabricated scenario to manipulate someone', 'Texting before making a phone call', 'Using a prepaid phone'], correctIndex: 1, category: 'social-engineering', difficulty: 'medium', explanation: 'Pretexting involves creating a fabricated but plausible scenario (pretext) to deceive a target.' },
    { question: 'A stranger hands you a USB drive labeled "Salary Info 2024". What should you do?', options: ['Plug it into your work computer to check', 'Plug it into a personal computer', 'Report it to IT and do not plug it in', 'Format it and reuse it'], correctIndex: 2, category: 'social-engineering', difficulty: 'medium', explanation: 'This is a classic "baiting" attack. Malicious USB drives are used to deliver malware.' },

    // Network Security
    { question: 'What does a VPN do?', options: ['Speeds up your internet connection', 'Encrypts your internet traffic and hides your IP address', 'Protects against all malware', 'Replaces your antivirus software'], correctIndex: 1, category: 'network', difficulty: 'easy', explanation: 'A VPN creates an encrypted tunnel for your traffic, protecting it from interception and masking your IP.' },
    { question: 'Why should you avoid public Wi-Fi for banking?', options: ['Public Wi-Fi is too slow', 'Public Wi-Fi networks can be monitored by attackers', 'Banks block public Wi-Fi connections', 'Your phone overheats on public Wi-Fi'], correctIndex: 1, category: 'network', difficulty: 'easy', explanation: 'Attackers on the same network can potentially intercept unencrypted traffic or perform man-in-the-middle attacks.' },
    { question: 'What encryption standard should your home Wi-Fi use?', options: ['WEP', 'WPA', 'WPA2 or WPA3', 'No encryption is fine at home'], correctIndex: 2, category: 'network', difficulty: 'medium', explanation: 'WEP is broken and WPA has weaknesses. WPA2 is the minimum — WPA3 is preferred for modern routers.' },

    // Privacy
    { question: 'What is end-to-end encryption?', options: ['Encrypting data on your hard drive', 'Encrypting messages so only sender and receiver can read them', 'Encrypting website URLs', 'Encrypting browser cookies'], correctIndex: 1, category: 'privacy', difficulty: 'medium', explanation: 'E2E encryption means even the service provider cannot read your messages — only the endpoints can.' },
    { question: 'Why should you regularly review app permissions?', options: ['To save battery life', 'To prevent apps from accessing data they don\'t need', 'To improve internet speed', 'To free up storage'], correctIndex: 1, category: 'privacy', difficulty: 'easy', explanation: 'Apps may request excessive permissions. Regular reviews help protect your camera, microphone, and contacts.' },
    { question: 'What is the 3-2-1 backup rule?', options: ['3 backups daily, 2 weekly, 1 monthly', '3 copies, 2 different media types, 1 offsite', '3 cloud backups, 2 local, 1 on a USB drive', '3 encrypted copies in 2 locations with 1 password'], correctIndex: 1, category: 'privacy', difficulty: 'hard', explanation: 'The 3-2-1 rule: 3 copies, 2 different media types, 1 kept offsite (e.g., cloud). Protects against multiple failure scenarios.' },

    // Malware
    { question: 'What is ransomware?', options: ['Software that makes your computer run faster for payment', 'Malware that encrypts your files and demands payment for the decryption key', 'A type of adware', 'Spyware that records keystrokes'], correctIndex: 1, category: 'malware', difficulty: 'easy', explanation: 'Ransomware encrypts victims\' files and demands a ransom (usually cryptocurrency) for the decryption key.' },
    { question: 'What is the best defense against ransomware?', options: ['Paying the ransom quickly', 'Having current, offline backups', 'Using an old computer', 'Disabling your internet connection'], correctIndex: 1, category: 'malware', difficulty: 'medium', explanation: 'Regular offline backups mean you can restore files without paying the ransom.' },
];

async function seedQuizIfEmpty() {
    const count = await Quiz.countDocuments();
    if (count === 0) {
        await Quiz.insertMany(SEED_QUESTIONS);
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        await seedQuizIfEmpty();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category') || '';
        const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));

        const filter: Record<string, string> = {};
        if (category) filter.category = category;

        // Get random questions (exclude correctIndex from response)
        const questions = await Quiz.aggregate([
            { $match: filter },
            { $sample: { size: limit } },
            { $project: { correctIndex: 0, __v: 0 } },
        ]);

        const categories = await Quiz.distinct('category');

        return NextResponse.json({
            questions,
            total: questions.length,
            availableCategories: categories,
        });
    } catch (err: any) {
        console.error('[GET /api/quiz/questions]', err);
        return NextResponse.json({ error: err.message || 'Internal server error', stack: err.stack }, { status: 500 });
    }
}
