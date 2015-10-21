const ENV = {};

// HTML data attributes
ENV.HTMLDATA_SHORTHAND = false;

ENV.HTMLDATA = function() {
	const HTMLDATA = {};
	
	// global html data namespace
	HTMLDATA.NAMESPACE = ENV.HTMLDATA_SHORTHAND ? ''  : 'mojito-';
	
	// controller data attributes
	HTMLDATA.CONTROLLER_DEF = 	HTMLDATA.NAMESPACE+'controller';
	HTMLDATA.CONTROLLER_ID = 		HTMLDATA.CONTROLLER_DEF+'-id';
	HTMLDATA.CONTROLLER_REF = 	HTMLDATA.CONTROLLER_DEF+'-ref';
	
	// action data attributes
	HTMLDATA.ACTION = 			HTMLDATA.NAMESPACE+'action';
	HTMLDATA.ACTION_ID = 			HTMLDATA.ACTION+'-id';
	HTMLDATA.EVENT = 				HTMLDATA.NAMESPACE+'event';
	
	// params data attributes
	HTMLDATA.PARAMS = 			HTMLDATA.NAMESPACE+'params';
	
	// classbindings data attributes
	HTMLDATA.CLASSBINDING = 		HTMLDATA.NAMESPACE+'bind-class';
	HTMLDATA.CLASSBINDING_ID = 	HTMLDATA.CLASSBINDING+'-id';
	
	// inputbindings data attributes
	HTMLDATA.INPUTBINDING = 		HTMLDATA.NAMESPACE+'bind-input';
	HTMLDATA.INPUTBINDING_ID = 	HTMLDATA.INPUTBINDING+'-id';
	
	// contentbindings data attributes
	HTMLDATA.CONTENTBINDING = 	HTMLDATA.NAMESPACE+'bind-content';
	HTMLDATA.CONTENTBINDING_ID = 	HTMLDATA.CONTENTBINDING+'-id';
	
	return HTMLDATA;
}

// valid events
ENV.EVENTTYPES = "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu";
// default event
ENV.DEFAULT_EVENTTYPE = 'click';

export default ENV;
