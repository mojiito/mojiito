export declare enum LifecycleHook {
    OnInit = 0,
    OnChanges = 1,
    OnBeforeCheck = 2,
    OnAfterCheck = 3,
    OnRender = 4,
    OnParse = 5,
    OnDestroy = 6,
}
export declare abstract class OnInit {
    abstract onInit(): void;
}
export declare abstract class OnChanges {
    abstract onChanges(): void;
}
export declare abstract class OnBeforeCheck {
    abstract onBeforeCheck(): void;
}
export declare abstract class OnAfterCheck {
    abstract onAfterCheck(): void;
}
export declare abstract class OnRender {
    abstract onRender(): void;
}
export declare abstract class OnParse {
    abstract onParse(): void;
}
export declare abstract class OnDestroy {
    abstract onDestroy(): void;
}
export declare function triggerLifecycleHook(hook: LifecycleHook, instance: {
    [key: string]: any;
}, ...args: any[]): void;
