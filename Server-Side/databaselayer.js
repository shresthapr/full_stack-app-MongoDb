"use strict";

const mysql = require("mysql");
const dotenv = require("dotenv");
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("db" + connection.state);
});
module.exports = class TodoDatabase {
  async getAll() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM todolist;";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (err) {
      console.log(err.message);
    }
  }
  async insertNew(note) {
    try {
      const dateAdded = new Date();
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO todolist (Note, Entry, Status) VALUES (?,?, ?);";
        connection.query(query, [note, dateAdded, 0], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.insertId);
        });
      });
      console.log(insertId);
      return {
        Id: insertId,
        Note: note,
        Entry: dateAdded,
      };
    } catch (err) {
      console.log(err);
    }
  }

  async search(id) {
    try {
      const resp = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM todolist WHERE Id=?;";
        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return resp;
    } catch (err) {
      console.log(err.message);
    }
  }

  async remove(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM todolist WHERE id = ?";
        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updatelist(id, note) {
    try {
      id = parseInt(id, 10);
      const resp = await new Promise((resolve, reject) => {
        const query = "UPDATE todolist SET Note =? WHERE Id=?;";
        connection.query(query, [note, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });
      return resp === 1 ? true : fasle;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
};
