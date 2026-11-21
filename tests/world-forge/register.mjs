// Lets Node's built-in test runner import the app's TypeScript sources directly.
// Node strips types natively (v22.18+); this hook only resolves the extensionless
// relative imports that Vite and TypeScript allow (`./route` → `./route.ts`).
import { register } from 'node:module';

const hook = `
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (error) {
    const relative = specifier.startsWith('./') || specifier.startsWith('../');
    const hasExtension = /\\.[cm]?[jt]sx?$/.test(specifier);
    if (relative && !hasExtension) return next(specifier + '.ts', context);
    throw error;
  }
}
`;

register('data:text/javascript,' + encodeURIComponent(hook));
