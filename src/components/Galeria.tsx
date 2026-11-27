import { onMount, onCleanup, createSignal, For, Show } from 'solid-js';
import KeenSlider, { type KeenSliderInstance } from 'keen-slider';
import 'keen-slider/keen-slider.min.css';

type Props = {
  imagens: string[];
  alt: string;
};

export default function Galeria(props: Props) {
  const [current, setCurrent] = createSignal(0);
  let sliderEl: HTMLDivElement | undefined;
  let slider: KeenSliderInstance | undefined;
  let resizeObserver: ResizeObserver | undefined;
  const hasMultiple = () => props.imagens.length > 1;

  onMount(() => {
    if (!sliderEl || !hasMultiple()) return;
    slider = new KeenSlider(sliderEl, {
      loop: false,
      slides: {
        perView: 1,
        spacing: 0,
      },
      slideChanged(s) {
        setCurrent(s.track.details.rel);
      },
    });

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        slider?.update();
      });
      resizeObserver.observe(sliderEl);
    }
  });

  onCleanup(() => {
    resizeObserver?.disconnect();
    slider?.destroy();
  });

  const go = (idx: number) => {
    slider?.moveToIdx(idx);
  };

  const prev = () => slider?.prev();
  const next = () => slider?.next();

  return (
    <div class="galeria" data-multi={hasMultiple()}>
      <div class="galeria-stage relative w-full overflow-hidden rounded-2xl">
        <div ref={sliderEl} class="keen-slider galeria-slider">
          <For each={props.imagens}>
            {(src, i) => (
              <div class="keen-slider__slide galeria-slide">
                <img
                  src={src}
                  alt={`${props.alt} — foto ${i() + 1}`}
                  loading={i() === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            )}
          </For>
        </div>

        <Show when={hasMultiple()}>
          <button
            type="button"
            onClick={prev}
            disabled={current() === 0}
            class="galeria-arrow galeria-arrow-prev"
            aria-label="Foto anterior"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={current() === props.imagens.length - 1}
            class="galeria-arrow galeria-arrow-next"
            aria-label="Próxima foto"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <span class="galeria-counter" aria-live="polite">
            {current() + 1} / {props.imagens.length}
          </span>
        </Show>
      </div>

      <Show when={hasMultiple()}>
        <div class="galeria-thumbs mt-4 flex items-center justify-center gap-2.5">
          <For each={props.imagens}>
            {(_, i) => (
              <button
                type="button"
                onClick={() => go(i())}
                class="thumb-dot"
                data-active={current() === i()}
                aria-label={`Ir para foto ${i() + 1}`}
              >
                <span></span>
              </button>
            )}
          </For>
        </div>
      </Show>

      <style>{`
        .galeria {
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }
        .galeria-stage {
          background: color-mix(in oklab, var(--color-cream) 70%, white);
          box-shadow: var(--shadow-card);
        }
        .galeria-slider {
          width: 100%;
          max-width: 100%;
        }
        .galeria-slide {
          aspect-ratio: 3 / 4;
          position: relative;
          overflow: hidden;
          min-width: 100%;
          width: 100%;
        }
        .galeria-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          transition: transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1);
        }
        .galeria[data-multi="true"] .galeria-slide:not(.keen-slider__slide--active) img {
          transform: scale(0.99);
        }
        .galeria[data-multi="true"] .galeria-slide.keen-slider__slide--active img {
          transform: scale(1);
        }

        .galeria-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.35rem;
          height: 2.35rem;
          border-radius: 999px;
          background: color-mix(in oklab, var(--color-cream) 82%, transparent);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid color-mix(in oklab, var(--color-ink) 12%, transparent);
          color: var(--color-ink);
          cursor: pointer;
          transition: opacity 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }
        .galeria-arrow:hover:not(:disabled) {
          background: var(--color-cream);
        }
        .galeria-arrow:disabled {
          opacity: 0.3;
          cursor: default;
        }
        .galeria-arrow-prev { left: 0.75rem; }
        .galeria-arrow-next { right: 0.75rem; }

        .galeria-counter {
          position: absolute;
          right: 0.75rem;
          bottom: 0.75rem;
          z-index: 10;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          background: color-mix(in oklab, var(--color-burgundy-deep) 74%, transparent);
          backdrop-filter: blur(8px);
          color: var(--color-cream);
          font-size: 0.7rem;
          letter-spacing: 0.12em;
        }

        .thumb-dot {
          width: 28px;
          height: 4px;
          border-radius: 999px;
          background: color-mix(in oklab, var(--color-ink) 14%, transparent);
          padding: 0;
          border: 0;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease, width 0.3s ease;
        }
        .thumb-dot[data-active='true'] {
          background: color-mix(in oklab, var(--color-gold) 35%, transparent);
          width: 48px;
        }
        .thumb-dot[data-active='true'] span {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
          transform: translateX(-100%);
          animation: shimmer 2.4s linear infinite;
        }
      `}</style>
    </div>
  );
}
