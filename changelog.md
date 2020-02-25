# Prod
### 2020-02-20: Angular 9 install
1. Pulled dev changes
- `sudo npm install -g npm@latest`: update latest version of node from 6.4.1 to 6.13.7
- `sudo npm install n -g`: install n to update node
- `sudo n stable`: update node from 10.12 to 12.16.0
- `ng update @angular/core@8 @angular/cli@8 --create-commits` : make sure v. 8 at latest
- `ng update @angular/cli @angular/core --create-commits`: install v. 9

- `ng update @angular/material --force` // already up to date
- `ng update @nguniversal/express-engine`
- `ng update` --> `ng update rxjs`
- `npm uninstall webpack-cli`
- `npm install`
- `npm audit fix`
- ```
rm -rf node_modules
npm install
```


### v 0.3: 2020-02-12
1. Pulled all changes from [dev](https://github.com/cvisb/cvisb_data/pull/39).
2. ran `npm install` to update packages (and install FortAwesome Module)
3. schema rebuilt
4. Sync'd public/private ES indices

### v 0.2: 2019-11-15
- temp fix: in Biothings package, modify POST arguments to .pop `version` from query_kwargs in `ne ~/cvisb/pyenv/lib/python3.5/site-packages/biothings/web/api/es/query.py`
1. Pulled all changes from [dev](https://github.com/cvisb/cvisb_data/pull/17).
2.  updated all packages; migrated to Angular 8:
```
ng update --all --force
ng update // check; nothing to update. Note: some packages have been updated with minor version changes since I updated the dev server.
npm audit fix // fix 2 security vulnerabilities
npm install typescript@">=3.4.0 <3.5.0" --save-dev --save-exact // downgrade to TS 3.4.5; incompatible with Angular 8 compiler
```
3. Temporary fix, to allow Biothings POST methodology to work properly:
```
vim  ~/cvisb/pyenv/lib/python3.5/site-packages/biothings/web/api/es/query.py
        line :query_kwargs.pop('version')     #####TEMP FIX 20191114 by Chunlei Wu
```

4. Restarted Tornado: `./restart_tornado`
5. Cleared:
- `/dataset`
- `/datadownload`
- `/experiment`
6. Uploaded new versions of:
- `/datacatalog`
- HLA, Ebola Virus Seq, Lassa Virus Seq, Systems Serology `/dataset`
- HLA, Ebola Virus Seq, Lassa Virus Seq `/datadownload`
- HLA, Ebola Virus Seq, Lassa Virus Seq, Systems Serology `/experiment`
- Ebola Virus Seq `/patient`


### v 0.1: 2019-09-13
- created version 0.1 with Angular 6.1.10

### 2019-06-05
- schema rebuilt (v. 0.1 for all)
- python requirements updated to include pyparsing
- updated to latest version of Biothings, which includes nested facets
- auth list updated
- dev merged to master
- all indices wiped and recreated

# Dev
### 2020-02-18: Angular 9 install
1. cleaned up a few random things
- Added json import to `tsconfig.json`
- Updated material modules to direct import the specific mod
- Added `import '@angular/compiler'` to `main.ts`
- remove hammer.js from package
- remove import  'hammerjs' calls
- removed `entryComponents` import
- removed `ModuleMapLoaderModule` from `sample-viewer/src/app/app.server.module.ts`
- Forced a few d3-geo-projections typing conflicts that Angular 8 was okay with: `let minLon = d3.geoBounds(gin as any)[0][0]`
- `sudo npm install -g npm@latest`: update latest version of node from 6.4.1 to 6.13.7
- `npm install`
- `npm audit fix`
- `sudo npm install n -g`: install n to update node
- `sudo n stable`: update node from 10.12 to 12.16.0
- `ng update @angular/core@8 @angular/cli@8 --create-commits` : make sure v. 8 at latest
- `ng update @angular/cli @angular/core --create-commits`: install v. 9
- `ng update @angular/material --force`
- `ng update @nguniversal/express-engine`
- `ng update` --> `ng update rxjs`
- `npm uninstall webpack-cli`
- ```
rm -rf node_modules
npm install
```
- for some reason to get SSR to compile, had to move `server.ts` from the root directory to inside `/src` and update the references to that file in `angular.json`
- new SSR error: "refused to set unsafe header cookie" via https://github.com/angular/angular/issues/15730#issuecomment-572992686 (XHR2 bypass)
- committed, pushed to GH, pulled locally.
- on average, .js bundles decreased by ~9%. looks like a big portion may be due to cross-use of modules; getting thrown into main.js since they have to be re-used. not sure if that can be worked around.

### 2019-12-09
- installed Angular FontAwesome module

### 2019-11-14
- temp fix: in Biothings package, modify POST arguments to .pop `version` from query_kwargs in `ne ~/cvisb/pyenv/lib/python3.5/site-packages/biothings/web/api/es/query.py`
- schema rebuilt, auth list updated.

### 2019-10-23/24
- Upgraded to Angular 8 and updated all packages (from package.json)
```
rm package-lock.json
npm install
npm audit fix
npm uninstall @angular-devkit/build-angular
npm install @angular-devkit/build-angular

ng update --all --force // to get Angular Universal updated
downgrade to typescript 3.4.5: npm install typescript@">=3.4.0 <3.5.0" --save-dev --save-exact

After syncing dev/local versions, did a final removal of package-lock.json and npm install on both sides
```

### 2019-06-05
- schema rebuilt
- auth list updated

# Local

2020-02-13+
- Upgraded to Angular 9, updated all packages.
- followed https://update.angular.io/#8.0:9.0l3
1. updated all Material import calls
- remove hammer.js from package
- remove import  'hammerjs' calls
```
ng update @angular/core@8 @angular/cli@8 --create-commits
ng update @angular/cli @angular/core --create-commits
```

```
ng update @angular/material --force
ng update @nguniversal/express-engine
ng update --> ng update rxjs
```
```
rm -rf node_modules
npm install
```

If you depend on many Angular libraries you may consider speeding up your build by invoking the ngcc (Angular Compatibility Compiler) in an npm postinstall script via small change to your package.json.
If you have specified any entryComponents in your NgModules or had any uses of ANALYZE_FOR_ENTRY_COMPONENTS, you can remove them. They are no longer required with the Ivy compiler and runtime.

Some notes on the Angular 9 problems:
* Had to import Material modules individually; Angular CLI was supposed to do automatically, but that didn't happen.
```
core.js:5845 ERROR Error: Uncaught (in promise): TypeError: Cannot read property 'ngModule' of undefined
TypeError: Cannot read property 'ngModule' of undefined
    at isModuleWithProviders
```
* In `main.ts`:
```
import '@angular/compiler';
```
https://stackoverflow.com/questions/60183056/ionic-5-with-angular-9-angular-jit-compilation-failed-angular-compiler-not
```
error TS2306: File '/Users/laurahughes/GitHub/cvisb_data/sample-viewer/node_modules/@angular/material/index.d.ts' is not a module.

8 import { MatExpansionModule } from '@angular/material/';
```
* Had to force a few d3-geo-projections typing conflicts that Angular 8 was okay with.
```
let minLon = d3.geoBounds(gin as any)[0][0],
```
* In `tsconfig.json`:
```
"compilerOptions": {
  "resolveJsonModule": true,
}
```
https://mariusschulz.com/blog/importing-json-modules-in-typescript
```
ERROR
Cannot find module '../../assets/geo/naturalearth_africa.json'. Consider using '--resolveJsonModule' to import module with '.json' extension
```


### 2019-10-23
- Upgraded to Angular 8 and updated all packages (from package.json)
```
rm package-lock.json
npm install
npm audit fix
npm uninstall @angular-devkit/build-angular
npm install @angular-devkit/build-angular

ng update --all --force // to get Angular Universal updated
downgrade to typescript 3.4.5: npm install typescript@">=3.4.0 <3.5.0" --save-dev --save-exact
// Not necessary to do on dev...
Changing from "@angular-devkit/build-angular": "^0.802.1"
to "@angular-devkit/build-angular": "^0.13.9",
https://github.com/akveo/ngx-admin/issues/2138#issuecomment-522264613
npm install
npm install --save core-js@^2.5.0 https://stackoverflow.com/questions/55398923/error-cant-resolve-core-js-es7-reflect-in-node-modules-angular-devkit-bui

```
