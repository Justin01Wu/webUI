# Angular learning

## Environment

+ Of course, you need NodeJs and angular CLI
+ Then install Angular Cli:
```shell
    npm install -g @angular/cli
```
+ verif your installation: `ng --version`

## build and run in the command

+ create a brand new project: `ng new abc`
+ Angular CLI will automatically commit your code into local GIT repo.
+ run this project: go to project folder abc then run `ng serve`
+ By default, Angular will use port 4200, so open browser at localhost:4200
+ Angular completely based on component, so you can use this command to add a new component: `ng generate component xyz`
+ Adding new component into your app:
	+ find your root component template(app.component.html)
	+ you can append this on it: `<app-xyz></app-xyz>`
	+ restart the server: `ng serve`
	+ Now you can see you new component on the bottom of your home page
+ In your demo application, it will show you some popular CLI command like how to add a new component...

## build and run in the IDE


