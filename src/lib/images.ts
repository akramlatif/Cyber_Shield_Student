const images = {
  hero: 'https://picsum.photos/seed/cyberhero/800/600',
  features: 'https://picsum.photos/seed/cyberfeatures/800/600',
  team: 'https://picsum.photos/seed/cyberteam/800/600',
  product: 'https://picsum.photos/seed/cyberproduct/800/600',
  nature: 'https://picsum.photos/seed/cybernature/800/600',
  office: 'https://picsum.photos/seed/cyberoffice/800/600',
  technology: 'https://picsum.photos/seed/cybertech/800/600',
  abstract: 'https://picsum.photos/seed/cyberabstract/800/600',
};

export const getSemanticImage = (key: keyof typeof images): string => {
  return images[key] || images['hero'];
};
