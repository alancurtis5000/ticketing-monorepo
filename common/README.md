

## Common repo
This repo is for code shared accross our microservices

## How to publish new version

Make a Change:
Update Github
### `git commit`

Update Version
### `npm version patch`

Build
### `npm run build`

Publish the package
### `npm publish`

////////////////////////

DONT DO IN PRODUCTION:
but for ease of development
### `npm pub`
- this command just run the git add, commit, version patch, build and publish all in one command.

How to install package in another repo:
- go to root of project
- run
- ### `npm install  @acetickets/common@1.0.6`
- `npm install  @acetickets/common@<versionNumber>`

