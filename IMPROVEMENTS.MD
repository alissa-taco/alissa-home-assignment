# Improvements

**Author:** Alissa Zhang\
**Role:** Senior Software Engineer\

## Suggested Improvements

1. I designed repo methods as async functions since in future it will connect to DB, but not needed at this stage.
1. improve API update loan: make fileds optional in request body
1. improve GET APIs: add more filters
1. improve API create loan: create multiple loans
1. create util func to calculate loan amount limits based on income, etc
1. generate uuid/unique id for loan id.
1. add `beforeAll` and `afterAll` for test file to cleanup in-memory db.
1. create `server` folder and move `src` inside `server` in order to separate `packages.json` for server folder and root folder, in the future will create separate `packages.json` in client folder, 3-rd party integration folder etc for easy maintenance.
```
server
  src
  packages.json
client
  src
  packages.json
3rd-party
  src
  packages.json
```
1. implement log monitoring system and set alert
1. handle error outcomes properly depends on UI design
