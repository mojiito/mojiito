import { Meta, get, set } from '../../core';
import { Application, singleton } from '../../runtime';
import { assert } from '../../debug';


@singleton
export class Mojito {
    
    private static GLOBAL_NAMESPACE = 'Mojito';
    
    constructor() {
        
        let instance:Mojito = get(self, Mojito.GLOBAL_NAMESPACE);
        if (!instance) {
            instance = this;
            set(self, Mojito.GLOBAL_NAMESPACE, instance);
        }
        
    }
    
    registerApplication(application: Application): Application {
        assert(arguments.length === 1, 'registerApplication must be called with one argument: an application instance');
        assert(application instanceof Application, 'The argument provided to the registerApplication method must be an application instance', TypeError);
        
        return Meta.peek(this).setProperty('applications', application.name, application);
    }
    
    getApplication(applicationName: string): Application {
        assert(arguments.length === 1, 'getApplication must be called with one argument: an application name');
        assert(typeof applicationName === 'string', 'The applicationName provided to the getApplication method must be a string', TypeError);
        
        return Meta.peek(this).getProperty('applications', applicationName);
    }
    
    getApplications() {
       return Meta.peek(this).getMember('applications');
    }
    
    static getInstance():Mojito {
        return get(Mojito, 'instance');
    }
}
