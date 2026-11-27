export const CORES = {
  'verde-esmeralda': { label: 'Verde Esmeralda', hex: '#2F6F55' },
  'fucsia': { label: 'Fúcsia', hex: '#D4425E' },
  'preto': { label: 'Preto', hex: '#1A1A1A' },
  'verde-lima': { label: 'Verde Lima', hex: '#C6D63A' },
  'marsala': { label: 'Marsala', hex: '#8F2F3A' },
  'dourado': { label: 'Dourado', hex: '#C9A961' },
  'amarelo': { label: 'Amarelo', hex: '#E8B94D' },
  'terracota': { label: 'Terracota', hex: '#6B3A2A' },
  'coral': { label: 'Coral', hex: '#E68562' },
  'vermelho': { label: 'Vermelho', hex: '#B91C1C' },
  'marrom': { label: 'Marrom', hex: '#3D2817' },
  'azul-royal': { label: 'Azul Royal', hex: '#1E3A9F' },
  'azul-serenity': { label: 'Azul Serenity', hex: '#A4B8DC' },
  'champagne': { label: 'Champagne', hex: '#D4B896' },
  'off-white': { label: 'Off-white', hex: '#EFE7DB' },
} as const;

export type Cor = keyof typeof CORES;

export const OCASIOES = {
  'madrinha': 'Madrinha',
  'formatura': 'Formatura',
  'mae-dos-noivos': 'Mãe dos Noivos',
  'debutante': 'Debutante',
  'convidada': 'Convidada',
} as const;

export type Ocasiao = keyof typeof OCASIOES;

export const TAMANHOS = ['P', 'M', 'G', 'GG', 'Plus Size'] as const;
export type Tamanho = typeof TAMANHOS[number];

export const MODELAGENS = {
  'sereia': 'Sereia',
  'evase': 'Evasê',
  'fluido': 'Fluido',
  'princesa': 'Princesa',
  'reto': 'Reto',
} as const;

export type Modelagem = keyof typeof MODELAGENS;

export type Vestido = {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  cor: Cor;
  ocasioes: Ocasiao[];
  tamanhos: Tamanho[];
  modelagem: Modelagem;
  imagens: string[];
  destaque?: boolean;
  premium?: boolean;
};

