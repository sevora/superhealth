# Superhealth Web Application
This is a standalone web application that does not require connection to a backend or external server in order to do model computations. The models and its processing are all loaded into the client's browser. All the data stays in-device be it inputs or outputs.

## Client-Side Requirements
Currently, the web-application does not cache the model files. Therefore an internet connection is required to retrieve these local models. However, no data involving the user's inputs are sent externally.

## Installation
This project requires the [Node.js](https://nodejs.org/en) runtime. This uses [Vite](https://vite.dev/) for the local development. One may inspect the `package.json` file for available commands:
- Run `npm install` to download all dependencies.
- Run `npm run build` to create a dist or distribution folder with the contents transpiled where a static web server may serve these so the web-application is accesible on the internet.
- Run `npm run dev` to run the development server and access the web-application locally during development.

## Code 
It may be possible to improve the code by refactoring as you will notice that there is a recurring pattern in the organization of each model user interface provided as components.