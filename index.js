const path = require('node:path');
const fs = require('node:fs/promises');
const { constants } = require('node:fs');
const trimEnd = require('lodash.trimend');

function getSuffixedPath(originalPath, suffix) {
  const basename = path.basename(originalPath);
  const dirname = path.dirname(originalPath);
  const extname = path.extname(originalPath);

  return path.resolve(dirname, `${trimEnd(basename, extname)}_${suffix}${extname}`);
}

async function readFile(path) {
  const contents = await fs.readFile(path, 'utf-8');
  return {
    contents,
  };
}

async function exists(filepath) {
  try {
    await fs.access(filepath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function suffixConditionImportPlugin(options) {
  const suffix = (options && options.suffix) || '';
  const debug = (options && options.debug) || process.env.NODE_ENV === 'development' || false;

  return {
    name: 'suffixConditionImport',
    setup(build) {
      build.onLoad({ filter: /\.[jt]s$/ }, async args => {
        if (!suffix) {
          return;
        }

        try {
          const newPath = getSuffixedPath(args.path, suffix);

          await fs.access(newPath, constants.R_OK);

          if (debug) {
            const oldFileName = path.basename(args.path);
            const newFileName = path.basename(newPath);
            console.log(`[SuffixConditionImport] use: ${oldFileName} => ${newFileName}`);
          }

          return readFile(newPath);
        } catch {
          return;
        }
      });
    },
  };
}

module.exports = { suffixConditionImportPlugin };
