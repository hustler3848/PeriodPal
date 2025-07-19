import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@gen-ai/google-ai';
import { defineDotprompt } from 'genkit/dotprompt';

configureGenkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export default {
  // Add Genkit assets here
};
