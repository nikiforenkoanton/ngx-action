import { Observable }                                                      from 'rxjs';
import { removeParentActionHandlerIfOverwritten }                          from './internals/helpers';
import { asyncActionHandlersSymbol }                                       from './internals/symbols';
import { ActionClass, AsyncActionHandlerMeta, DecoratedClassInstanceType } from './internals/types';

export function AsyncActionHandler<AC extends ActionClass>(actionClass: AC) {
  return function (
    decoratedClassInstance: DecoratedClassInstanceType,
    key: string,
    descriptor: TypedPropertyDescriptor<(handle$: Observable<InstanceType<AC>>) => Observable<any>>,
  ): void {
    decoratedClassInstance[asyncActionHandlersSymbol] = (decoratedClassInstance[asyncActionHandlersSymbol] || []).slice();
    const asyncActionHandlers: AsyncActionHandlerMeta[] = decoratedClassInstance[asyncActionHandlersSymbol];
    const actionHandlerMeta: AsyncActionHandlerMeta = {
      methodName: key,
      actionClass,
      method: descriptor.value!,
    };
    removeParentActionHandlerIfOverwritten(asyncActionHandlers, actionHandlerMeta);
    asyncActionHandlers.push(actionHandlerMeta);
  };
}
