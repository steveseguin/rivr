const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');
const source = fs.readFileSync(process.env.RIVR_SOURCE || path.join(__dirname, '..', 'rivr.js'), 'utf8');
function setup(t, markup) {
  const dom = new JSDOM(markup, { runScripts: 'outside-only' });
  dom.window.eval(source);
  t.after(() => dom.window.close());
  return dom.window;
}

for (const [directive, data, expected] of [
  ['thumb', { thumbnail: 'thumbnail.jpg' }, 'thumbnail.jpg'],
  ['thumb', { image: 'fallback.jpg' }, 'fallback.jpg'],
  ['link', { url: '/details' }, '/details'],
  ['brandName', { brand: 'Acme' }, 'Acme'],
  ['listPrice', { originalPrice: 30 }, '30'],
  ['thumb', { thumb: 'direct.jpg', thumbnail: 'ignored.jpg' }, 'direct.jpg'],
]) {
  test(`renders ${directive} from ${Object.keys(data).join(', ')}`, t => {
    const window = setup(t, `<main class="target _-"><span class="_-${directive}"></span></main>`);
    window.initRivr('.target', data);
    assert.equal(window.document.querySelector('span').textContent, expected);
  });
}
test('passes the resolved alias to the transformer', t => {
  const window = setup(t, '<main class="target _-"><span class="_-listPrice"></span></main>');
  window.initRivr('.target', { originalPrice: 30 }, { transformers: { listPrice: value => `$${value.toFixed(2)}` } });
  assert.equal(window.document.querySelector('span').textContent, '$30.00');
});
test('missing data leaves the existing placeholder intact', t => {
  const window = setup(t, '<main class="target _-"><span class="_-thumb">placeholder</span></main>');
  window.initRivr('.target', {});
  assert.equal(window.document.querySelector('span').textContent, 'placeholder');
});
test('nested thumbnail aliases do not abort the whole product list', t => {
  const window = setup(t, '<main class="products _-"><article class="product _-_"><img class="_-images-thumb"><h2 class="_-name"></h2></article></main>');
  window.initRivr('.products', [{ name: 'A', images: { thumbnail: 'a.jpg' } }, { name: 'B', images: { thumbnail: 'b.jpg' } }]);
  assert.deepEqual([...window.document.querySelectorAll('h2')].map(node => node.textContent), ['A', 'B']);
  assert.deepEqual([...window.document.querySelectorAll('img')].map(node => node.getAttribute('src')), ['a.jpg', 'b.jpg']);
});
