'use client';

import Image from 'next/image';
import { getSemanticImage } from '@/lib/images';
import Button from '@/components/ui/Button';

const Hero = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#f0fdfa] to-white">
      <div className="container mx-auto px-4">
        <div className="lg:flex items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6" data-craft-id="hero-title">Cyber Shield: Your Security, Our Priority</h1>
            <p className="text-lg text-gray-700 mb-8">Protect yourself from online threats with our student security app. Password strength checker, phishing detector, security tips, and more!</p>
            <Button href="#pricing" data-craft-id="hero-button">
              Download Now
            </Button>
          </div>
          <div className="lg:w-1/2">
            <Image
              src={getSemanticImage('hero')}
              alt="Cyber Shield App Screenshot"
              width={500}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;