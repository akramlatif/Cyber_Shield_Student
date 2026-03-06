import { getSemanticImage } from '@/lib/images';
import Card from '@/components/ui/Card';
import Image from 'next/image';
import Button from '@/components/ui/Button';

const Features = () => {
  const featuresData = [
    { title: 'Password Strength Checker', description: 'Instantly check the strength of your passwords.', image: 'features', href: '/password', btn: 'Try Password Checker' },
    { title: 'Phishing Detector', description: 'Identify and avoid phishing attempts.', image: 'technology', href: '/phishing', btn: 'Try Phishing Detector' },
    { title: 'Security Tips', description: 'Get practical security tips to stay safe online.', image: 'office', href: '/tips', btn: 'Read Security Tips' },
    { title: 'Data Breach Alert', description: 'Receive alerts if your data is compromised.', image: 'abstract', href: '/breach', btn: 'Check Data Breach' },
    { title: 'Quiz System', description: 'Test your knowledge with our interactive security quizzes.', image: 'product', href: '/quiz', btn: 'Take a Quiz' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <Card key={index} className="h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2" data-craft-id={`feature-${index}-title`}>{feature.title}</h3>
                <p className="text-gray-600" data-craft-id={`feature-${index}-description`}>{feature.description}</p>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                <Image
                  src={getSemanticImage(feature.image as any)}
                  alt={feature.title}
                  width={300}
                  height={180}
                  className="rounded-lg w-full h-48 object-cover"
                />
                <Button href={feature.href} className="w-full">{feature.btn}</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;