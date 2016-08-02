export enum LifecycleHooks {
    OnInit,
    OnChanges,
    OnRender,
    OnDestroy
}

export abstract class OnInit {
    abstract onInit(): void;
}

export abstract class OnChanges {
    abstract onChanges(): void;
}

export abstract class OnRender {
    abstract onRender(): void;
}

export abstract class OnDestroy {
    abstract onDestroy(): void;
}