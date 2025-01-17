import { BindingMode, customElement, CustomElement, ValueConverter } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
import { delegateSyntax } from '@aurelia/compat-v1';

describe('3-runtime-html/custom-elements.spec.ts', function () {
  it('works with multiple layers of change propagation & <input/>', function () {
    const { ctx, appHost } = createFixture(
      `<input value.bind="first_name | properCase">
      <form-input value.two-way="first_name | properCase"></form-input>`,
      class App {
        public message = 'Hello Aurelia 2!';
        public first_name = '';
      },
      [
        CustomElement.define({
          name: 'form-input',
          template: '<input value.bind="value">',
          bindables: {
            value: { mode: BindingMode.twoWay }
          }
        }, class FormInput { }),
        ValueConverter.define('properCase', class ProperCase {
          public toView(value: unknown): unknown {
            if (typeof value == 'string' && value) {
              return value
                .split(' ')
                .map(m => m[0].toUpperCase() + m.substring(1).toLowerCase())
                .join(' ');
            }
            return value;
          }
        }),
      ],
    );

    const [, nestedInputEl] = Array.from(appHost.querySelectorAll('input'));
    nestedInputEl.value = 'aa bb';
    nestedInputEl.dispatchEvent(new ctx.CustomEvent('input', { bubbles: true }));

    ctx.platform.domWriteQueue.flush();
    assert.strictEqual(nestedInputEl.value, 'Aa Bb');
  });

  it('renders containerless per element via "containerless" attribute', function () {
    const { appHost } = createFixture(
      `<my-el containerless message="hello world">`,
      class App {},
      [CustomElement.define({
        name: 'my-el',
        template: '${message}',
        bindables: ['message']
      })]
    );

    assert.visibleTextEqual(appHost, 'hello world');
  });

  it('renders element with @customElement({ containerness: true })', function () {
    const { assertText } = createFixture(
      `<my-el message="hello world">`,
      class App {},
      [CustomElement.define({
        name: 'my-el',
        template: '${message}',
        bindables: ['message'],
        containerless: true
      })
    ]);

    assertText('hello world');
  });

  it('renders elements with both "containerless" attribute and @customElement({ containerless: true })', function () {
    const { assertText } = createFixture(
      `<my-el containerless message="hello world">`,
      class App {},
      [CustomElement.define({
        name: 'my-el',
        template: '${message}',
        bindables: ['message'],
        containerless: true,
      })]
    );

    assertText('hello world');
  });

  it('renders elements with template controller and containerless attribute on it', function () {
    const { assertText } = createFixture(
      `<my-el if.bind="true" containerless message="hello world">`,
      class App {},
      [CustomElement.define({
        name: 'my-el',
        template: '${message}',
        bindables: ['message']
      })]
    );

    assertText('hello world');
  });

  it('works with multi layer reactive changes', function () {
    @customElement({
      name: 'text-toggler',
      template: '<textarea value.bind="value">',
      bindables: ['range']
    })
    class TextToggler {
      rangeStart = 0;
      rangeEnd = 0;
      range: [number, number] = [0, 0];

      rangeChanged(v: [number, number]) {
        this.rangeStart = v[0];
        this.rangeEnd = v[1];
      }
    }

    const { trigger } = createFixture(
      '<button click.trigger="random()">rando</button> <text-toggler range.bind="range">',
      class {
        range = [0, 0];
        random() {
          this.range = [Math.round(Math.random() * 10), 10 + Math.round(Math.random() * 20)];
        }
      },
      [TextToggler]
    );

    trigger('button', 'click');
  });

  it('works with multi dot event name for trigger', function () {
    let clicked = 0;
    const { trigger } = createFixture(
      '<button bs.open-modal.trigger="clicked()"></button>',
      { clicked: () => clicked = 1 }
    );
    trigger('button', 'bs.open-modal');
    assert.strictEqual(clicked, 1);
  });

  it('works with multi dot event name for delegate', function () {
    let clicked = 0;
    const { trigger } = createFixture(
      '<button bs.open-modal.delegate="clicked()"></button>',
      { clicked: () => clicked = 1 },
      [delegateSyntax]
    );
    trigger('button', 'bs.open-modal', { bubbles: true });
    assert.strictEqual(clicked, 1);
  });

  it('works with multi dot event name for capture', function () {
    let clicked = 0;
    const { trigger } = createFixture(
      '<button bs.open-modal.capture="clicked()"></button>',
      { clicked: () => clicked = 1 }
    );
    trigger('button', 'bs.open-modal');
    assert.strictEqual(clicked, 1);
  });
});
