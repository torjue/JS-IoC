/*! subsumer - v0.5.0 - 2013-07-09 - http://torjue.mit-license.org */
(function(undefined) {
	"use strict";
	
	var ioc = function(){
	
		var bindings = {},
			originalBindings = {},
			getParamNames,
			getDependenciesFor,
			createInstance,
			isBound,
			resolve,
			afterUse,
			instantiate,
			use,
			bind;
	
		getParamNames = function(fn){
			var fnString = fn.toString();
			return fnString.match(/\(.*?\)/)[0]
					.replace(/[()]/gi,'')
					.replace(/\s/gi,'')
					.split(',');
		};
	
		getDependenciesFor = function(fn){
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
		
		createInstance = function(fn){
			var args = getDependenciesFor(fn);
			return new (Function.prototype.bind.apply(fn, args))();
		};
				
		isBound = function(key) {
			return key in bindings;
		};
		
		resolve = function(key){
			var val = bindings[key];
			if(typeof val === 'function'){
				return createInstance(val);
			}
			else {
				return val;
			}
		};

		afterUse = function(fn, key){
			var returnValue = fn(key);
			for(var k in originalBindings){
				if (originalBindings.hasOwnProperty(k)) {
					bindings[k] = originalBindings[k];
				}
			} 
			originalBindings = {};
			return returnValue;
		};

		instantiate = function(fn){
			if(typeof fn === 'function'){
				return createInstance(fn);
			}
			else {
				return fn;
			}
		};

		use = function(key, value){
			originalBindings[key] = bindings[key];
			bindings[key] = value;
			return {
				resolve: function(key){ return afterUse(resolve, key); },
				instantiate: function(fn){ return afterUse(instantiate, fn); },
				use: use
			};
		};
		
		bind = function(key){
			return {
				to: function(value){
					bindings[key] = value;
					return {
						asSingleton: function(){
							bindings[key] = createInstance(value);
						},
						asFunction: function(){
							bindings[key] = function(){ return value; };
						}
					};
				},
				toSingleton: function(singleton){
					bindings[key] = createInstance(singleton);
				},
				toFunction: function(fn){
					bindings[key] = function(){ return fn; };
				}
			};
		};
		
		return {
			resolve: resolve,
			bind: bind,
			isBound: isBound,
			use: use,
			instantiate: instantiate
		};
	};
	
	/* global exports:true, window:true, module:true, define:true */
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
		window.subsumer = ioc;
	}
	/* global exports:false, window:false, module:false, define:false */
})();