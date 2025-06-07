import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(colors.bold.green(`Mongo DB conectado la url: ${url}`));
  } catch (error) {
    console.log(colors.bgRed(error));
    process.exit(1);
  }
};
