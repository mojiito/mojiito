export declare enum LifecycleHooks {
    OnInit = 0,
    OnChanges = 1,
    OnRender = 2,
    OnDestroy = 3,
}
export declare abstract class OnInit {
    abstract onInit(): void;
}
export declare abstract class OnChanges {
    abstract onChanges(): void;
}
export declare abstract class OnRender {
    abstract onRender(): void;
}
export declare abstract class OnDestroy {
    abstract onDestroy(): void;
}
