declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export type DressTrackPayload = {
  code: string;
  name: string;
  color: string;
  modelagem?: string;
};

function pushDataLayer(event: string, payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

export function trackViewDress(dress: DressTrackPayload) {
  if (typeof window === 'undefined') return;
  const payload = {
    content_type: 'product',
    content_ids: [dress.code],
    content_name: dress.name,
    content_category: dress.color,
    dress_code: dress.code,
    dress_name: dress.name,
    dress_color: dress.color,
    modelagem: dress.modelagem ?? '',
  };
  pushDataLayer('view_dress', payload);
  window.fbq?.('track', 'ViewContent', {
    content_type: 'product',
    content_ids: [dress.code],
    content_name: dress.name,
    content_category: dress.color,
  });
  window.gtag?.('event', 'view_item', {
    items: [
      {
        item_id: dress.code,
        item_name: dress.name,
        item_category: dress.color,
        item_variant: dress.modelagem,
      },
    ],
  });
}

export function trackFilterSearch(params: {
  query?: string;
  cor?: string | null;
  ocasiao?: string | null;
  tamanho?: string | null;
  resultsCount: number;
}) {
  if (typeof window === 'undefined') return;
  const searchString = [
    params.query?.trim(),
    params.cor ? `cor:${params.cor}` : '',
    params.ocasiao ? `ocasiao:${params.ocasiao}` : '',
    params.tamanho ? `tamanho:${params.tamanho}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  if (!searchString) return;

  pushDataLayer('catalog_search', {
    search_string: searchString,
    results_count: params.resultsCount,
    cor: params.cor ?? null,
    ocasiao: params.ocasiao ?? null,
    tamanho: params.tamanho ?? null,
  });
  window.fbq?.('track', 'Search', {
    search_string: searchString,
    content_category: params.cor ?? 'catalogo',
  });
  window.gtag?.('event', 'search', {
    search_term: searchString,
  });
}

export function trackWhatsAppClick(source: string, dress?: Partial<DressTrackPayload>) {
  if (typeof window === 'undefined') return;
  const payload: Record<string, unknown> = {
    source,
    ...(dress?.code ? { dress_code: dress.code, content_ids: [dress.code] } : {}),
    ...(dress?.name ? { dress_name: dress.name, content_name: dress.name } : {}),
    ...(dress?.color ? { dress_color: dress.color, content_category: dress.color } : {}),
  };
  pushDataLayer('whatsapp_schedule', payload);
  window.fbq?.('track', 'Contact', payload);
  window.fbq?.('trackCustom', 'WhatsAppSchedule', payload);
  window.gtag?.('event', 'generate_lead', {
    method: 'whatsapp',
    source,
    ...payload,
  });
}

export function trackMapsClick(source: string) {
  if (typeof window === 'undefined') return;
  pushDataLayer('find_location', { source });
  window.fbq?.('track', 'FindLocation', { source });
  window.gtag?.('event', 'select_content', {
    content_type: 'maps_directions',
    item_id: source,
  });
}

export function trackInstagramClick(source: string) {
  if (typeof window === 'undefined') return;
  pushDataLayer('click_instagram', { source });
  window.fbq?.('trackCustom', 'ClickInstagram', { source });
  window.gtag?.('event', 'select_content', {
    content_type: 'instagram',
    item_id: source,
  });
}
