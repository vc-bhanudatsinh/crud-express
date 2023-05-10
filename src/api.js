import * as helper from "./helper.js";
import * as fsPromise from "fs/promises";
import path from "path";

const dbPath = path.join(path.resolve(), "./db/db.json");

/**
 * @function getSingleUser - GET single user data according to user email
 * @param {json} req
 * @param {json} res
 * @return {void}
 */
export const getSingleUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || email.trim().length === 0)
      return helper.responseHandler(res, 404, "User email not found or empty");
    const dbData = await helper.getDbData();
    const userData = dbData.find((user) => user.email === email);
    if (!userData) return helper.responseHandler(res, 404, "No User found");
    return res.status(200).send({
      data: userData,
    });
  } catch (error) {
    return helper.responseHandler(res, 500, error.message);
  }
};

/**
 * @function getAllUser - GET all user details
 * @param {json} req
 * @param {json} res
 * @returns {void}
 */
export const getAllUser = async (req, res) => {
  try {
    const dbData = await helper.getDbData();
    return res.status(200).send({
      data: dbData,
    });
  } catch (error) {
    return helper.responseHandler(res, 500, error.message);
  }
};

/**
 * @function updateUser - UPDATE single user details like email, age, name
 * @param {json} req
 * @param {json} res
 * @returns {void}
 */
export const updateUser = async (req, res) => {
  try {
    const { email, newEmail, age, name } = req.body;
    if (!email || email.trim().length === 0)
      return helper.responseHandler(res, 400, "User email not found or empty");
    if (!newEmail && !age && !name)
      return helper.responseHandler(
        res,
        400,
        "Some Body Parameters are missing"
      );
    const dbData = await helper.getDbData();
    const isEmailExist = dbData.find((user) => user.email === email);
    if (!isEmailExist)
      return helper.responseHandler(res, 404, "Email not found");
    const isNewEmailExist = dbData.find((user) => user.email === newEmail);
    if (isNewEmailExist)
      return helper.responseHandler(res, 409, "Duplicate new Email Id");
    dbData.find((user) => {
      if (user.email === email) {
        user.email = newEmail ? newEmail : user.email;
        user.age = age ? age : user.age;
        user.name = name ? name : user.name;
        console.log("user", user);
      }
    });
    fsPromise.writeFile(dbPath, JSON.stringify(dbData), { encoding: "utf-8" });
    return helper.responseHandler(
      res,
      200,
      "User Details updated Successfully"
    );
  } catch (error) {
    return helper.responseHandler(res, 500, error.message);
  }
};

/**
 * @function createUser - POST create a single user in db file
 * @param {json} req
 * @param {json} res
 * @returns {void}
 */
export const createUser = async (req, res) => {
  try {
    const { email, age, name } = req.body;
    if (!email || !age || !name)
      return helper.responseHandler(
        res,
        400,
        "Some Body Parameters are missing"
      );
    const dbData = await helper.getDbData();
    const isUserExist = dbData.find((user) => user.email === email);
    if (isUserExist)
      return helper.responseHandler(res, 200, "Duplicate Email found");
    dbData.push({ email, name, age });
    await fsPromise.writeFile(dbPath, JSON.stringify(dbData), {
      encoding: "utf-8",
    });
    return helper.responseHandler(res, 201, "User Created Successfully");
  } catch (error) {
    return helper.responseHandler(res, 500, error.message);
  }
};

/**
 * @function deleteUser - DELETE a single user from db file
 * @param {json} req
 * @param {json} res
 * @returns {void}
 */
export const deleteUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return helper.send(res, 400, "Email is Required");
    let dbData = await helper.getDbData();
    const isEmailExist = dbData.find((user) => user.email === email);
    if (!isEmailExist)
      return helper.responseHandler(res, 404, "Email not found");
    dbData = dbData.find((user) => user.email !== email);
    if (!Array.isArray(dbData)) dbData = dbData ? [dbData] : [];
    await fsPromise.writeFile(dbPath, JSON.stringify(dbData), {
      encoding: "utf-8",
    });
    return helper.responseHandler(res, 200, "Deleted User Successfully");
  } catch (error) {
    return helper.responseHandler(res, 500, error.message);
  }
};
