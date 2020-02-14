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
- my current tsc version is 3.7.4, by default it will generate target code for es3, you can use this command to see it
```shell
	tsc --help
```
- You can use this command to change it: `tsc --target es6 abs.ts`
- You can also set it in tsconfig.json in your project root folder

## build and run in the IDE

- popular IDE for typescript is VisualStudio Code because it is free
- You can directly drag and drop your test ts file into VisualStudio Code project for quick testing
- VisualStudio Code can do similar function of Eclipse refactoring, like rename a method in whole project scope

## typescript language 
- It is similar like Java rather than Javascript
- It has abstract class concept
```typescript
	abstract class Customer2 implements IPerson2 {   
		abstract sayHi(): string;
	}
```
- It has Interface
- It has generic
- It has extension and implementation
- It hasprivate attributes
- It hasprivate attributes
- It has decorators (roughly comparable to Java's annotations)

## compare with Java:  https://www.beyondjava.net/comparing-typescript-java
- It has only one number type, Java has many: int, long, float, double
- It has **any** type, which is backward compatible for old Javascript code or library. it opens back door for type unsafe:
```typescript
	let notSure: any = 4;
```
- **any** type is different from Object:
```typescript
	let notSure: any = 4;
	notSure.ifItExists(); // okay, ifItExists might exist at runtime
	notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

	let prettySure: Object = 4;
	prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```
- Type inference also applies to methods, much the way it does in Scala. 
If you don't specify the return type, the compiler checks every return value and determines the common data type:
```typescript
	public multiply(a: number, b: number) {  // usually you should define like this public multiply(a: number, b: number): number {
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
- Some attributes of an interface can be optional to support dynamic REST response (see question mark below):
```typescript
	interface Person {		
		name: string;       // mandatory field, implementation must have it
		birthDate?: Date;   // this field is optional
	}
```

