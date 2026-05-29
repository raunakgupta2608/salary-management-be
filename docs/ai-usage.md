## Review the project-scope file and make it more expressive and concise.

## Read @project-scope.md file. Review it and ask me clarifying questions. Help me find gaps or things I haven't thought through

## create a tech-stack.md file for me. For frontend use react not nextjs reason being we don't need SSR or any other rendering pattern since the dashboard is just for admin to view and analyse basic things. Backend use nest js since, in real prod grade application backend is often a sepearate team and next js for api's isn't that scalable so considering future scopes of some new functionality nextjs as backend might cause hindrance. For database I'll stick to postgres since the it provides a lot of benefits and as per our use case aggreation and joins like things are required so let's stick to postgres. You may add your own points and also specify tradeoffs in another section. Divide this file into two parts, one is tradeoffs and tech-stack

## Help me connect my nestjs application to aiven postgres db using knex orm.

## I have connected my NestJS application to aiven PostgreSQL DB using Knex ORM. In my Aiven console, I only see a database named salary_management, it doesn't have a table yet. I need to seed the database with a table named employees which will look somewhat like this

Add new employees with fields:
Full Name
Job Title
Country
Salary
Department (optional but useful for segmentation)
Email (unique identifier)
Employment Status (Active/Inactive)
Created At / Updated At timestamps
id primary_key
It should seed 10000 rows. Help me on how to do it

## Create a seed and migration file within the database folder.

## Also add a seed file which can add upto 10000 records with the below fields into employees table Full Name Job Title, Country, Salary, Department, Email (unique identifier), Employment Status (Active/Inactive), Created At / Updated At timestamps, id

## Refine the test case written for this cursor based pagination
