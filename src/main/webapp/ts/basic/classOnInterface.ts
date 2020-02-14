namespace com.justa999.person { 

   export interface IPerson {
      firstName: string;
      lastName: string;
      sayHi: () => string;
   }

   export interface IPerson2 extends IPerson {
      middleName: string;
   }

   // create a class from an interface
   export abstract class Customer2 implements IPerson2 {
      firstName: string;
      middleName: string;
      lastName: string;
      abstract sayHi(): string;
   }
}

/// <reference path = "classOnInterface.ts" />
// const c2 = new Customer2();  this will get compile error because Customer2 is abstract
// so you have to use this way:
const c2: com.justa999.person.Customer2 = {
   firstName: 'Justin',  // instance variable
   lastName: 'Wu',
   middleName: 'sdsds',
   sayHi () {return "hi," + this.firstName; }
};


console.log("c2: ===============");
console.log(c2.firstName);
console.log(c2.lastName);

class Customer3 extends com.justa999.person.Customer2 {
   firstName = 'Tom';  // default value for instance variable
   lastName = 'Hanks';
   middleName  = 'sdsds';
   private birthDate?: Date = new Date();
   sayHi () {return "hi," + this.firstName; };
   get getBirthDate(): Date { return this.birthDate}  // it has 'get' decration
}
const c3 = new Customer3();


console.log("c3: ============");
console.log(c3.firstName);
console.log(c3.lastName);
//console.log(c3.birthDate);   // compile error, because it is private
console.log(c3.getBirthDate);   // it is not a function, can't use () with it
console.log(c3.sayHi());   // 
