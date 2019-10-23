# Prod
### 2019-06-05
- schema rebuilt (v. 0.1 for all)
- python requirements updated to include pyparsing
- updated to latest version of Biothings, which includes nested facets
- auth list updated
- dev merged to master
- all indices wiped and recreated

# Dev
### 2019-10-23
- Upgraded to Angular 8 and updated all packages (from package.json)
```
rm package-lock.json
npm install
npm audit fix
npm uninstall @angular-devkit/build-angular
npm install @angular-devkit/build-angular
rm node_modules // unneeded
npm install // unneeded
```

### 2019-06-05
- schema rebuilt
- auth list updated
