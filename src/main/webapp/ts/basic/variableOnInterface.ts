interface IPerson {
   firstName: string;
   lastName: string;
   sayHi: () => string;
}

interface IPerson2 extends IPerson {
   middleName: string;
}

// create a variable directly from an interface
const customer: IPerson2 = {
   firstName: 'Tom',
   lastName: 'Hanks',
   middleName: 'sdsds',
   sayHi: (): string => { return 'Hi there:' + this.firstname; }
};

console.log("Customer Object ");
console.log(customer.firstName);
console.log(customer.lastName);
console.log(customer.sayHi());

const employee: IPerson = {
   firstName: "Jim",
   lastName: "Blakes",
   sayHi: (): string => { return "Hello!!!" }
};

console.log("Employee  Object ");
console.log(employee.firstName);
console.log(employee.lastName);