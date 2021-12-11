# Linkbus Web App
Web user interface for configuring the Linkbus iOS app and host the Linkbus API.

https://linkbus-website.web.app/

## Development

### Project setup
```
clone git@github.com:Linkbus/linkbus-web.git // Clone the repo

npm install // Install node modules
```

### Start local server
```
npm run serve // Host local server
```

### Build and deploy
```
npm run build // Build distributable package
// Or to build for dev use:  npm run build -- --mode development
firebase login // Login to firebase cli
firebase deploy // Deploy on firebase
// Or deploy only to one service with:  firebase deploy --only hosting
```

## Firebase

### Firebase CLI cheatsheet
List projects `firebase projects:list`

Set active project by ID `firebase use linkbus-website-development`


### Firebase Environments
* linkbus-website
* linkbus-website-staging
* linkbus-website-development