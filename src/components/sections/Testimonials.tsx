const Testimonials = () => {
  const testimonialsData = [
    { quote: 'Cyber Shield has significantly improved my online security. I feel much safer now!', author: 'Jane Doe' },
    { quote: 'The phishing detector is a lifesaver! I almost fell for a scam, but the app caught it.', author: 'John Smith' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
              <p className="text-gray-600 font-semibold">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;