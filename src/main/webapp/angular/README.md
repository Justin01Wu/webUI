# Angular learning

## Environment

+ Of course, you need NodeJs and angular CLI
+ Install Angular Cli: `npm install -g @angular/cli`
+ verif your installation: `ng --version`

## Build and run in the command

+ create a brand new project: `ng new abc`
+ Angular CLI will automatically commit your code into local GIT repo.
+ run this project: go to project folder abc then run `ng serve`
+ By default, Angular will use port 4200, so open browser at localhost:4200
+ Angular completely based on component, this command will add a new component: `ng generate component xyz`
+ It will create a folder xyz under app folder
+ Link new component into your app:
	+ Find your root component template(app.component.html)
	+ Append this on it: `<app-xyz></app-xyz>`
	+ Restart the server: `ng serve`
	+ Now you can see you new component on the bottom of your home page
+ In your demo application, it will show you some popular CLI command like how to add a new component...

## Build and run in the IDE


