export enum LifecycleHook {
    OnInit,
    OnChanges,
    OnBeforeCheck,
    OnAfterCheck,
    OnRender,
    OnParse,
    OnDestroy
}

const hooks = [
    'onInit',
    'onChanges',
    'onBeforeCheck',
    'onAfterCheck',
    'onRender',
    'onParse',
    'onDestro'
]

export abstract class OnInit {
    abstract onInit(): void;
}

export abstract class OnChanges {
    abstract onChanges(): void;
}

export abstract class OnBeforeCheck {
    abstract onBeforeCheck(): void;
}

export abstract class OnAfterCheck {
    abstract onAfterCheck(): void;
}

export abstract class OnRender {
    abstract onRender(): void;
}

export abstract class OnParse {
    abstract onParse(): void;
}

export abstract class OnDestroy {
    abstract onDestroy(): void;
}

export function triggerLifecycleHook(hook: LifecycleHook, instance: { [key: string]: any }, ...args: any[]) {
    let name = hooks[hook];
    if (instance && typeof instance[name] === 'function') {
        instance[name].apply(instance, args);
    }
}