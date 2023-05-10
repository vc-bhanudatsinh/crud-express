import express from "express";
import * as apiController from "./api.js";
import * as helper from "./helper.js";
const app = express();
const port = 3000;
const apiPrefix = "api";

// parse body data in json
app.use(express.json());

app.get(`/${apiPrefix}/users`, apiController.getSingleUser); // GET api for single User data

app.get(`/${apiPrefix}/allusers`, apiController.getAllUser); // GET api for all user data

app.post(`/${apiPrefix}/users`, apiController.createUser); // POST api for create user data

app.patch(`/${apiPrefix}/users`, apiController.updateUser); // PATCH api for update user data

app.delete(`/${apiPrefix}/users`, apiController.deleteUser); // DELETE api for deleting user from DB

app.use("/", (req, res) => helper.responseHandler(res, 404, "NOT Found")); // Throw error for route not found

app.listen(port, () => console.log(`Server is running on ${port}`)); // server listening event
