import { DI, type MaybePromise, type IRegistry, type IDisposable } from '@aurelia/kernel';

export const IActionHandler = DI.createInterface<IActionHandler>('IActionHandler');
export type IActionHandler<T = any> = (state: T, action: unknown) => MaybePromise<T>;

export const IStore = DI.createInterface<IStore<object>>('IStore');
export interface IStore<T extends object, TAction = unknown> {
  subscribe(subscriber: IStoreSubscriber<T>): void;
  unsubscribe(subscriber: IStoreSubscriber<T>): void;
  getState(): T;
  /**
   * Dispatch an action by name or the function itself. The action needs to be registered with the store.
   *
   * @param action - the name or the action to be dispatched
   * @param params - all the parameters to be called with the action
   */
  dispatch(action: TAction): void | Promise<void>;
}

export const IState = DI.createInterface<object>('IState');

export type IRegistrableAction = IActionHandler & IRegistry;

export interface IStoreSubscriber<T extends object> {
  handleStateChange(state: T, prevState: T): void;
}

/** @internal */
export type SubscribableValue = {
  subscribe(cb: (res: unknown) => void): IDisposable | Unsubscribable | (() => void);
};

/** @internal */
export type Unsubscribable = {
  unsubscribe(): void;
};
