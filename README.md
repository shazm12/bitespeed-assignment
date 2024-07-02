# Bitespeed Backend Task: Identity Reconciliation
The following assignement is for backend developer role at Bitespeed. <br/>
The project is made using - 
1. Node.js ( With Typescript )
2. Express
3. Mysql as DB.
4. Aiven as a free MYSQL DB Hosting Platform.
5. render.com as free cloud server provisioner platform for the server.

<br />

[Link To API](https://bitespeed-assignment-yugh.onrender.com/)

*Note -Please note that the API might sometimes take time to respond(like a minute or more) which means the service is going through a cold-start because as per Render's documentation the free tier web service shuts down after few minutes of inactivity.*

<h1>Features</h1>
The API has two endpoints- <br />

1.  `/` (GET) - Responds with 'Express + Typescript Server'.

2.  `/create`(POST) - To create a new Contact Details which will also link the current Contact Details with existing one based on phone number and email.
Example of request body-

```javascript
{
    "email": "amritabera01@gmail.com",
    "phoneNumber": "212121"

}
```
 
3. `/identify`(POST) - To identify all the Linked Contact Details in a specific format as given in instructions file. The endpoint would also make sure if in results there are two **primary** contacts to link then make the other one which was created later than the previous one as **secondary** and link to the previous primary contact.
Example of request body-
```javascript
{
    "email": "shamik@gmail.com",
    "phoneNumber": "979797"

}
```


<h1>Improvements that can be made</h1>

1. The logic for some of the code can be improved for eg, the part where we are making the primary contacts to secondary and linking to the previous primary contact.

2. The application is tightly coupled with MySQL, we can use an ORM library like Sequalize or TypeORM so that we can use with any database service.


<h1>Contact Me</h1>

[Email](mailto:berashamik115@gmail.com)

[Linkedin](https://www.linkedin.com/in/shamik-bera/)

