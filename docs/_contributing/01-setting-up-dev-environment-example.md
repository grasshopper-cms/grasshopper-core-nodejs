---
title: Setting up your development environment
uuid: environment-setup-example
language: bash
---

-- Help

-- Setup solution directory structure

mkir grasshopper
cd grasshopper
git clone git@github.com:Solid-Interactive/grasshopper-admin.git
git clone git@github.com:Solid-Interactive/grasshopper-api-js.git
git clone git@github.com:Solid-Interactive/grasshopper-core-nodejs.git

-- Install dependencies and link npms

cd {core project path} && npm install && npm link
cd {api project path} && npm install && npm link grasshopper-core && npm link
cd {admin project path} && npm install && bundle install && bower install && cd server && npm install && npm link grasshopper-api

-- Start dev server

cd {admin project path} && grunt server
