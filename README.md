![U-ASK](./logo.svg)
# U-ASK Web Application
This repository contains web application of the [U-ASK](https://github.com/u-ask/uask#readme) system. Before going further with this setup guide be sure to have been through [U-ASK](https://github.com/u-ask/uask#readme) introduction and demo.

_*Note:*_ npm scripts needs bash ; please [configure git bash](https://stackoverflow.com/questions/23243353/how-to-set-shell-for-npm-run-scripts-in-windows) as script shell for npm on Windows.

# Install the application
```
git clone https://github.com/u-ask/uask-sys.git
```

## Application configuration

| variable            | description                                    | example 
|:------------------  |:-----------------------------------------------|:-------
| APP_ENV             | the execution environment                      | `production`
| PORT                | the port to listen to                          | `8080`
| VUE_APP_API_URL     | the public URL of uask managment system server | `https://uask-api.example.com`
| VUE_APP_AUTH_URL    | the public URL of the authentication service   | `https://uask-api.example.com/oidc`
| VUE_APP_CB_ROOT_URL | the URL of the open id callback                | `https://uask.example.com/callback`

## Build the application
```
npm run build
```
This will create a `dist` directory that conatins a static single page application.
:web

# Serve the application
```
npm run start
```

# How to use
Once the server is started, navigate to the application home page. Sign up or sign in.

Click the `NEW SURVEY` button, in the dialog enter a name. Click the new survey name on the left column of the seurvey list.

In order to modify the survey, the developer role is needed. In the right side of the main menu, click on `Administration -> Users` link. Change the role corresponding to the connected user. Log out and log in again to gain the new privileges.

A test sample with a test participant have been created. Open the participant by clicking the `Data` button.

At the top right of the screen, click on the user menu (the one with an icon representing a person). Toggle studio mode. Modify the forms to customize the survey.

Refer to the following documentations:
 -[U-ASK Domain Model]((https://github.com/u-ask/uask-dom#readme) about surveys structure and workflows setup.
 -[U-ASK Management System]((https://github.com/u-ask/uask-dom#readme) about the recommended way to manage surveys development life cycle.

