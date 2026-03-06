const FAQ = () => {
  const faqData = [
    { question: 'What is Cyber Shield?', answer: 'Cyber Shield is a student security app that provides tools and resources to protect you from online threats.' },
    { question: 'Is Cyber Shield free?', answer: 'We offer both free and premium plans to suit your needs.' },
    { question: 'How does the phishing detector work?', answer: 'Our phishing detector uses advanced algorithms to identify and block phishing attempts.' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2" data-craft-id={`faq-${index}-question`}>{faq.question}</h3>
              <p className="text-gray-700" data-craft-id={`faq-${index}-answer`}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;