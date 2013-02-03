var Ioc = require("./ioc");

var ioc = new Ioc();

var Person = function(weapon, singleton, name){
	this.name = name;
	this.weapon = weapon;
	this.singleton = singleton;
};

var Weapon = function(){
	this.name = "Sverd";
};


var Singleton = function(){
	this.name = "Sverd";
};

ioc.bind("name").to("Normann");
ioc.bind("person").to(Person);
ioc.bind("weapon").to(Weapon);
ioc.bind("singleton").toSingleton(Singleton);

var m = ioc.resolve("person");

m.name = "noe annet";
m.weapon.name = "Pistol";
m.singleton.name = "qq";

var x = ioc.resolve("person");

console.log(m);
console.log(x);

x.singleton.name = "aas";

console.log(m);
console.log(x);