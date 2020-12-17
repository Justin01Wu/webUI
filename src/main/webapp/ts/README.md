# TypeScript learning

## Environment

- Of course, you need NodeJs
- Then install typescript:
```shell
    npm install -g ts-node
    npm install -g typescript
```

## build and run in the command

- TypeScript files have extension ts
- You have to use tsc to comile  a ts file: `tsc abc.ts`, it will generate a js file
- Then run this command: `node abc.js`
- my current tsc version is 3.7.4, by default it will generate target code for es3, you can use this command to see it: `tsc --help`
- You can use this command to change it: `tsc --target es6 abc.ts`
- You can also set it in tsconfig.json in your project root folder

## build and run in the IDE

- popular IDE for typescript is VisualStudio Code because it is free
- You can directly drag and drop your test ts file into VisualStudio Code project for quick testing
- VisualStudio Code can do similar function of Eclipse refactoring, like rename a method in whole project scope

## typescript language 
+ It is similar like Java rather than Javascript
+ It has abstract class concept
```typescript
	abstract class Customer2 implements IPerson2 {   
		abstract sayHi(): string;
	}
```
+ It has Interface
```typescript
	interface IPerson { 
	   firstName:string, 
	   lastName:string, 
	   sayHi: ()=>string 
	} 
```	
+ It has generic
```typescript
    class Post<T> {
        content: T;
    }
```	

+ It has extension and implementation: `class Customer3 extends Customer2 implements Custom {...}`
+ It has private attributes
+ It has decorators (roughly comparable to Java's annotations)
+ It support module (depreacted, please use namespace)
```typescript
	module TutorialPoint { 
	   export function add(x, y) {  
	      console.log(x+y); 
	   } 
	}
```
+ It support namespace, similar like Java package
```typescript
	namespace TutorialPoint { 
	   export function add(x, y) { console.log(x + y);} 
	}
```
+ Both module and namespace will be compiled into anonymous function:
```typescript
	var TutorialPoint; 
	(function (TutorialPoint) { 
	   function add(x, y) { 
	      console.log(x + y); 
	   } 
	   TutorialPoint.add = add; 
	})(TutorialPoint || (TutorialPoint = {}));
```

## compare with Java:  https://www.beyondjava.net/comparing-typescript-java
+ It has only one number type, Java has many: int, long, float, double
+ It has **any** type, which is backward compatible for old Javascript code or library. it opens back door for type unsafe:
```typescript
	let notSure: any = 4;
```
+ **any** type is different from Object:
```typescript
	let notSure: any = 4;
	notSure.ifItExists(); // okay, ifItExists might exist at runtime
	notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

	let prettySure: Object = 4;
	prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

+ Type inference also applies to methods, much the way it does in Scala. 
If you don't specify the return type, the compiler checks every return value and determines the common data type:
```typescript
	public multiply(a: number, b: number) {  
	// usually you should define like this public multiply(a: number, b: number): number {
	  return a * b;
	}

	public consumer() {
	  // tooltip shows: "let numeric: number = ..."
	  let numeric = this.multiply(4, 2);

	  // doesn't compile
	  // tooltip shows: "Type 'number' is not assignable to 'string'"
	  let text: string = this.multiply(4, 2);
	}
```
+ Some attributes of an interface can be optional to support dynamic REST response (see question mark below):
```typescript
	interface Person {		
		name: string;       // mandatory field, implementation must have it
		birthDate?: Date;   // this field is optional
	}
```
+ Support Default parameters:
```typescript
	function calculate_discount(price:number,rate:number = 0.50) { 
	   var discount = price * rate; 
	   console.log("Discount Amount: ",discount); 
	} 
	calculate_discount(1000) 
	calculate_discount(1000,0.30)
```
+ Support optional parameters:
```typescript
	function calculate_discount(price:number,rate?:number) { 
	   var discount = price * rate; 
	   console.log("Discount Amount: ",discount); 
	} 
	calculate_discount(1000) 
	calculate_discount(1000,0.30)
```
+ Overload: Typescript doesnt allow for the name-choosing of given parameters based on their type (without explicitly writing the type check yourself)
+ TS used multiple types parameters to replace overload, which is weak
```typescript
	function calculate_discount(price:number|string) { 
	   ...
	} 
	calculate_discount(1000) 
	calculate_discount('1000')
```


## drawbacks
+ JavaScript language is weak for large application: no thread, no type safe, no interface, bad inhertance...
+ TypeScript is compiled into Javascript, based on target ES settings, which is not stable as Java JVM code
+ Need a compiling stage , can only be good for large web application
+ Need to do something to hook source code into target Javascript code when debug in the browser


