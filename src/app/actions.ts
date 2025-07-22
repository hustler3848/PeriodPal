
'use server';

import { translate as translateFlow } from '@/ai/flows/translate-flow';
import type { TranslateInput, TranslateOutput } from '@/ai/flows/translate-flow';

export async function translate(input: TranslateInput): Promise<TranslateOutput> {
    return translateFlow(input);
}
