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

export const manageDB = app => {
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

  const codeBlocks = mongoose.model('code_block', {}, 'code_blocks')
  const names = mongoose.model('name', {}, 'names')

  // retrieve the functions names for the lobby menu
  app.get('/names', async (req, res) => {
    console.log("in names");
    try{
      const allNames = await names.findOne();
      if(allNames){
        res.json({ type: 'names', data: allNames });}
      else{
        console.log("in names- cannot find names");
        res.json({ type: 'namesError', message: 'cannot find names' });}
    } catch(err){
        console.log("in names- error caught");
        res.json({ type: 'namesError', message: err });
    }
  });

  // retrieve the functions content for the code block
  app.get('/codeBlock/:index', async (req, res) => {
    const index = req.params.index;
    console.log("in codeBlock/index: ", index);
    try{
      const block = await codeBlocks.findOne({ index: String(index) });
      if(block)
        res.json({ type: 'codeBlock', block: block });
      else{
        console.log("in codeBlock/index: "+ index+ "- cannot find names");
        res.json({ type: 'codeBlockError', message: 'cannot find code block' });}
    } catch(err){
      console.log("in codeBlock/index: "+ index+ "- error caught");
        res.json({ type: 'codeBlockError', message: err });
    }
  });
}
