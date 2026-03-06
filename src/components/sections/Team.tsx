import { getSemanticImage } from '@/lib/images';
import Card from '@/components/ui/Card';
import Image from 'next/image';

const Team = () => {
  const teamMembersData = [
    { name: 'John Doe', role: 'CEO', image: 'team' },
    { name: 'Jane Smith', role: 'CTO', image: 'team' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembersData.map((member, index) => (
            <Card key={index} className="text-center">
              <Image
                src={getSemanticImage(member.image)}
                alt={member.name}
                width={200}
                height={200}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2" data-craft-id={`team-${index}-name`}>{member.name}</h3>
              <p className="text-gray-600" data-craft-id={`team-${index}-role`}>{member.role}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;