import { type MorseCode, morseCodeReading, morseCodeToText } from '#src/domain/morse/code.js';

interface MorseSignalsProps {
  code: MorseCode;
}

/** 長点は短点 3 つ分、符号の中の間は短点 1 つ分という規則の比率のまま描く */
export default function MorseSignals({ code }: MorseSignalsProps) {
  return (
    <span
      class="inline-flex items-center gap-1.5"
      role="img"
      aria-label={morseCodeReading(code)}
      title={morseCodeToText(code)}
    >
      {code.signals.map((signal) => (
        <span
          class={`h-1.5 rounded-full bg-base-content ${signal === 'dot' ? 'w-1.5' : 'w-4.5'}`}
        />
      ))}
    </span>
  );
}
