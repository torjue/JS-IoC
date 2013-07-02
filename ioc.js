;(function(undefined) {
	"use strict";
	
	var ioc = function(){
	
		var bindings = {};
	
		var getParamNames = function(fn){
		    var fnString = fn.toString();
		    return fnString.match(/\(.*?\)/)[0]
		    		.replace(/[()]/gi,'')
		    		.replace(/\s/gi,'')
		    		.split(',');
		};
	
		var getDependenciesFor = function(fn){
			var params = fn.$inject === undefined ? getParamNames(fn): fn.$inject;
			var args = [null];	
			for (var i=0; i<params.length; i++) {
				var match = resolve(params[i]);
				if (!!match) {
					args.push(match);
				}
				else {
					args.push(undefined);
				}
			}
			return args;
		};
		
		var createInstance = function(fn){
			var args = getDependenciesFor(fn);
			return new (Function.prototype.bind.apply(fn, args));
		};
				
		var isBound = function(key) {
			return key in bindings;
		};
		
		var resolve = function(key){
			var val = bindings[key];
			if(typeof val === 'function'){
				return createInstance(val);
			}
			else {
				return val;
			}
		}
		
		var bind = function(key){
			return {
				to: function(value){
					bindings[key] = value;
				},
				toSingleton: function(singleton){
					bindings[key] = createInstance(singleton);
				}
			};
		}
		
		return {
			resolve: resolve,
			bind: bind,
			isBound: isBound
		};
	};
	
	// register for AMD module
	if (typeof define === 'function' && define.amd) {
	    define("ioc", ioc);
	}

	// export for node.js
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = ioc;
		}
		exports = ioc;
	}
	
	// browser
	if (typeof window !== 'undefined') {
		window['ioc'] = ioc;
	}
 	
})();