'use strict';

var grunt = require('grunt');
var Subsumer = require("./../src/subsumer");



/* Define classes */
var Person = function(weapon, singleton, name){
	this.name = name;
	this.weapon = weapon;
	this.singleton = singleton;
};
Person.$inject = ['weapon', 'singleton', 'name']; 

var Weapon = function(){
	this.name = "Sword";
};

var Singleton = function(){
	this.name = "Singleton";
};



exports.subsumer = {

	setUp: function(callback){
		this.container = new Subsumer();
		/* Bind things up */
		this.container.bind("name").to("Normann");
		this.container.bind("person").to(Person);
		this.container.bind("weapon").to(Weapon);
		this.container.bind("singleton").toSingleton(Singleton);
		callback();
	},

	resolve: function(test){
		test.expect(3);
		var instance = this.container.resolve("person");
		test.ok(instance instanceof Person);
		test.equal(instance.weapon.name, "Sword");
		test.equal(instance.singleton.name, "Singleton");
		test.done();
	},

	instantiate: function(test){
		test.expect(3);
		var instance = this.container.instantiate(Person);
		test.ok(instance instanceof Person);
		test.equal(instance.weapon.name, "Sword");
		test.equal(instance.singleton.name, "Singleton");
		test.done();
	},

	use: function(test){
		test.expect(2);
		var instance_WithUse = this.container.use("name", "Jones").instantiate(Person);
		var instance_AfterUse_WithoutUse = this.container.instantiate(Person);
		test.equals(instance_WithUse.name, "Jones");
		test.equals(instance_AfterUse_WithoutUse.name, "Normann");
		test.done();
	},

	toFunction: function(test){
		test.expect(2);
		var fn = function(){
			test.ok(true);
		};
		this.container.bind("function_test").toFunction(fn);
		var resolvedFn = this.container.resolve("function_test");
		test.ok(typeof resolvedFn === 'function');
		resolvedFn();
		test.done();
	},

	'singleton': function(test){
		test.expect(2);
		var firstInstance = this.container.resolve("singleton");
		firstInstance.name = "modified";
		var secondInstance = this.container.resolve("singleton");
		test.equal(secondInstance.name, "modified");
		test.equal(firstInstance, secondInstance);
		test.done();
	}

};