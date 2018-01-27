function Character (name, profession, gender, age, strength, hitpoints) {
  this.name = name;
  this.profession = profession;
  this.gender = gender;
  this.age = age;
  this.strength = strength;
  this.hitpoints = hitpoints;
  this.printStats = function() {
    if (this.name === true) {
      console.log(this.Character);
    }
  };
}



var grace = new Character(true, 'executive', 'female', 65, 8, 7);
var frankie = new Character(true, 'artist', 'female', 67, 9, 5 );

frankie.printStats();
grace.printStats();