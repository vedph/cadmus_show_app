import { EnvService } from './env.service';

// https://www.jvandemo.com/how-to-use-environment-variables-to-configure-your-angular-application-without-a-rebuild/

/**
 * This function creates an instance of EnvService, and copies
 * all the properties from window.__env object into it.
 */
export const EnvServiceFactory = () => {
  const env = new EnvService();

  // read environment variables from browser window
  const browserWindow: any = window || {};
  const browserWindowEnv = browserWindow['__env'] || {};

  // assign environment variables from browser window to env;
  // in the current implementation, properties from env.js
  // overwrite defaults (if any) from the EnvService.
  for (const key in browserWindowEnv) {
    if (browserWindowEnv.hasOwnProperty(key)) {
      env.set(key, browserWindowEnv[key]);
    }
  }

  return env;
};

/**
 * A provider recipe for the EnvService.
 * This must be registered in the applications providers array.
 */
export const EnvServiceProvider = {
  provide: EnvService,
  useFactory: EnvServiceFactory,
  deps: [],
};
