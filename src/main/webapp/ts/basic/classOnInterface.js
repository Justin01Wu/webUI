var com;
(function (com) {
    var justa999;
    (function (justa999) {
        var person;
        (function (person) {
            // create a class from an interface
            class Customer2 {
            }
            person.Customer2 = Customer2;
        })(person = justa999.person || (justa999.person = {}));
    })(justa999 = com.justa999 || (com.justa999 = {}));
})(com || (com = {}));
/// <reference path = "classOnInterface.ts" />
// const c2 = new Customer2();  this will get compile error because Customer2 is abstract
// so you have to use this way:
const c2 = {
    firstName: 'Justin',
    lastName: 'Wu',
    middleName: 'sdsds',
    sayHi() { return "hi," + this.firstName; }
};
console.log("c2: ===============");
console.log(c2.firstName);
console.log(c2.lastName);
class Customer3 extends com.justa999.person.Customer2 {
    constructor() {
        super(...arguments);
        this.firstName = 'Tom'; // default value for instance variable
        this.lastName = 'Hanks';
        this.middleName = 'sdsds';
    }
    sayHi() { return "hi," + this.firstName; }
}
const c3 = new Customer3();
console.log("c3: ============");
console.log(c3.firstName);
console.log(c3.lastName);
