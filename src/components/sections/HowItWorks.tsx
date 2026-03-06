const HowItWorks = () => {
  const steps = [
    { step: 1, description: 'Download and install the Cyber Shield app.' },
    { step: 2, description: 'Create your account and set up your profile.' },
    { step: 3, description: 'Explore the features and start protecting yourself.' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#14b8a6] text-white flex items-center justify-center font-bold text-2xl mb-4">
                {step.step}
              </div>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;