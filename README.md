# LogNote

``` bash
npx sequelize-cli model:generate --name note --attributes imageType:string,imageName:string,imageData:blob,text:text,projectId:integer

npx sequelize-cli model:generate --name project --attributes name:string,description:text,repository:text

npx sequelize-cli model:generate --name projectUser --attributes projectId:integer,userId:integer

npx sequelize-cli model:generate --name user --attributes username:string,name:string,password:string,role:string

npx sequelize-cli model:generate --name profile --attributes userId:integer,phone:string,address:text

```