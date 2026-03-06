import Image from 'next/image';
import { getSemanticImage } from '@/lib/images';

const Showcase = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">App Showcase</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(['product', 'technology', 'abstract', 'hero', 'features', 'office'] as const).map((imgKey, index) => (
            <Image
              key={imgKey}
              src={getSemanticImage(imgKey)}
              alt={`App Screenshot ${index + 1}`}
              width={400}
              height={300}
              className="rounded-lg shadow-md w-full h-64 object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;