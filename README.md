# LogNote
### Technology Stack

1. Node.js
2. Express
3. Postgres (DBMS)

  - One To One
  - One To Many
  - Many To Many 

4. Sequelize (ORM)

  - Basic Query / CRUD (WAJIB)
  - Validations
  - Hooks

5. EJS (Template Engne)

  - CSS framework menggunakan Bootstrap

### Entity Relational Diagram / ERD (WAJIB!!)

https://dbdiagram.io/d/641d66d75758ac5f1723d392

### API Documentation (OPTIONAL!!)

Swagger API Documentation

https://app.swaggerhub.com/apis-docs/Team1-LogNote/LogNote/1.0.0

### Upload to cloud with Glitch.me (OPTIONAL!!)

https://chestnut-phrygian-pyjama.glitch.me/

``` bash
npx sequelize-cli model:generate --name note --attributes imageType:string,imageName:string,imageData:blob,text:text,projectId:integer

npx sequelize-cli model:generate --name project --attributes name:string,description:text,repository:text

npx sequelize-cli model:generate --name projectUser --attributes projectId:integer,userId:integer

npx sequelize-cli model:generate --name user --attributes username:string,name:string,password:string,role:string

npx sequelize-cli model:generate --name profile --attributes userId:integer,email:string,position:string,phone:string,address:text

```
