"use strict";
var view_1 = require('../core/view/view');
function buildView(nativeElement, directive, targetProperties, targetEvents) {
    // skip for now directives and only create components
    if (!directive.isComponent) {
        return;
    }
    // create new injector
    // add custom providers
    // instantiate directive
    // build view for directive
    var view = new view_1.View(view_1.ViewType.COMPONENT, null);
    // apply inputs
    // apply outputs
}
exports.buildView = buildView;
//# sourceMappingURL=view_builder.js.map