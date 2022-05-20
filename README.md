# Automated Prom Sign Up Application
The goal of our application is to allow for the automation of the Poolesville Prom sign up process.

Currently, the process is tedious as it requires students to manually enter in their student information and there is trouble communicating between different ticket sale locations.

___

__System Requirements__

- [x] User Interface with Fields to enter student information
- [x] Settings Page- Allows user to set a starting ticket number and guests quota
- [x] Information inputted to UI will be processed by Server
- [x] Server will write  to a NoSQL cloud database (Firebase)
- [x] A .csv (comma separated values) file will be produced from database to input to the Sign-in Program 
- [x] Application will be accessible from multiple devices running simultaneously

___
__Installing and Running the Application__

__1. Verify that you have node installed__

Open terminal and run this command:
```
$ node -v
v10.15.0
```

__2. Cloning Repository__

Link to github repo: https://github.com/isanjit3/SRSS-PromSignUpApp.git


Open terminal in development environment (Visual Studio Code, Atom, etc.)

Clone repo:
```
$ git clone https://github.com/isanjit3/SRSS-PromSignUpApp.git
```

__3. Setting the Server__

First, you will have to install the necessary dependencies, this can be done through the npm install command

```
$ npm install
```


Once you have the repository cloned, run the command to start the server. You should see the server being hosted locally at port 3000.
```
$ node server.js
SRSS Prom Sign Up App listening on port 3000!
```

__4. Accessing the Application__

Now that you have started running the server on port 3000, you can access this port by going to your web browser and typing http://localhost:3000/.

The application should now be functional and running.