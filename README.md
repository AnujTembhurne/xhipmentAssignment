# xhipmentAssignment

**This is my project for the social media app .Which has 11 API's and this is the project like "Instagram" which is alos social media app..
Further details are given below  :-

## PROFILE API's

### 1) POST API - creating user

A user is created in this api by taking his/her details and storing that as a document in the mongoDB. Here there are some validations also and mandatory fields also . And handled edge cases as well .

### 2) POST API - logging in 

Here with the help of email and password , the user is able to login to his/her account . And used jsonWebToken for generating the token for the user.

### 3) PUT API - following user

In this api , User is able to follow another user with the help of userId and with that I have increased the count of following in the user who is following and increased the count of follower in the doc of user who is getting followed . With that the username is also stored .

### 4) PUT API - fUnollowing user

In this api , User is able to unfollow another user with the help of userId and with that I have decreased the count of following in the user who is following and decreased the count of follower in the doc of user who is getting followed . With that the username is also removed from the lists .

### 5) GET API - get user details

In this api , the user can fetch its followers list and following list and here also there are validations and cases handled .

### 6) PUT API - liking a post

Through this api , user can like over the post of other users . Where the post which are existing or are not deleted only over that post user can give like.

### 7) PUT API - commenting on a post

In this , Used postId to comment over the post of other users . As the comment is added the comments list also getting updated and also increasing the comments's count by 1 .

## POST API's

### 1) POST API - creating a post 

The api hhas many validations for the keys that are passing in the request body . Here AWS S3 is used to upload the files .
Also used multer package .

### 2) PUT API - editing a post 

Through this api , user is able to edit the post which he/she uploaded and can change the fields like caption 

### 3) DELETE API - deleting a post

In this api , the user is able to delete the post which he/she has uploaded earlier , I have done that by making the isDeleted key as true .

### 4) GET API - getting the post

Through this api , user is able to view posts of other users . Here also there are many validatioins applied .

## MIDDLEWARES 

Here I have written the code for authentication and authorization . Here used jsonwebtoken for authentication . And this middlewwares are applied on many api's mentioned above which authenticates the code . 

### Thank you for giving time to read this . I hope it gives good idea about the project . 

