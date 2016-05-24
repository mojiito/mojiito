import { get, set } from '../../core/core';

export class Mojito {
    
    private static GLOBAL_NAMESPACE = 'Mojito';

    constructor() {
        let instance: Mojito = get(self, Mojito.GLOBAL_NAMESPACE);
        if (!instance) {
            instance = this;
            set(self, Mojito.GLOBAL_NAMESPACE, instance);
        }
    }

    static getInstance(): Mojito {
        if (!get(Mojito, '_instance')) {
            
            let instance = new Mojito();
            Object.defineProperty(Mojito, '_instance', {
                writable: false,
                configurable: false,
                enumerable: false,
                value: instance
            });
        }
        return get(Mojito, 'instance');
    }
}
