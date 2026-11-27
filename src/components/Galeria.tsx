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
  const hasMultiple = () => props.imagens.length > 1;

  onMount(() => {
    if (!sliderEl || !hasMultiple()) return;
    slider = new KeenSlider(sliderEl, {
      loop: false,
      slideChanged(s) {
        setCurrent(s.track.details.rel);
      },
    });
  });

  onCleanup(() => {
    slider?.destroy();
  });

  const go = (idx: number) => {
    slider?.moveToIdx(idx);
  };

  return (
    <div class="galeria" data-multi={hasMultiple()}>
      <div ref={sliderEl} class="keen-slider galeria-slider rounded-2xl overflow-hidden">
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
        .galeria-slider {
          background: color-mix(in oklab, var(--color-cream) 70%, white);
          box-shadow: var(--shadow-card);
        }
        .galeria-slide {
          aspect-ratio: 3 / 4;
          position: relative;
          overflow: hidden;
        }
        .galeria-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.9s cubic-bezier(0.2, 0.9, 0.3, 1);
        }
        /* Soft cinematic transition only when multiple slides AND slider is active */
        .galeria[data-multi="true"] .galeria-slide:not(.keen-slider__slide--active) img {
          transform: scale(0.98);
        }
        .galeria[data-multi="true"] .galeria-slide.keen-slider__slide--active img {
          transform: scale(1.01);
        }

        .thumb-dot {
          width: 28px;
          height: 4px;
          border-radius: 999px;
          background: color-mix(in oklab, var(--color-ink) 12%, transparent);
          padding: 0;
          border: 0;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease, width 0.3s ease;
        }
        .thumb-dot[data-active='true'] {
          background: color-mix(in oklab, var(--color-gold) 30%, transparent);
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
