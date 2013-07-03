;(function(undefined) {
	"use strict";
	
	var ioc = function(){
	
		var bindings = {},
			originalBindings = {};
	
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
		};

		var resolveAfterUse = function(key){
			var val = bindings[key];
			var returnValue;
			if(typeof val === 'function'){
				returnValue = createInstance(val);
			}
			else {
				returnValue = val;
			}
			for(var key in originalBindings){
				bindings[key] = originalBindings[key];
			} 
			originalBindings = {};
			return returnValue;
		};

		var use = function(key, value){
			originalBindings[key] = bindings[key];
			bindings[key] = value;
			return {
				resolve: resolveAfterUse,
				use: use
			};
		};
		
		var bind = function(key){
			return {
				to: function(value){
					bindings[key] = value;
					return {
						asSingleton: function(){
							bindings[key] = createInstance(value);
						}
					}
				},
				toSingleton: function(singleton){
					bindings[key] = createInstance(singleton);
				}
			};
		};
		
		return {
			resolve: resolve,
			bind: bind,
			isBound: isBound,
			use: use
		};
	};
	
	// register for AMD module
	if (typeof define === 'function' && define.amd) {
	    define("subsumer", ioc);
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
		window['subsumer'] = ioc;
	}
 	
})();