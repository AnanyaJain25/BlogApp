
import mongoose from "mongoose"

// creating connection function
const Connection = async(URL) =>{
    //connection string as first argument
    //second is an object
 
    try{
          await mongoose.connect(URL,{ useNewUrlParser: true });
          console.log('database connected successfully');
    } catch(error){
        console.log('error while connecting',error);
    }
}

export default Connection;