import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI || "";

export const connectToDb = async () => {
  try {
    await mongoose.connect(uri, {});
    mongoose.set("strictPopulate", false);
    console.log("Connected to db");
  } catch (err) {
    console.error(err, "Error while connecting to DB");
  }
};

const codeBlockSchema = new mongoose.Schema({
  index: {
      type: Number,
      unique: true
  },
  title: {
      type: String,
      required: true,
  },
  code: {
      type: String,
      required: true,
  },
  code: {
    type: String,
    required: true,
},
})

codeBlockSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
}})

// Creates a Mongoose model named Post based on the defined schema
export const codeBlock = mongoose.model('code_block', {}, 'code_blocks')
export const names = mongoose.model('name', {}, 'names')