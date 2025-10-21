Bakend

If you havent already please message me to gain access to mongodb 

Packages You May Need:

Please install the following packages if you have any trouble

# npm install mongoose 
# npm install dotenv
# npm install nodemon

When you create a .env file, please add the following variables 

MONGO_URI = <Insert here>

PORT = 5001

For mongo UrI it should look like the following

mongodb+srv://USERNAME:PASSWORD@capture.15b9cme.mongodb.net/DBNAME?retryWrites=true&w=majority&appName=Capture

Therefore it can look like this 

mongodb+srv://chrisf2503:Secrete.15b9cme.mongodb.net/Capture?retryWrites=true&w=majority&appName=Capture

When you want to run test, please do use the following command when you are inside the backend folder

# npm run dev

this will run nodemon, such that when you make a insert, delete, change, etc to the DB, it will refresh rhe page show the changes you have made

For deployment use 

# npm run start