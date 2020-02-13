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
- you have to use tsc to comile  a ts file: `tsc abc.ts`, it will generate a js file
- Then run this command: `node abc.js`

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




