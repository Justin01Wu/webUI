/// <reference path = "variableOnInterface.ts" />
// create a variable directly from an interface
const customer = {
    firstName: 'Tom',
    lastName: 'Hanks',
    middleName: 'sdsds',
    sayHi: () => { return 'Hi there:' + this.firstname; }
};
console.log("Customer Object ");
console.log(customer.firstName);
console.log(customer.lastName);
console.log(customer.sayHi());
const employee = {
    firstName: "Jim",
    lastName: "Blakes",
    sayHi: () => { return "Hello!!!"; }
};
console.log("Employee  Object ");
console.log(employee.firstName);
console.log(employee.lastName);
