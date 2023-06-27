# Appolo-Engine
[![Build Status](https://travis-ci.org/shmoop207/appolo-engine.svg?branch=master)](https://travis-ci.org/shmoop207/appolo-engine) [![Dependencies status](https://david-dm.org/shmoop207/appolo-engine.svg)](https://david-dm.org/shmoop207/appolo-engine) [![NPM version](https://badge.fury.io/js/appolo-engine.svg)](https://badge.fury.io/js/appolo-engine)  [![npm Downloads](https://img.shields.io/npm/dm/appolo-engine.svg?style=flat)](https://www.npmjs.com/package/appolo-engine)
[![Known Vulnerabilities](https://snyk.io/test/github/shmoop207/appolo-engine/badge.svg)](https://snyk.io/test/github/shmoop207/appolo-engine)
  
  ![appolo](https://www.dropbox.com/s/pwdvd6ohb74t7r7/appollo.png?raw=1)

Appolo  is an light web server MVC Framework for Node.js written in Typescript<br>
Appolo architecture follows common patten of MVC and dependency injection which makes it easy to build better performance, flexibility and easy maintenance server side in nodejs.


## Features
 * Super fast
 * MVC Architecture
 * Dependency injection
 * Routes validation
 * Modules system
 * Manage easily configurations and environments
 * Simple folder structures
 * Easy to get started

## Installation
```javascript
npm install appolo-engine --save
```
## Typescript
`appolo` requires TypeScript compiler version > 2.1 and the following settings in `tsconfig.json`:
```javascript
{
	"experimentalDecorators": true
}
```
## Quick Start
In your app.js file:
```javascript
var {createApp}  from 'appolo-engine';
createApp().launch();
```



## Directory Structure
 Appolo will require all files in the `config` and `src` folders, but the `env` folder will be loaded first. All other folders are optional
```javascript
|- config
    |- env
        |- all.ts
        |- development.ts
        |- production.ts

	|- modules
	    |- all.ts
|- src
    |- controllers
    |- managers
    |- services
    |- bootstrap.ts
    |- app.ts
  ```

## Configuration
appolo launch configuration options, all options are optional

| key | Description | Type | Default
| --- | --- | --- | --- |
| `paths` | folders that will be required and loaded on appolo launch | `array`|  `[ 'src']`| | `root` | the root folder of the paths option | `string` | `process.cwd()` |
| `environment` | environment file name that will override the settings in `environments/all.js` | `string` | `(process.env.NODE_ENV || 'development')` |

#### usage example:
```javascript
import {createApp}  from 'appolo-engine';
(async ()=>{
    let app = await createApp({
        paths:[ 'src'],
        root : process.cwd()+'/app',
        environment : 'testing'
     }).launch();
 })();
```

## Environments
With environments you can define different configurations depending on the environment type your app is currently running.
It is recommended to have 4 types of environments: `development`, `testing`, `staging`, `production`.
After `appolo.launch` you can always access the current environment vars via `appolo.environment`.
```javascript
//all.ts
export = {
  name:'all',
  someVar:'someVar'
}
//development.ts
export = {
  name:'develpment',
  db:'mongo://development-url'
}
//development.ts
export = {
  name:'testing',
  db:'mongo://testing-url'
}

```
If we launch our app.js with `NODE_ENV = testing`
```javascript
import {createApp}  from 'appolo-engine';
...
let app = await createApp().launch();
var env = appolo.env;
console.log(env.name,env.someVar,env.db) // 'testing someVar monog:://testing-url'
```


## Dependency Injection System
Appolo has a powerful [Dependency Injection][22] system based on [appolo-inject](https://github.com/shmoop207/appolo-inject).
It enables you to write organised, testable code based on the [loose coupling][24] idea.
You can always access the injector via `app.injector`.

### class decorators
- `define` - make the object injectable
 - [`singleton`](https://github.com/shmoop207/appolo-inject#singleton) - the class will be created only once and the injector will return the same instance every time
 - `lazy` - wait for the class to be injected before creating it
 - [`alias`](https://github.com/shmoop207/appolo-inject#alias) - add alias name to the object (allows injecting multiple objects which share an alias using `injectAlias`)
 - [`aliasFactory`](https://github.com/shmoop207/appolo-inject#alias-factory) - add alias factory name to the object (allows injecting multiple objects which share an alias using `injectAliasFactory`)
### methods decorators
- [`initMethod`](https://github.com/shmoop207/appolo-inject#init-method) - The method will be called after all instances were created and all the properties injected.
 ### property decorators
- [`inject`](https://github.com/shmoop207/appolo-inject#inject-property-instance) - inject instance reference by id
 - [`injectFactoryMethod`](https://github.com/shmoop207/appolo-inject#inject-factory-method) - factory method is a function that will return the injected object. This is useful to create many instances of the same class.
 - [`injectAlias`](https://github.com/shmoop207/appolo-inject#alias) - inject objects by alias name
 - [`injectArray`](https://github.com/shmoop207/appolo-inject#inject-property-array) - inject array of properties by reference or by value
 - [`injectDictionary`](https://github.com/shmoop207/appolo-inject#inject-property-dictionary) - inject a dictionary of properties by reference or by value.
 - [`injectAliasFactory`](https://github.com/shmoop207/appolo-inject#alias-factory) - inject factory methods by alias name
 - [`injectFactory`](https://github.com/shmoop207/appolo-inject#inject-property-from-factory-object) inject object by factory class
 - [`injectObjectProperty`](https://github.com/shmoop207/appolo-inject#inject-property-from-object-property) inject property of another object
 - [`injectValue`](https://github.com/shmoop207/appolo-inject#inject-property-value) inject property by value
###  method parameter decorators
 - `injectParam` - inject object by parameter
```javascript
//dataRemoteManager.ts
import {define,singleton,initMethod,inject,IFactory,factory} from 'appolo-engine';
@define()
@singleton()
export class DataRemoteManager {
    getData(){ ...}
}
//dataManager.ts
@define()
@singleton()
@factory()
export class DataManager implement IFactory {
    @inject() dataRemoteManager:DataRemoteManager

    get(){
        return this.dataRemoteManager;
    }
}
//fooController.ts
@controller()
export class FooController{
    @inject() dataManager:DataManager
    constructor() {
        this.data = null
    }

    @initMethod()
    initialize(){
        this.data =  this.dataManager.getData();
    }

    @get("/data")
    getData(){
        return this.data;
    }
}
```
You can also use constructor injection or method parameter injection:
```javascript
import {define,singleton,injectParam,initMethod,inject} from 'appolo';
@define()
@singleton()
export class DataManager {
    getData(){ ... }
}
@define()
class FooController{
    constructor(@injectParam() dataManager:DataManager) {
        this.dataManager = dataManager;
    }

    @initMethod()
    public initialize(){
        this.data =  this.dataManager.getData();
    }

    public test(@injectParam() logger:Logger){... }
}
```

### Inherited injections
Inherited injections are supported as well.
Anything you inject on a base class will be available to child classes.
Remember not to use `@define` on the parent class.
```javascript
import {define,singleton,injectParam,initMethod,inject} from 'appolo-engine';

export class BaseManager {
    @inject() protected env:any
    private getData(){...}
}

@define()
class FooManager extends BaseManager{
    @initMethod()
    public initialize(){
        //the env object in injected from the base class
        console.log(this.env.test)
    }
}
```
## Event Dispatcher
Appolo has a built-in event dispatcher to enable classes to listen to and fire events.
Event Dispatcher has the following methods:

```javascript
import {define,singleton,injectParam,initMethod,inject,EventDispatcher} from 'appolo-engine';
@define()
@singleton()
export class FooManager extends EventDispatcher{
    public notifyUsers(){
        this.fireEvent('someEventName',{someData:'someData'})
    }
}
@define()
export class FooController {
    @inject() fooManager:FooManager;
    @initMethod()
    public initialize(){
        this.fooManager.on('someEventName',(data)=>{
            this.doSomething(data.someData)
        },this);
    }
    doSomething(data){...}
}
```


## Modules
Third party modules can be easily loaded intto appolo inject and used in the inject container.
Each module must call `appolo.module` before it can be used by `appolo launcher`.
`appolo.module` accepts a function as an argument. The last argument to that function must be the `next` function: modules are loaded serially, so each module must call the `next` function or return a `promise` in order to continue the launch process.
Other arguments to the function are object which you wish to inject into the module (these objects must be injected earlier).

By default, each module can inject:

 - `env` - environment object,
 - `inject` - injector  - to add objects to the injector,

Module example:
```javascript
import {App} from 'appolo-engine';
export = async function(app:App){
    await app.module(async function(env:any,inject:appolo.Injector){
        let myModuleObject = {data:'test'};
        await toSomeThing();
        inject.addObject('myModuleObject',myModuleObject);
    });
}
```
Now we can inject `myModuleObject` to any class:
```javascript
import {define,singleton,initMethod,inject} from 'appolo';
@define()
export  class AuthMiddleware{
    @inject('myModuleObject') testObject:any
    public doSomeThing() {
        return this.testObject.data; //return 'test'
    }
}
```

### Logger module example
A logger module example with [winston][19]

loggerModule.js file:
```javascript
import winston = require('winston');
import {App} from 'appolo-engine';
export = async function(app:App){
    await appolo.module(async function(env:any,inject:appolo.Injector){
        transports = [];
        transports.push(new (winston.transports.Console)({
            json: false,
            timestamp: true
        })
    });
    let logger = new (winston.Logger)({  transports: transports});
    inject.addObject('logger', logger);});
```
Now we you inject logger anywhere we need it:
```javascript
import {define,singleton,initMethod,inject} from 'appolo-engine';
@define()
export class DataManager{
    @inject() logger:Logger
    public initialize(){
        this.logger.info("dataManager initialized",{someData:'someData'})
    }
}
```

## Bootstrap

Once it launched, appolo will try to find an appolo `bootstrap` class and call it's `run` method. Only when the bootstrap is finished, the server will start
```javascript
import {define,singleton,injectParam,initMethod,inject,bootstrap,IBootstrap} from 'appolo-engine';
@define()
@bootstrap()
export class Bootstrap implements IBootstrap{
    @inject() someManager1:SomeManager1
    public async run(){
        //start your application logic here
        await this.someManager1.doSomeThing();
    }
}

```


## Reset ##
You can reset appolo sever by calling `appolo.reset()`. This will clean all environments, config, injector and close the server.


## Tests ##
```javascript
 grunt test
```

## License ##

The `appolo` library is released under the MIT license. So feel free to modify and distribute it as you wish.


  [1]: http://expressjs.com/
  [2]: https://www.github.com/shmoop207/appolo
  [3]: https://www.github.com/shmoop207/appolo-inject
  [4]: http://expressjs.com/en/resources/middleware.html
  [12]: http://expressjs.com/en/4x/api.html#req
  [13]: http://expressjs.com/en/4x/api.html#res
  [19]: https://github.com/flatiron/winston
  [22]: http://en.wikipedia.org/wiki/Dependency_injection
  [23]: https://github.com/shmoop207/appolo-inject
  [24]: http://en.wikipedia.org/wiki/Loose_coupling
