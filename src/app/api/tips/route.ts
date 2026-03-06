import { NextRequest, NextResponse } from 'next/server';

const TIPS = [
    // Passwords
    { id: 1, category: 'passwords', title: 'Use strong, unique passwords', body: 'Create passwords with at least 12 characters mixing upper/lowercase letters, numbers, and symbols. Never reuse passwords across different accounts.', difficulty: 'easy' },
    { id: 2, category: 'passwords', title: 'Use a password manager', body: 'Password managers like Bitwarden or 1Password store and generate unique passwords for every site, so you only need to remember one master password.', difficulty: 'easy' },
    { id: 3, category: 'passwords', title: 'Enable two-factor authentication (2FA)', body: 'Add a second layer of protection. Even if your password is stolen, attackers cannot access your account without the second factor.', difficulty: 'easy' },
    { id: 4, category: 'passwords', title: 'Avoid personal info in passwords', body: 'Names, birthdays, and phone numbers are easily guessable. Use randomly generated passwords or passphrases instead.', difficulty: 'easy' },
    { id: 5, category: 'passwords', title: 'Change default passwords immediately', body: 'Routers, IoT devices, and new accounts often ship with easy-to-guess default passwords. Change them before going online.', difficulty: 'medium' },
    { id: 6, category: 'passwords', title: 'Use passphrases', body: 'A long phrase like "CorrectHorseBatteryStaple!" is both memorable and highly secure. Length matters more than complexity.', difficulty: 'easy' },
    { id: 7, category: 'passwords', title: 'Never share passwords', body: 'No legitimate service will ever ask for your password. Use shared credentials vaults for team accounts instead of direct sharing.', difficulty: 'easy' },
    { id: 8, category: 'passwords', title: 'Check for breached passwords', body: 'Use services like HaveIBeenPwned to see if your credentials have appeared in a data breach, then change those passwords immediately.', difficulty: 'easy' },
    { id: 9, category: 'passwords', title: 'Log out from shared devices', body: 'Always log out from accounts when using public computers, libraries, or someone else\'s phone to prevent unauthorized access.', difficulty: 'easy' },
    { id: 10, category: 'passwords', title: 'Review account activity regularly', body: 'Most platforms show recent login history. Check periodically for unfamiliar locations or devices that could indicate a breach.', difficulty: 'medium' },

    // Phishing
    { id: 11, category: 'phishing', title: 'Verify sender email addresses', body: 'Phishers often use addresses like "support@paypa1.com" (with a 1 instead of l). Always check the full email address, not just the display name.', difficulty: 'easy' },
    { id: 12, category: 'phishing', title: 'Hover before you click', body: 'Hover over links to preview the actual URL before clicking. Mismatches between the link text and destination are a red flag.', difficulty: 'easy' },
    { id: 13, category: 'phishing', title: 'Be suspicious of urgency', body: '"Your account will be suspended in 24 hours!" Urgent language is a classic phishing tactic designed to make you act without thinking.', difficulty: 'easy' },
    { id: 14, category: 'phishing', title: 'Type important URLs directly', body: 'For banking, email, or social media, type the URL directly into your browser rather than clicking links in emails.', difficulty: 'easy' },
    { id: 15, category: 'phishing', title: 'Check for HTTPS', body: 'Look for the padlock icon and "https://" before entering sensitive info. However, HTTPS alone does not guarantee a site is legitimate.', difficulty: 'easy' },
    { id: 16, category: 'phishing', title: 'Never open unexpected attachments', body: 'Malware is often delivered via email attachments (.docx, .pdf, .zip). If you weren\'t expecting a file, verify with the sender before opening.', difficulty: 'medium' },
    { id: 17, category: 'phishing', title: 'Enable email spam filters', body: 'Most email clients have built-in phishing protection. Ensure yours is enabled and configured to protect against known threats.', difficulty: 'easy' },
    { id: 18, category: 'phishing', title: 'Report phishing attempts', body: 'Report phishing emails to your email provider and organizations like Anti-Phishing Working Group (APWG). You help protect others too.', difficulty: 'easy' },

    // Social Engineering
    { id: 19, category: 'social-engineering', title: 'Limit info shared on social media', body: 'Attackers harvest info from LinkedIn, Instagram, and Facebook to craft convincing spear-phishing attacks. Keep personal details private.', difficulty: 'medium' },
    { id: 20, category: 'social-engineering', title: 'Verify identities before sharing info', body: 'If someone calls claiming to be from IT support, hang up and call the company\'s official number to confirm before giving any information.', difficulty: 'medium' },
    { id: 21, category: 'social-engineering', title: 'Be wary of USB drives', body: 'Never plug in USB drives found in parking lots or received unexpectedly. This is a common "baiting" attack to deliver malware.', difficulty: 'medium' },
    { id: 22, category: 'social-engineering', title: 'Protect your screen in public', body: 'Shoulder surfing — someone watching you type — is a real threat in coffee shops and libraries. Use a privacy screen filter.', difficulty: 'easy' },

    // Network
    { id: 23, category: 'network', title: 'Avoid public Wi-Fi for sensitive tasks', body: 'Public Wi-Fi is often unencrypted. Avoid banking or logging into important accounts on public networks. Use a VPN if necessary.', difficulty: 'medium' },
    { id: 24, category: 'network', title: 'Use a VPN on public networks', body: 'A VPN encrypts your internet traffic, making it much harder for attackers to intercept your data on public networks.', difficulty: 'medium' },
    { id: 25, category: 'network', title: 'Secure your home Wi-Fi', body: 'Use WPA3 or WPA2 encryption, a strong unique password, and change the default router admin credentials. Disable WPS.', difficulty: 'medium' },
    { id: 26, category: 'network', title: 'Keep your router firmware updated', body: 'Router manufacturers release firmware updates to patch security vulnerabilities. Check your router\'s admin panel periodically.', difficulty: 'hard' },
    { id: 27, category: 'network', title: 'Disable services you don\'t use', body: 'Turn off Bluetooth when not in use. Disable remote access/UPnP on your router. Each open service is a potential attack vector.', difficulty: 'medium' },

    // Privacy
    { id: 28, category: 'privacy', title: 'Review app permissions regularly', body: 'Many apps request more permissions than they need. Regularly audit which apps have access to your camera, microphone, location, and contacts.', difficulty: 'easy' },
    { id: 29, category: 'privacy', title: 'Use privacy-focused browsers', body: 'Browsers like Firefox or Brave offer stronger privacy defaults. Consider enabling tracker blocking and using private browsing mode.', difficulty: 'easy' },
    { id: 30, category: 'privacy', title: 'Use encrypted messaging apps', body: 'Signal, WhatsApp, or iMessage provide end-to-end encryption. Regular SMS is not encrypted and can be intercepted.', difficulty: 'easy' },
    { id: 31, category: 'privacy', title: 'Keep software up to date', body: 'Software updates often contain critical security patches. Enable automatic updates for your OS, browser, and apps.', difficulty: 'easy' },
    { id: 32, category: 'privacy', title: 'Use encrypted storage', body: 'Enable full-disk encryption (BitLocker on Windows, FileVault on macOS) to protect data if your device is lost or stolen.', difficulty: 'hard' },
    { id: 33, category: 'privacy', title: 'Beware of oversharing location data', body: 'Geo-tagging photos reveals your location. Disable location metadata in your camera app before posting photos online.', difficulty: 'easy' },
    { id: 34, category: 'privacy', title: 'Use a separate email for signups', body: 'Create a secondary email address for website registrations. This reduces spam and limits exposure if a site is breached.', difficulty: 'easy' },
    { id: 35, category: 'privacy', title: 'Use ad and tracker blockers', body: 'Browser extensions like uBlock Origin block ads and trackers that collect and sell your browsing behavior to third parties.', difficulty: 'easy' },

    // Device Security
    { id: 36, category: 'device', title: 'Lock your device with a PIN or biometrics', body: 'Always lock your phone and computer. Use a strong PIN (6+ digits), fingerprint, or face recognition to prevent unauthorized access.', difficulty: 'easy' },
    { id: 37, category: 'device', title: 'Enable remote wipe', body: 'Enable "Find My Device" on iOS/Android and Windows. If your device is stolen, you can remotely wipe sensitive data.', difficulty: 'medium' },
    { id: 38, category: 'device', title: 'Install antivirus software', body: 'Use reputable antivirus software on Windows (Defender is a solid free choice). Regularly scan for malware and keep definitions updated.', difficulty: 'easy' },
    { id: 39, category: 'device', title: 'Back up your data regularly', body: 'Follow the 3-2-1 rule: 3 copies, 2 different media, 1 offsite (e.g., cloud). Regular backups protect against ransomware and hardware failure.', difficulty: 'medium' },
    { id: 40, category: 'device', title: 'Don\'t root/jailbreak your device', body: 'Rooting or jailbreaking bypasses built-in security protections and voids warranty. It significantly increases your device\'s attack surface.', difficulty: 'medium' },
];

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category') || '';
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));

        let filtered = TIPS;
        if (category) {
            filtered = TIPS.filter(t => t.category === category);
        }

        const totalCount = filtered.length;
        const totalPages = Math.ceil(totalCount / limit);
        const offset = (page - 1) * limit;
        const data = filtered.slice(offset, offset + limit);

        const categories = [...new Set(TIPS.map(t => t.category))];

        return NextResponse.json({
            tips: data,
            pagination: { page, limit, totalCount, totalPages },
            availableCategories: categories,
        });
    } catch (err) {
        console.error('[GET /api/tips]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
