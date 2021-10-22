const path = require('path');
const { suffixConditionImportPlugin } = require('../dist/index');

require('esbuild')
  .build({
    entryPoints: [path.resolve(__dirname, 'src/index.js')],
    bundle: true,
    outfile: path.resolve(__dirname, 'dist/out.js'),
    plugins: [suffixConditionImportPlugin({ suffix: 'scene', debug: true })],
  })
  .then(() => console.log('\nDone'))
  .catch(() => process.exit(-1));
