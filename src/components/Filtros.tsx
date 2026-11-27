import { createSignal, createMemo, createEffect, For, Show, onMount } from 'solid-js';

type CorInfo = { key: string; label: string; hex: string };
type Props = {
  cores: CorInfo[];
  ocasioes: { key: string; label: string }[];
  tamanhos: string[];
};

export default function Filtros(props: Props) {
  const [cor, setCor] = createSignal<string | null>(null);
  const [ocasiao, setOcasiao] = createSignal<string | null>(null);
  const [tamanho, setTamanho] = createSignal<string | null>(null);
  const [busca, setBusca] = createSignal('');
  const [open, setOpen] = createSignal(false);

  const hydrateFromURL = () => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    if (p.get('cor')) setCor(p.get('cor'));
    if (p.get('ocasiao')) setOcasiao(p.get('ocasiao'));
    if (p.get('tamanho')) setTamanho(p.get('tamanho'));
    if (p.get('q')) setBusca(p.get('q') ?? '');
  };

  onMount(hydrateFromURL);

  const activeCount = createMemo(() => {
    let n = 0;
    if (cor()) n++;
    if (ocasiao()) n++;
    if (tamanho()) n++;
    if (busca().trim()) n++;
    return n;
  });

  const limpar = () => {
    setCor(null);
    setOcasiao(null);
    setTamanho(null);
    setBusca('');
  };

  const applyFilters = () => {
    if (typeof document === 'undefined') return;
    const cards = document.querySelectorAll<HTMLElement>('.vestido-card');
    const q = busca().trim().toLowerCase();
    let visible = 0;
    cards.forEach((c) => {
      const cCor = c.dataset.cor ?? '';
      const cOcasioes = (c.dataset.ocasioes ?? '').split(',');
      const cTamanhos = (c.dataset.tamanhos ?? '').split(',');
      const cCodigo = (c.dataset.codigo ?? '').toLowerCase();
      const cNome = (c.dataset.nome ?? '').toLowerCase();

      const okCor = !cor() || cCor === cor();
      const okOca = !ocasiao() || cOcasioes.includes(ocasiao()!);
      const okTam = !tamanho() || cTamanhos.includes(tamanho()!);
      const okQ = !q || cNome.includes(q) || cCodigo.includes(q);

      const show = okCor && okOca && okTam && okQ;
      c.dataset.hidden = show ? 'false' : 'true';
      if (show) visible++;
    });

    const empty = document.querySelector<HTMLElement>('[data-catalogo-empty]');
    if (empty) empty.style.display = visible === 0 ? 'flex' : 'none';

    const params = new URLSearchParams();
    if (cor()) params.set('cor', cor()!);
    if (ocasiao()) params.set('ocasiao', ocasiao()!);
    if (tamanho()) params.set('tamanho', tamanho()!);
    if (q) params.set('q', q);
    const url = params.toString() ? `?${params.toString()}#catalogo` : window.location.pathname + '#catalogo';
    window.history.replaceState(null, '', url);
  };

  createEffect(() => {
    cor();
    ocasiao();
    tamanho();
    busca();
    applyFilters();
  });

  return (
    <div class="filtros">
      <div class="filtros-bar flex flex-wrap items-center gap-3">
        <div class="filtros-search relative flex-1 min-w-[160px] max-w-xs">
          <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            type="search"
            placeholder="Buscar por nome ou código"
            value={busca()}
            onInput={(e) => setBusca(e.currentTarget.value)}
            class="w-full rounded-full border border-ink/12 bg-white/70 py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 backdrop-blur"
            aria-label="Buscar vestido"
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open())}
          class="filtros-toggle inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white/70 px-4 py-2.5 text-sm text-ink backdrop-blur transition-colors hover:border-ink/25"
          aria-expanded={open()}
          aria-controls="filtros-painel"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Filtros
          <Show when={activeCount() > 0}>
            <span class="rounded-full bg-gold px-1.5 text-[0.65rem] font-medium leading-5 text-ink">{activeCount()}</span>
          </Show>
        </button>

        <Show when={activeCount() > 0}>
          <button
            type="button"
            onClick={limpar}
            class="text-xs text-ink/55 underline-offset-4 hover:text-ink hover:underline"
          >
            Limpar filtros
          </button>
        </Show>
      </div>

      <div
        id="filtros-painel"
        class="filtros-painel"
        data-open={open()}
      >
        <div class="space-y-5 pt-5">
          <div>
            <p class="filter-label">Cor</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <For each={props.cores}>
                {(c) => (
                  <button
                    type="button"
                    onClick={() => setCor(cor() === c.key ? null : c.key)}
                    class="color-chip group"
                    data-active={cor() === c.key}
                    aria-pressed={cor() === c.key}
                    aria-label={`Cor ${c.label}`}
                    style={{ '--chip': c.hex }}
                    title={c.label}
                  >
                    <span class="color-dot" style={{ background: c.hex }} aria-hidden="true"></span>
                    <span class="color-label">{c.label}</span>
                  </button>
                )}
              </For>
            </div>
          </div>

          <div>
            <p class="filter-label">Ocasião</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <For each={props.ocasioes}>
                {(o) => (
                  <button
                    type="button"
                    onClick={() => setOcasiao(ocasiao() === o.key ? null : o.key)}
                    class="pill-chip"
                    data-active={ocasiao() === o.key}
                    aria-pressed={ocasiao() === o.key}
                  >
                    {o.label}
                  </button>
                )}
              </For>
            </div>
          </div>

          <div>
            <p class="filter-label">Tamanho</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <For each={props.tamanhos}>
                {(t) => (
                  <button
                    type="button"
                    onClick={() => setTamanho(tamanho() === t ? null : t)}
                    class="pill-chip"
                    data-active={tamanho() === t}
                    aria-pressed={tamanho() === t}
                  >
                    {t}
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
