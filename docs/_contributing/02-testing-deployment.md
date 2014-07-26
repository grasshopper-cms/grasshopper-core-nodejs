---
title: Deploy to a test environment
uuid: testing-deployment
---
#### Deploy to a test environment

If you have a heroku account, then you can deploy to it using the `grunt deploy:heroku` command .

##### What you need

* Your development environment should already be setup (see above)
* A ghapi.json file that includes your application configuration at `{proj-root}/ghapi.json`
* Set heroku environment variables (so you don't commit your private info). `
* Publish to heroku `grunt deploy:heroku`

Once the environmental variables are on heroku there is no need to load them again, unless you want to change them.
If you ever need to update your environment variables just re-run `grunt deploy:heroku:setupConfigs`
