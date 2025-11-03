import mongoose from "mongoose";

export const connect_db = (mongourl: string) => {
  mongoose
    .connect(mongourl)
    .then(() => console.log("database connection successfully"))
    .catch(() => {
      console.log("database connection unsuccessfull");
    });
};
