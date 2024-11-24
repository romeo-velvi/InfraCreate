# InfraCreate


Sistema innovativo per la progettazione e design di scenari di esercitazione in ambito Cyber Range.


## Info

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.12.

nvm version 12.16.1 
for update/install 12.20.

## Nel caso ci siano problemi:
Inserire in app.component.ts prima delle dichiarazioni di tutto
```
declare module 'rete/types/events' {
  interface EventsTypes {
    arrange: void;
    showcontextmenu: { e: MouseEvent, node: Node };
    undo: void;
    redo: void;
  }
}
```
eseguire `npm i rete-minimap-plugin@0.3.0`

## TEST SETTINGS
Per entrare in modalità:
    - (De)commentare `initializeKeycloak` in utility.app.init.ts 
    - (De)Commentare gli auth guard per
    - assegnare `mocked=false` in environment.ts

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
