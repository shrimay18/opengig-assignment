###How to set up project on your laptop 
#Firstly clone the repo in your local device .
#Then add all the necessary dependencies and tools like axios , express, cors, mongoose, etc

Now enter the server folder and run command 
node index.js 

Enter client folder and run command 
npm start

You are free to explore all the possible features of the web page .

###Features of the webpage 
#There are two sections , namely start block and status block . In start block we can start the email workflow by typing the mail and then as per the procedure the logs can be seen in the same block below the start button . It considers 15 seconds as 1 day . After 3 days a reminder is send and again if we dont accept the subscription under next 2 days then we remove the email from the database .

#The check status section is made to check the status of particular email . Whether it is accepted , rejected or pending which is logged when we click on check status button .

#A page named decision is made which works as a dummy email and two buttons accept and reject works as dummy data which we would have otherwise received from some email . 


###Important clarifications:
#As the project was small so I didn't distribute code into many files and folders 
#I didn't put my mongo key in the .env and .env into gitignore file as you would need to locally run the project and if key is not available then it would not function properly . 
#I havent deployed the app  but am aware about how we need to make seperate files and upload frontend on vercel , etc and backend on render,etc and then need to connect them . 