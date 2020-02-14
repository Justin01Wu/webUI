interface IPerson {
   firstName: string;
   lastName: string;  // mandatory field, implementation must have it	       
	birthDate?: Date;   // this field is optional because that question mark
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