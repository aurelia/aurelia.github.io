// Bundles the Aurelia packages the playground preview can import from.
// The preview iframe loads this as a classic script, so everything shares
// one copy of the framework and is exposed on a single global.
import * as aurelia from 'aurelia';
import * as kernel from '@aurelia/kernel';
import * as runtime from '@aurelia/runtime';
import * as runtimeHtml from '@aurelia/runtime-html';
import * as router from '@aurelia/router';
import * as fetchClient from '@aurelia/fetch-client';
import * as validation from '@aurelia/validation';
import * as validationHtml from '@aurelia/validation-html';
import * as state from '@aurelia/state';
import * as dialog from '@aurelia/dialog';

const asModule = (ns: object) => Object.freeze({ ...ns, __esModule: true });

(globalThis as Record<string, unknown>).__AURELIA_PLAYGROUND__ = {
  version: __AURELIA_VERSION__,
  modules: {
    'aurelia': asModule(aurelia),
    '@aurelia/kernel': asModule(kernel),
    '@aurelia/runtime': asModule(runtime),
    '@aurelia/runtime-html': asModule(runtimeHtml),
    '@aurelia/router': asModule(router),
    '@aurelia/fetch-client': asModule(fetchClient),
    '@aurelia/validation': asModule(validation),
    '@aurelia/validation-html': asModule(validationHtml),
    '@aurelia/state': asModule(state),
    '@aurelia/dialog': asModule(dialog),
  },
};
