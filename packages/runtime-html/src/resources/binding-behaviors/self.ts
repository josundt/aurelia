import { type BindingBehaviorInstance } from '@aurelia/runtime';
import { Listener } from '../../binding/listener';
import { bindingBehavior } from '../binding-behavior';

import type { Scope } from '@aurelia/runtime';
import { createError } from '../../utilities';

/** @internal */
export function handleSelfEvent(this: SelfableBinding, event: Event): ReturnType<Listener['callSource']> {
  const target = event.composedPath()[0];

  if (this.target !== target) {
    return;
  }

  return this.selfEventCallSource(event);
}

export type SelfableBinding = Listener & {
  selfEventCallSource: Listener['callSource'];
};

export class SelfBindingBehavior implements BindingBehaviorInstance {
  public bind(_scope: Scope, binding: SelfableBinding): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!binding.callSource || !binding.targetEvent) {
      if (__DEV__)
        throw createError(`AUR0801: Self binding behavior only supports events.`);
      else
        throw createError(`AUR0801`);
    }

    binding.selfEventCallSource = binding.callSource;
    binding.callSource = handleSelfEvent;
  }

  public unbind(_scope: Scope, binding: SelfableBinding): void {
    binding.callSource = binding.selfEventCallSource;
    binding.selfEventCallSource = null!;
  }
}

bindingBehavior('self')(SelfBindingBehavior);
