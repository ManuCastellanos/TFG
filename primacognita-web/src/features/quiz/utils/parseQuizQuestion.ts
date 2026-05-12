export interface ParsedOption {
  id: string;
  name: string;
  value: string;
  type: 'radio' | 'checkbox';
  label: string;
  checked: boolean;
  correct: boolean; // Moodle marks the correct row with class 'correct' in review mode
}

export interface ParsedQuestion {
  type: 'multichoice' | 'multianswer' | 'unknown';
  text: string;
  answerHtml: string;
  options: ParsedOption[];
  inputNames: string[];
  hiddenInputs: Array<{ name: string; value: string }>;
}

// Sections that are NOT answer content
const NOISE_SELECTORS = [
  '.info',
  '.im-controls',
  '.submitbtns',
  '.questionflag',
  '.gradingdetails',
  '.outcome',
  '.comment',
  '.accesshide',  // screen-reader-only headers like "Question text", "Answer"
];

const CLEAR_CHOICE_LABELS = [
  'quitar mi elección',
  'quitar selección',
  'clear my choice',
  'no contestar',
  'limpiar selección',
];

function findLabelText(input: HTMLInputElement, doc: Document): string | null {
  // 1. label[for="id"] — do NOT use CSS.escape: colon in attribute value
  //    is not a special character inside quotes and doesn't need escaping.
  if (input.id) {
    const label = doc.querySelector(`label[for="${input.id}"]`);
    if (label) return cleanLabelHtml(label as HTMLElement);
  }

  // 2. Input wrapped directly inside a <label>
  const parentLabel = input.closest('label');
  if (parentLabel) {
    const clone = parentLabel.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('input').forEach((el) => el.remove());
    const text = cleanLabelHtml(clone);
    if (text) return text;
  }

  // 3. Next sibling is a <label>
  const next = input.nextElementSibling;
  if (next?.tagName === 'LABEL') return cleanLabelHtml(next as HTMLElement);

  // 4. A <label> anywhere in the parent element
  const labelInParent = input.parentElement?.querySelector('label');
  if (labelInParent) return cleanLabelHtml(labelInParent as HTMLElement);

  // 5. Text content of parent row (last resort, no HTML formatting)
  const rowText = input.parentElement?.textContent?.trim();
  if (rowText) return rowText;

  return null;
}

// Remove screen-reader cruft and answernumber spans/prefixes, return inner HTML
function cleanLabelHtml(el: HTMLElement): string {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.answernumber, .sr-only, .accesshide').forEach((n) => n.remove());
  let html = clone.innerHTML.trim();
  // Strip leading letter prefix plain-text: "a. ", "b. ", etc.
  html = html.replace(/^[a-zA-Z]\.\s*/, '');
  return html;
}

export function parseQuizQuestion(html: string): ParsedQuestion {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');

  // ── Remove all non-answer UI ───────────────────────────────────────────────
  NOISE_SELECTORS.forEach((sel) => {
    doc.querySelectorAll(sel).forEach((el) => el.remove());
  });

  // ── Question text ──────────────────────────────────────────────────────────
  const text =
    doc.querySelector('.qtext')?.innerHTML?.trim() ??
    doc.querySelector('.formulation .qtext')?.innerHTML?.trim() ??
    '';

  // ── Answer container ───────────────────────────────────────────────────────
  const answerEl =
    doc.querySelector('.answer') ??
    doc.querySelector('.ablock') ??
    doc.querySelector('.formulation');

  const answerHtml = answerEl?.outerHTML ?? '';

  // ── Option extraction ──────────────────────────────────────────────────────
  const options: ParsedOption[] = [];
  const seen = new Set<string>();

  const searchRoot = answerEl ?? doc.body;

  searchRoot
    .querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]')
    .forEach((input) => {
      if (!input.name) return;

      // Skip flag/control inputs
      if (input.name.includes('flagged')) return;

      // "Clear my choice" always has value="" — skip it.
      // Never filter value="0": it can be a real Moodle answer option.
      if (input.value === '') return;

      const key = `${input.name}:${input.value}`;
      if (seen.has(key)) return;
      seen.add(key);

      const labelText = findLabelText(input, doc);
      if (!labelText) return;

      // Skip known clear-choice labels by content
      const plain = labelText.replace(/<[^>]+>/g, '').trim().toLowerCase();
      if (CLEAR_CHOICE_LABELS.some((t) => plain.includes(t))) return;

      // Walk up ancestors (within the answer container) to find a 'correct' class
      const isCorrect = (() => {
        let el: Element | null = input.parentElement;
        while (el && el !== searchRoot) {
          if (el.classList.contains('correct')) return true;
          el = el.parentElement;
        }
        return false;
      })();

      options.push({
        id: input.id,
        name: input.name,
        value: input.value,
        type: input.type as 'radio' | 'checkbox',
        label: labelText,
        checked: input.checked,
        correct: isCorrect,
      });
    });

  // ── Input names (palette answered-detection) ───────────────────────────────
  const inputNames: string[] = [];
  searchRoot.querySelectorAll<HTMLInputElement>('input[name]').forEach((inp) => {
    if (!inp.name.includes('flagged') && !inputNames.includes(inp.name)) {
      inputNames.push(inp.name);
    }
  });

  // ── Hidden inputs (sequencecheck etc. required by Moodle on submission) ────
  // Search the full doc (after noise removal) so we catch sequencecheck
  // even if it lives outside .answer
  const hiddenInputs: Array<{ name: string; value: string }> = [];
  doc.querySelectorAll<HTMLInputElement>('input[type="hidden"]').forEach((inp) => {
    if (!inp.name) return;
    if (inp.name.includes('flagged')) return;
    hiddenInputs.push({ name: inp.name, value: inp.value });
  });

  const isMultiAnswer = options.some((o) => o.type === 'checkbox');

  return {
    type: options.length === 0 ? 'unknown' : isMultiAnswer ? 'multianswer' : 'multichoice',
    text,
    answerHtml,
    options,
    inputNames,
    hiddenInputs,
  };
}

