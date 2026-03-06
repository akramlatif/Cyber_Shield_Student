import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const Pricing = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pricing Tier 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Free</h3>
            <div className="text-gray-600 mb-4">Basic protection for students.</div>
            <div className="text-2xl font-bold text-[#14b8a6] mb-4">$0/month</div>
            <ul className="mb-6 flex-grow">
              <li className="mb-2">✓ Password Strength Checker</li>
              <li>✓ Security Tips</li>
            </ul>
            <Button href="#register" className="w-full">Get Started</Button>
          </div>

          {/* Pricing Tier 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col border-2 border-[#14b8a6]">
            <Badge className="mb-4">Most Popular</Badge>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium</h3>
            <div className="text-gray-600 mb-4">Advanced protection with more features.</div>
            <div className="text-2xl font-bold text-[#14b8a6] mb-4">$4.99/month</div>
            <ul className="mb-6 flex-grow">
              <li className="mb-2">✓ All Free Features</li>
              <li className="mb-2">✓ Phishing Detector</li>
              <li className="mb-2">✓ Data Breach Alert</li>
              <li>✓ Quiz System</li>
            </ul>
            <Button href="#register" className="w-full">Get Premium</Button>
          </div>

          {/* Pricing Tier 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Ultimate</h3>
            <div className="text-gray-600 mb-4">Complete security suite for maximum protection.</div>
            <div className="text-2xl font-bold text-[#14b8a6] mb-4">$9.99/month</div>
            <ul className="mb-6 flex-grow">
              <li className="mb-2">✓ All Premium Features</li>
              <li className="mb-2">✓ Priority Support</li>
              <li>✓ Personalized Security Recommendations</li>
            </ul>
            <Button href="#register" className="w-full">Get Ultimate</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;