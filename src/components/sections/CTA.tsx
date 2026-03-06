'use client';

import Button from '@/components/ui/Button';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#14b8a6] to-[#0d9488]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-8" data-craft-id="cta-title">Ready to Protect Yourself?</h2>
        <p className="text-lg text-gray-100 mb-8">Download Cyber Shield today and take control of your online security.</p>
        <Button href="#pricing" data-craft-id="cta-button">
          Download Now
        </Button>
      </div>
    </section>
  );
};

export default CTA;