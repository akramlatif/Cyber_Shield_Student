const Stats = () => {
  const statsData = [
    { label: 'Students Protected', value: '10,000+' },
    { label: 'Threats Detected', value: '5,000+' },
    { label: 'Positive Reviews', value: '4.8/5' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-[#14b8a6] mb-2">{stat.value}</div>
              <p className="text-gray-700">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;