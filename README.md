# Linkbus Web App
Web user interface for configuring the Linkbus iOS app and host the Linkbus API.

<div>
  <a href="https://vuejs.org/">
    <img src="https://img.shields.io/badge/Made_with-Vue-blue.svg" alt="LICENSE">
  </a>
  <a href="https://firebase.google.com/">
    <img src="https://img.shields.io/badge/Powered_by-Firebase_🔥-red.svg" alt="LICENSE">
  </a>
  <a href="https://stats.uptimerobot.com/XnOnXhnpn2">
    <img src="https://img.shields.io/uptimerobot/status/m786324991-be97368f7f3b6614eec26594?label=Linkbus%20API" alt="build">
  </a>
  <br>
</div>

## Public environments

| Environment  | Web app | API |
| ----- | ----- | ----- |
| Production | https://config.linkbus.app | [Prod API](https://us-central1-linkbus-website.cloudfunctions.net/api) |
| Staging | https://staging.linkbus.app | [Staging API](https://us-central1-linkbus-website-staging.cloudfunctions.net/api) |
| Development | https://dev.linkbus.app | [Dev API](https://us-central1-linkbus-website-development.cloudfunctions.net/api) |

## Development

### Project setup
```
git clone git@github.com:Linkbus/linkbus-web.git // Clone the repo

cd linkbus-web

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