export const vestidos: Vestido[] = [
  {
    id: 'ref-001-azul-royal-princesa',
    codigo: 'REF-001',
    nome: 'Azul Royal Princesa',
    descricao: 'Vestido longo azul royal em cetim, modelagem princesa com saia volumosa. Corselet bordado com aplicações cristalinas delicadas. Formatura com entrada de rainha.',
    cor: 'azul-royal',
    ocasioes: ['formatura', 'debutante', 'madrinha'],
    tamanhos: ['P', 'M', 'G'],
    modelagem: 'princesa',
    imagens: [
      '/img/vestidos/real-azul-royal-01-900.webp',
      '/img/vestidos/real-azul-royal-02-900.webp',
    ],
    destaque: true,
    premium: true,
  },
  {
    id: 'ref-002-serenity-floral',
    codigo: 'REF-002',
    nome: 'Serenity Floral',
    descricao: 'Azul serenity em jacquard floral com corselet estruturado e laço no ombro, saia em camadas armadas. Caimento dramático, perfeito para formatura ou madrinha de casamento.',
    cor: 'azul-serenity',
    ocasioes: ['madrinha', 'formatura', 'convidada'],
    tamanhos: ['P', 'M', 'G'],
    modelagem: 'princesa',
    imagens: [
      '/img/vestidos/real-serenity-01-frente-900.webp',
      '/img/vestidos/real-serenity-02-costas-900.webp',
      '/img/vestidos/real-serenity-03-detalhe-900.webp',
    ],
    destaque: true,
    premium: true,
  },
  {
    id: 'ref-003-noir-fluido',
    codigo: 'REF-003',
    nome: 'Noir Fluido',
    descricao: 'Preto clássico em tecido fluido, caimento solto e elegante. A escolha segura da mãe dos noivos ou convidada formal.',
    cor: 'preto',
    ocasioes: ['mae-dos-noivos', 'convidada', 'formatura'],
    tamanhos: ['P', 'M', 'G', 'GG', 'Plus Size'],
    modelagem: 'fluido',
    imagens: [
      '/img/vestidos/ref-003-frente.svg',
      '/img/vestidos/ref-003-costas.svg',
      '/img/vestidos/ref-003-detalhe.svg',
    ],
    destaque: true,
  },
  {
    id: 'ref-004-lima-princesa',
    codigo: 'REF-004',
    nome: 'Lima Princesa',
    descricao: 'Verde lima moderno em modelagem princesa, saia volumosa com tule interno. Formatura com entrada impactante.',
    cor: 'verde-lima',
    ocasioes: ['formatura', 'debutante'],
    tamanhos: ['P', 'M', 'G'],
    modelagem: 'princesa',
    imagens: [
      '/img/vestidos/ref-004-frente.svg',
      '/img/vestidos/ref-004-costas.svg',
      '/img/vestidos/ref-004-detalhe.svg',
    ],
    destaque: true,
  },
  {
    id: 'ref-005-marsala-evase',
    codigo: 'REF-005',
    nome: 'Marsala Evasê',
    descricao: 'Marsala sofisticado em modelagem evasê, corte imperial que valoriza o busto. Ideal para madrinha em cerimônia diurna ou vespertina.',
    cor: 'marsala',
    ocasioes: ['madrinha', 'mae-dos-noivos'],
    tamanhos: ['M', 'G', 'GG', 'Plus Size'],
    modelagem: 'evase',
    imagens: [
      '/img/vestidos/ref-005-frente.svg',
      '/img/vestidos/ref-005-costas.svg',
      '/img/vestidos/ref-005-detalhe.svg',
    ],
  },
  {
    id: 'ref-006-champagne-franjas',
    codigo: 'REF-006',
    nome: 'Champagne Franjas',
    descricao: 'Champagne em tecido bordado com cristais e franjas em camadas. Peça icônica da linha Premium — brilha em cada movimento, exclusividade garantida no evento.',
    cor: 'champagne',
    ocasioes: ['madrinha', 'formatura', 'convidada'],
    tamanhos: ['P', 'M', 'G'],
    modelagem: 'reto',
    imagens: [
      '/img/vestidos/real-champagne-01-900.webp',
      '/img/vestidos/real-champagne-02-900.webp',
    ],
    destaque: true,
    premium: true,
  },
  {
    id: 'ref-007-amarelo-princesa',
    codigo: 'REF-007',
    nome: 'Amarelo Princesa',
    descricao: 'Amarelo radiante em modelagem princesa, saia armada de tule, corselet com detalhes bordados. Debutante sonho.',
    cor: 'amarelo',
    ocasioes: ['debutante', 'formatura'],
    tamanhos: ['P', 'M', 'G'],
    modelagem: 'princesa',
    imagens: [
      '/img/vestidos/ref-007-frente.svg',
      '/img/vestidos/ref-007-costas.svg',
      '/img/vestidos/ref-007-detalhe.svg',
    ],
    destaque: true,
  },
  {
    id: 'ref-008-terracota-fluido',
    codigo: 'REF-008',
    nome: 'Terracota Fluido',
    descricao: 'Terracota de outono em tecido fluido, caimento suave, corte reto moderno. Para a mãe dos noivos ou convidada com estilo contemporâneo.',
    cor: 'terracota',
    ocasioes: ['mae-dos-noivos', 'convidada'],
    tamanhos: ['M', 'G', 'GG', 'Plus Size'],
    modelagem: 'fluido',
    imagens: [
      '/img/vestidos/ref-008-frente.svg',
      '/img/vestidos/ref-008-costas.svg',
      '/img/vestidos/ref-008-detalhe.svg',
    ],
  },
  {
    id: 'ref-009-coral-evase',
    codigo: 'REF-009',
    nome: 'Coral Evasê',
    descricao: 'Coral alegre em modelagem evasê leve. Ideal para madrinha de casamento ao ar livre ou convidada em evento vespertino.',
    cor: 'coral',
    ocasioes: ['madrinha', 'convidada'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    modelagem: 'evase',
    imagens: [
      '/img/vestidos/ref-009-frente.svg',
      '/img/vestidos/ref-009-costas.svg',
      '/img/vestidos/ref-009-detalhe.svg',
    ],
  },
];

export const CONTATO = {
  nome: 'Rosa Charmosa',
  tagline: 'Locação Moda Festa',
  claim: 'Há 13 anos vestindo as Charmosas com o vestido dos sonhos',
  telefone: '(62) 98515-3577',
  whatsapp: '5562985153577',
  instagramHandle: 'rosacharmosavestidos',
  instagramUrl: 'https://www.instagram.com/rosacharmosavestidos',
  endereco: {
    rua: 'R. Quintino Bocaiúva, 862',
    bairro: 'Setor Campinas',
    cidade: 'Goiânia',
    estado: 'GO',
    cep: '74515-050',
  },
  horario: {
    semana: 'Seg a Sex · 08h às 18h',
    sabado: 'Sáb · 08h às 13h',
    domingo: 'Dom · Fechado',
  },
  mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=R.+Quintino+Bocai%C3%BAva%2C+862%2C+Setor+Campinas%2C+Goi%C3%A2nia+-+GO%2C+74515-050',
  mapsEmbedUrl: 'https://www.google.com/maps?q=R.+Quintino+Bocai%C3%BAva%2C+862%2C+Setor+Campinas%2C+Goi%C3%A2nia+-+GO%2C+74515-050&output=embed',
} as const;

export function whatsappLinkFor(vestido?: Vestido): string {
  const base = `https://wa.me/${CONTATO.whatsapp}`;
  const text = vestido
    ? `Oi, Rosa Charmosa! Vim pelo site, quero agendar uma prova do vestido ${vestido.codigo} — ${vestido.nome}.`
    : `Oi, Rosa Charmosa! Vim pelo site, quero agendar uma prova.`;
  return `${base}?text=${encodeURIComponent(text)}`;
}
