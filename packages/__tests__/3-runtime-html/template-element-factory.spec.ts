
import { ITemplateElementFactory } from '@aurelia/runtime-html';
import { TestContext, assert } from '@aurelia/testing';

describe('3-runtime-html/template-element-factory.spec.ts', function () {
  let sut: ITemplateElementFactory;
  let ctx: TestContext;

  // eslint-disable-next-line mocha/no-hooks
  beforeEach(function () {
    ctx = TestContext.create();
    sut = ctx.container.get(ITemplateElementFactory);
  });

  it('template-wrapped markup string', function () {
    const markup = `<template><div class="au">foo</div></template>`;

    const expectedHTML = markup;
    const actualHTML = sut.createTemplate(markup).outerHTML;

    assert.strictEqual(actualHTML, expectedHTML, `actualHTML`);
  });

  it('non-template-wrapped markup string', function () {
    const markup = `<div class="au">foo</div>`;

    const expectedHTML = `<template>${markup}</template>`;
    const actualHTML = sut.createTemplate(markup).outerHTML;

    assert.strictEqual(actualHTML, expectedHTML, `actualHTML`);
  });

  it('double template-wrapped markup string', function () {
    const markup = `<template><div class="au">foo</div></template>`.repeat(2);

    const expectedHTML = `<template>${markup}</template>`;
    const actualHTML = sut.createTemplate(markup).outerHTML;

    assert.strictEqual(actualHTML, expectedHTML, `actualHTML`);
  });

  it('double non-template-wrapped markup string', function () {
    const markup = `<div class="au">foo</div>`.repeat(2);

    const expectedHTML = `<template>${markup}</template>`;
    const actualHTML = sut.createTemplate(markup).outerHTML;

    assert.strictEqual(actualHTML, expectedHTML, `actualHTML`);
  });

  it('template node', function () {
    const markup = `<div class="au">foo</div>`;
    const template = ctx.createElement('template');
    template.innerHTML = markup;
    const node = template;

    const expectedHTML = `<template>${markup}</template>`;
    const actualHTML = sut.createTemplate(node).outerHTML;

    assert.strictEqual(actualHTML, expectedHTML, `actualHTML`);
  });

  it('non-template node', function () {
    const markup = `<div class="au">foo</div>`;
    const template = ctx.createElement('template') as HTMLTemplateElement;
    template.innerHTML = markup;
    const node = template.content.firstElementChild;

    const expectedHTML = `<template>${markup}</template>`;
    const actualHTML = sut.createTemplate(node).outerHTML;

    assert.strictEqual(actualHTML, expectedHTML, `actualHTML`);
  });

  it('template node with parent', function () {
    const markup = `<template><div class="au">foo</div></template>`;
    const template = ctx.createElement('template') as HTMLTemplateElement;
    template.innerHTML = markup;
    const node = template.content.firstElementChild;

    assert.notStrictEqual(node.parentNode, null, `node.parentNode`);

    const expectedHTML = markup;
    const actualNode = sut.createTemplate(node);

    assert.strictEqual(actualNode.outerHTML, expectedHTML, `actualNode.outerHTML`);
    assert.strictEqual(actualNode.parentNode, null, `actualNode.parentNode`);
  });
});
