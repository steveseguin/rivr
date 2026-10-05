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

const markup = '<main class="products _-"><article class="product _-_"><h2 class="_-name"></h2><button>Buy</button></article></main>';
test('loop handlers receive the item, original event, and live element', t => {
  const window = setup(t, markup);
  const items = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }];
  const calls = [];
  window.initRivr('.products', items, { events: { click: (item, event, element) => calls.push({ item, event, element }) } });
  const buttons = [...window.document.querySelectorAll('button')];
  buttons.forEach(button => button.click());
  assert.equal(calls.length, 2);
  calls.forEach((call, index) => {
    assert.equal(call.item, items[index]);
    assert.equal(call.event.target, buttons[index]);
    assert.equal(call.element, buttons[index].parentElement);
    assert.equal(call.element.isConnected, true);
  });
});
test('multiple handlers fire once for each repeat action', t => {
  const window = setup(t, markup);
  const calls = [];
  window.initRivr('.products', [{ name: 'A' }], { events: { click: () => calls.push('click'), mouseover: () => calls.push('mouseover') } });
  const row = window.document.querySelector('article');
  row.click(); row.click(); row.dispatchEvent(new window.Event('mouseover'));
  assert.deepEqual(calls, ['click', 'click', 'mouseover']);
});
test('zero items remove the template without affecting siblings', t => {
  const window = setup(t, '<main class="products _-"><article class="product _-_"><h2 class="_-name"></h2></article><footer>footer</footer></main>');
  window.initRivr('.products', [], { events: { click: () => assert.fail('unexpected click') } });
  assert.equal(window.document.querySelectorAll('article').length, 0);
  assert.equal(window.document.querySelector('footer').textContent, 'footer');
});
test('ordinary loop rendering still maps content and attributes', t => {
  const window = setup(t, '<main class="products _-"><article class="product _-_"><a class="_-link"><span class="_-name"></span></a><h2 class="_-name"></h2></article></main>');
  window.initRivr('.products', [{ name: 'A', link: '/a' }, { name: 'B', link: '/b' }]);
  assert.deepEqual([...window.document.querySelectorAll('h2')].map(node => node.textContent), ['A', 'B']);
  assert.deepEqual([...window.document.querySelectorAll('a')].map(node => node.getAttribute('href')), ['/a', '/b']);
});
test('nested loop listeners survive outer loop insertion', t => {
  const window = setup(t, '<main class="products _-"><section class="product _-_"><h2 class="_-name"></h2><ul class="_-children-"><li class="_-_"><button class="_-name"></button></li></ul></section></main>');
  const calls = [];
  window.initRivr('.products', [{ name: 'parent', children: [{ name: 'child' }] }], { events: { click: (item, event) => { calls.push(item.name); event.stopPropagation(); } } });
  window.document.querySelector('button').click();
  assert.deepEqual(calls, ['child']);
});