// ── Review-specific parser ────────────────────────────────────────────────────
// Uses Moodle's per-row CSS classes (correct / incorrect / partiallycorrect)
// which are only present in review mode HTML, not in active-attempt HTML.

export type ReviewOption = {
  id: string;
  label: string;
  checked: boolean;
  fraction: number | null; // from data-fraction attribute on the option row
  isCorrect: boolean;      // fraction > 0, or row has .correct class
  isIncorrect: boolean;
  isPartiallyCorrect: boolean;
};

export type ParsedReviewQuestion = {
  text: string;
  options: ReviewOption[];
  correctOptions: ReviewOption[];   // pre-filtered for convenience
  correctAnswerText: string | null; // from Moodle's .rightanswer element (fallback)
  answerHtml: string;               // raw fallback for non-MCQ types
};

// In review mode, .im-controls wraps the read-only answer options — do NOT remove it.
const REVIEW_NOISE_SELECTORS = [
  '.submitbtns',
  '.questionflag',
  '.gradingdetails',
  '.comment',
  '.accesshide',
];

export function parseReviewQuestion(html: string): ParsedReviewQuestion {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');

  REVIEW_NOISE_SELECTORS.forEach((sel) => {
    doc.querySelectorAll(sel).forEach((el) => el.remove());
  });

  const text =
    doc.querySelector('.qtext')?.innerHTML?.trim() ??
    doc.querySelector('.formulation .qtext')?.innerHTML?.trim() ??
    '';

  // .im-controls may wrap .answer in review mode; search broadly
  const answerEl =
    doc.querySelector('.answer') ??
    doc.querySelector('.im-controls') ??
    doc.querySelector('.ablock') ??
    doc.querySelector('.formulation');

  const answerHtml = answerEl?.innerHTML ?? '';
  if (!answerEl) return { text, options: [], answerHtml };

  // Map each DIRECT child of answerEl → its correctness class.
  // Using '.correct input[...]' would find ALL inputs when the question-level wrapper has .correct.
  // Only the individual option rows (direct children) carry per-option correctness classes.
  const rowCorrectness = new Map<Element, { correct: boolean; incorrect: boolean; partial: boolean }>();
  Array.from(answerEl.children).forEach((child) => {
    rowCorrectness.set(child, {
      correct: child.classList.contains('correct'),
      incorrect: child.classList.contains('incorrect'),
      partial: child.classList.contains('partiallycorrect'),
    });
  });

  const options: ReviewOption[] = [];
  const seen = new Set<string>();

  answerEl.querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]').forEach((input) => {
    if (!input.name || input.name.includes('flagged') || input.value === '') return;

    const key = `${input.name}:${input.value}`;
    if (seen.has(key)) return;
    seen.add(key);

    const labelText = findLabelText(input, doc);
    if (!labelText) return;

    const plain = labelText.replace(/<[^>]+>/g, '').trim().toLowerCase();
    if (CLEAR_CHOICE_LABELS.some((t) => plain.includes(t))) return;

    // Find the direct-child-of-answerEl that contains this input
    let rowEl: Element | null = input.parentElement;
    while (rowEl && rowEl.parentElement !== answerEl) {
      rowEl = rowEl.parentElement;
    }
    const info = rowEl ? rowCorrectness.get(rowEl) : undefined;

    // Fraction: Moodle embeds data-fraction on the option row or the input itself
    const fractionAttr =
      rowEl?.getAttribute('data-fraction') ??
      input.getAttribute('data-fraction') ??
      null;
    const fraction = fractionAttr !== null ? parseFloat(fractionAttr) : null;

    // isCorrect: fraction > 0 takes priority; fall back to CSS class on the row
    const isCorrect = fraction !== null ? fraction > 0 : (info?.correct ?? false);

    options.push({
      id: input.id,
      label: labelText,
      checked: input.checked,
      fraction,
      isCorrect,
      isIncorrect: fraction !== null ? fraction <= 0 && input.checked : (info?.incorrect ?? false),
      isPartiallyCorrect: info?.partial ?? false,
    });
  });

  const correctOptions = options.filter((o) => o.isCorrect);

  // .rightanswer is Moodle's text fallback ("The correct answer is: …") shown when
  // quiz settings have "Show correct response" enabled but no per-option marking.
  const rightAnswerEl = doc.querySelector('.rightanswer');
  const correctAnswerText = rightAnswerEl?.textContent?.trim() ?? null;

  return { text, options, correctOptions, correctAnswerText, answerHtml };
}


