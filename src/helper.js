import * as fsPromise from "fs/promises";
import * as fs from "fs";
import path from "path";

const dbPath = path.join(path.resolve(), "./db/db.json");

/**
 * @function getDbData - get users data from db file.
 * @returns {arrray} fileData - all users details like name, age, email
 */

export const getDbData = async () => {
  if (!fs.existsSync(dbPath)) {
    fsPromise.writeFile(dbPath, "[]", { encoding: "utf-8" });
  }
  const fileData = await fsPromise.readFile(dbPath, { encoding: "utf-8" });
  if (!Array.isArray(fileData)) return [];
  return JSON.parse(fileData);
};

/**
 * @function responseHandler - common function to send response.
 * @param {json} res
 * @param {number} code
 * @param {string} message
 * @returns {void}
 */
export const responseHandler = async (res, code, message) => {
  if (!code || !res)
    return res.status(500).send("Function arguments are not valid");
  if (code !== 201 && !message)
    return res.status(500).send("Function arguments are not valid");
  if (code === 201 && !message) return res.status(code).send();
  return res.status(code).send({ message });
};
