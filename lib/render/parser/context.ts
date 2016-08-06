export class ContextReference {
    constructor(public context: any) { }
}

export class ContextTree {
    private _tree: ContextReference[][] = [];

    constructor(context?: any | any[]) {
        if (context) {
            this.add(context);
        }
    }

    public up() {
        this._tree.shift();
        if (!this._tree.length) {
            this.down();
        }
    }

    public down() {
        this._tree.unshift([]);
    }

    public add(context: any | any[]) {
        if (Array.isArray(context)) {
            context.map((context: any) => this.add(context));
        } else {
            if (!this._tree.length) {
                this.down();
            }
            this._tree[0].push(new ContextReference(context));
        }
    }

    getUnfiltered() {
        return this._tree.slice(0);
    }

    getFiltered() {
        return this._tree.slice(0).filter(list => !!(Array.isArray(list) && list.length));
    }

    getNearestContextOfType(type: Function | string) {
        for (let i = 0, max = this._tree.length; i < max; i++) {
            let list = this._tree[i];
            for (let j = 0, max = list.length; j < max; j++) {
                let context = list[j].context;
                if (
                        (typeof type === 'string' && typeof context === type)
                    ||  (typeof type === 'function' && context instanceof type)
                ) {
                    return context;
                }
            }
        }
        return null;
    }

}