import cache from '@front/manifest/cache';
import requests from '@front/helpers/requests';
import env from '@front/helpers/env';

import manifestParserV1 from '@global/manifest/parser.mjs';
import manifestParserV2 from '@global/manifest/parser2.mjs';

const manifestParser = env.isPlugin() ? manifestParserV2 : manifestParserV1;

manifestParser.cache = cache;

manifestParser.reloadManifest = async function(payload) {
  await manifestParser.startLoad();
  if (payload) {
    await (
      async function parserImport(next = 0) {
        if (payload?.length > next) {
          if (payload[next] === env.rootManifest) {
            await manifestParser.clean();
            /* Подключаем базовую метамодель */
            await manifestParser.import(manifestParser.cache.makeURIByBaseURI(env.uriMetamodel, requests.getSourceRoot()));
          }
          await manifestParser.import(payload[next]);
          await parserImport(next + 1);
        }
      }
    )();
  } else {
    await manifestParser.clean();
    if (!env.isPlugin()) {
      // Подключаем метамодель
      await manifestParser.import(manifestParser.cache.makeURIByBaseURI(env.uriMetamodel, requests.getSourceRoot()));

      // Если необходимо, подключаем документацию DocHub
      env.isAppendDocHubDocs
        && await manifestParser.import(manifestParser.cache.makeURIByBaseURI('/documentation/root.yaml', requests.getSourceRoot()));

      // Если корневой манифест указан загружаем
      env.rootManifest
        && await manifestParser.import(manifestParser.cache.makeURIByBaseURI(env.rootManifest, requests.getSourceRoot()));
    } else {
      /* Подключаем базовую метамодель */
      await manifestParser.import(manifestParser.cache.makeURIByBaseURI(env.uriMetamodel, requests.getSourceRoot()));

      await manifestParser.import(
        manifestParser.cache.makeURIByBaseURI(env.rootManifest, requests.getSourceRoot()));

      manifestParser.loaded = {};
    }
  }
  await manifestParser.checkAwaitedPackages();
  manifestParser.checkLoaded();

  manifestParser.stopLoad();
};

export default manifestParser;
