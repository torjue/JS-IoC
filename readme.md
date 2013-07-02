# JS IoC 

    var Ioc = require("./ioc");

    var ioc = new Ioc();

	var Person = function(weapon, singleton, name){
		this.name = name;
		this.weapon = weapon;
		this.singleton = singleton;
	};
	
	var Weapon = function(){
		this.name = "Sword";
	};
	
	
	var Singleton = function(){
		this.name = "Singleton";
	};
	
	ioc.bind("name").to("Normann");
	ioc.bind("person").to(Person);
	ioc.bind("weapon").to(Weapon);
	ioc.bind("singleton").toSingleton(Singleton);
	
	var person = ioc.resolve("person");
	
	

Add the following to survive minification:

	var Person = function(weapon, singleton, name){
		this.name = name;
		this.weapon = weapon;
		this.singleton = singleton;
	};
	Person.$inject = ['weapon', 'singleton', 'name'];