# remote-assignment-healthCheckAPI
## Description  
  You can use APIs with the following URLs:
  http://18.136.130.136/healthcheck  
  http://18.136.130.136/users
## Environment requirements  
  - node JS
  - express
  - mysql2
## How to use  
  ### You need to provide request headers with the following rules
    Content-Type : application/json  
    Request-Date : current datetime with the following formate  
    Example: Wed Oct 4 15:09:37 2023  
  ### POST http://18.136.130.136/users to create user  
  - Request Body :  
    Example
    ```
    {
      "name": "Gary",
      "password": "Gary123",
      "email": "Gary123@gmil.com"
    }
    ```
    It will return
    ```
    {
      "data": {
          "user": {
              "id": 1,
              "name": "Gary",
              "email": "Gary123@gmil.com"
          },
          "request-date": "Wed Oct 4 15:09:37 2023"
      }
    }
    ```
  ### GET http://18.136.130.136/users/id to search user  
  Exalple  
  http://18.136.130.136/users/1  
  It will return  
  ```
  {
    "data": {
        "user": {
            "id": 1,
            "name": "Gary",
            "email": "Gary123@gmil.com"
        },
        "request-date": "Wed Oct 4 15:09:37 2023"
    }
  }
  ```
