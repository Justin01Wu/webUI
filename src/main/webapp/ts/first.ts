// this is my first type script code 


/**

	Student class implements Person interface
*/
class Student implements Person{
    fullName: string;
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

/**
	my interface 
*/
interface Person {
    firstName: string;
    lastName: string;
}

// function to use interface
function greeter(person : Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

console.log( greeter(user) );