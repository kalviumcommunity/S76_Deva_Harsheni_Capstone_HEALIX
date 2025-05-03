const mongoose = require('mongoose');


const connectDatabase = () => {
  mongoose.connect(process.env.MONGO_URI)
  .then((data) =>{
    console.log(`Connected to database: ${data.connection.host}`);
})
.catch((err) =>{
    console.error(`Error connecting to database: ${err.message}`);
});
};


module.exports = connectDatabase;