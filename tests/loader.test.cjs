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

const markup = '<main class="products _-"><article class="product _-_"><h2 class="_-name"></h2></article></main>';
function results(window) { return [...window.document.querySelectorAll('h2')].map(node => node.textContent); }
function fetchData(window, data) { window.fetch = async () => ({ ok: true, json: async () => data }); }
test('successful load replaces the loading indicator with fetched data', async t => {
  const window = setup(t, markup);
  fetchData(window, [{ name: 'A' }, { name: 'B' }]);
  const pending = window.rivrLoad('.products', 'fixture.json');
  assert.equal(window.document.querySelector('.rivr-loading').textContent, 'Loading...');
  const rendered = await pending;
  assert.deepEqual(results(window), ['A', 'B']);
  assert.equal(window.document.querySelector('.rivr-loading'), null);
  assert.equal(rendered, window.document.querySelector('.products'));
});
test('custom loading UI does not become the rendering template', async t => {
  const window = setup(t, markup);
  fetchData(window, [{ name: 'A' }]);
  const pending = window.rivrLoad('.products', 'fixture.json', { loadingTemplate: '<p class="waiting">Please wait</p>' });
  assert.equal(window.document.querySelector('.waiting').textContent, 'Please wait');
  await pending;
  assert.deepEqual(results(window), ['A']);
});
test('failed load can be retried with the original template', async t => {
  const window = setup(t, markup);
  window.console.error = () => {};
  window.fetch = async () => ({ ok: false });
  await assert.rejects(window.rivrLoad('.products', 'fixture.json'));
  assert.ok(window.document.querySelector('.rivr-error'));
  fetchData(window, [{ name: 'recovered' }]);
  await window.rivrLoad('.products', 'fixture.json');
  assert.deepEqual(results(window), ['recovered']);
});
test('sequential loads replace old rows rather than duplicating them', async t => {
  const window = setup(t, markup);
  fetchData(window, [{ name: 'A' }, { name: 'B' }]);
  await window.rivrLoad('.products', 'fixture.json');
  fetchData(window, [{ name: 'C' }]);
  await window.rivrLoad('.products', 'fixture.json');
  assert.deepEqual(results(window), ['C']);
});
test('repeated initRivr and a later load retain the original loop template', async t => {
  const window = setup(t, markup);
  window.initRivr('.products', [{ name: 'A' }, { name: 'B' }]);
  window.initRivr('.products', [{ name: 'C' }]);
  assert.deepEqual(results(window), ['C']);
  fetchData(window, [{ name: 'D' }, { name: 'E' }]);
  await window.rivrLoad('.products', 'fixture.json');
  assert.deepEqual(results(window), ['D', 'E']);
});
test('empty loaded array removes rows and later loading can restore them', async t => {
  const window = setup(t, markup);
  fetchData(window, []);
  await window.rivrLoad('.products', 'fixture.json');
  assert.deepEqual(results(window), []);
  fetchData(window, [{ name: 'restored' }]);
  await window.rivrLoad('.products', 'fixture.json');
  assert.deepEqual(results(window), ['restored']);
});
test('onRender receives the final attached container and data', async t => {
  const window = setup(t, markup);
  const data = [{ name: 'A' }];
  fetchData(window, data);
  let calls = 0;
  const rendered = await window.rivrLoad('.products', 'fixture.json', { onRender: (container, received) => { calls++; assert.equal(container.isConnected, true); assert.equal(received, data); assert.equal(container.querySelector('h2').textContent, 'A'); } });
  assert.equal(calls, 1);
  assert.equal(rendered, window.document.querySelector('.products'));
});
test('missing container still rejects', async t => {
  const window = setup(t, markup);
  window.console.error = () => {};
  await assert.rejects(window.rivrLoad('.absent', 'fixture.json'));
});
