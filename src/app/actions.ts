
'use server';

import { translate as translateFlow, TranslateInput } from '@/ai/flows/translate-flow';

export async function translate(input: TranslateInput): Promise<string> {
    return translateFlow(input);
}
