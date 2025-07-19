import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {defineDotprompt} from 'genkit/dotprompt';

// NOTE: The `configureGenkit` function is deprecated in Genkit 1.x.
// The `genkit` constructor should be used instead.
// The AI/GoogleAI plugin is configured by default.
export const ai = genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export default {
  // Add Genkit assets here
};
