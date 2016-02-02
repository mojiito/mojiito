import { CoreObject, Meta } from '../core/core';

export class Mojito {
    public Meta: Function;
    public Object: Function;
    
    constructor() {
        this.Meta = Meta;
        this.Object = CoreObject;
    }

    upperCaseTest(x: string) {
        return x.toUpperCase();
    }
}
window.Mojito = new Mojito();