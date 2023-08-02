# Reviews website with React (NextJS)
Functional reviews website with rating created with React (NextJS framework) on NodeJS backend.

## Requirements
For this project to work, the server must have NodeJS and MySQL installed.

## Installation
To install this project, you must have valid credentials to an empty database in MySQL. If not, create it with any name you want.

In the command line of your server, go to the root folder of your website and clone this project:
```
cd /path/to/your/folder
git clone https://github.com/nanocirs/reviews-website-react
``` 
Then, you must enter your database credentials in the file `.env.local`.

Install the required dependencies, build and run the app:
```
npm install
npm run build
npm start
```
Now you can go to your browser and you should see your website working. Write a review and it should update automatically.

## Further information
Each entry in the reviews table stores a token `user_id`, which is the same as the cookie `user_id` stored in the browser when a user sends a review. This is done as a simple way to limit flooding blocking the reviews each user can send to one every two hours. As long as the user keeps deleting the cookie, he will be able to post reviews without any restriction. Feel free to modify the code to address this issue.
