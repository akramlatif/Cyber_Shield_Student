const UseCases = () => {
  const useCasesData = [
    { title: 'Protecting Your Accounts', description: 'Use our password strength checker to create strong, unique passwords for all your accounts.' },
    { title: 'Avoiding Phishing Scams', description: 'Our phishing detector helps you identify and avoid malicious emails and websites.' },
    { title: 'Staying Safe on Public Wi-Fi', description: 'Learn how to protect your data when using public Wi-Fi networks.' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCasesData.map((useCase, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2" data-craft-id={`usecase-${index}-title`}>{useCase.title}</h3>
              <p className="text-gray-700" data-craft-id={`usecase-${index}-description`}>{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;