import { getSemanticImage } from '@/lib/images';

const ProblemSolution = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Problem & Our Solution</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">The Problem</h3>
            <p className="text-gray-700 mb-4">Students face increasing online security threats, from phishing scams to password breaches. Staying safe requires constant vigilance and knowledge.</p>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Solution</h3>
            <p className="text-gray-700">Cyber Shield provides a comprehensive suite of tools and resources to protect students online. We make security simple and accessible.</p>
          </div>
          <div>
            <img
              src={getSemanticImage('abstract')}
              alt="Problem and Solution"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;