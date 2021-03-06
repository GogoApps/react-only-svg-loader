import { optimize } from 'react-svg-core';
import * as babel from 'babel-core';
import { getOptions, parseQuery } from 'loader-utils';
import fallback from 'url-loader';
import { rewriteQuery } from './utils';

export default async function (src) {
  const {
    minification,
  } = getOptions(this);
  const {
    inline,
  } = parseQuery(this.resourceQuery);

  const cb = this.async();
  try {
    const svg = await optimize(minification)(String(src));
    if (inline) {
      cb(
        null,
        babel.transform(svg, {
          presets: ['es2015', 'react'],
          plugins: ['syntax-jsx', 'transform-object-rest-spread', 'babel-plugin-react-svg'],
        }).code,
      );
    } else {
      cb(null, fallback.call(rewriteQuery(this, ['limit']), svg));
    }
  } catch (err) {
    cb(err);
  }
}
