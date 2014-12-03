---
title: Deploy to a test environment
uuid: testing-deployment-example
language: bash
---

-- Setting Remote Configuration

cd ~/{grasshopper-admin-directory}

grunt deploy:heroku:setupConfigs

-- Deploy to Heroku

cd ~/{grasshopper-admin-directory}

grunt deploy:heroku
