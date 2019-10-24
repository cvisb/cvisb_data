# Prod
### 2019-06-05
- schema rebuilt (v. 0.1 for all)
- python requirements updated to include pyparsing
- updated to latest version of Biothings, which includes nested facets
- auth list updated
- dev merged to master
- all indices wiped and recreated

# Dev
### 2019-10-23/24
- Upgraded to Angular 8 and updated all packages (from package.json)
```
rm package-lock.json
npm install
npm audit fix
npm uninstall @angular-devkit/build-angular
npm install @angular-devkit/build-angular

ng update --all --force // to get Angular Universal updated
Changing from "@angular-devkit/build-angular": "^0.802.1"
to "@angular-devkit/build-angular": "^0.13.9",
https://github.com/akveo/ngx-admin/issues/2138#issuecomment-522264613
npm install
npm install --save core-js@^2.5.0 https://stackoverflow.com/questions/55398923/error-cant-resolve-core-js-es7-reflect-in-node-modules-angular-devkit-bui
downgrade to typescript 3.4.5: npm install typescript@">=3.4.0 <3.5.0" --save-dev --save-exact
```

### 2019-06-05
- schema rebuilt
- auth list updated

# Local
### 2019-10-23
- Upgraded to Angular 8 and updated all packages (from package.json)
```
rm package-lock.json
npm install
npm audit fix
npm uninstall @angular-devkit/build-angular
npm install @angular-devkit/build-angular

ng update --all --force // to get Angular Universal updated
Changing from "@angular-devkit/build-angular": "^0.802.1"
to "@angular-devkit/build-angular": "^0.13.9",
https://github.com/akveo/ngx-admin/issues/2138#issuecomment-522264613
npm install
npm install --save core-js@^2.5.0 https://stackoverflow.com/questions/55398923/error-cant-resolve-core-js-es7-reflect-in-node-modules-angular-devkit-bui
downgrade to typescript 3.4.5: npm install typescript@">=3.4.0 <3.5.0" --save-dev --save-exact
```
