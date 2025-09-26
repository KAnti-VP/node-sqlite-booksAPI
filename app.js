import express from "express";
import * as db from "./data/db.js";

const PORT = 3000;

const app = express();

app.use(express.json());

app.get("/books", (req, res) => {
  const books = db.getBooks();
  res.status(200).json(books);
});

app.get("/books/:id", (req, res) => {
  const book = db.getBook(req.params.id);
  if (!book) {
    res.status(404).json("Book not found");
  }
  res.status(200).json(book);
});

app.post("/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    res.status(400).json("Missing data");
  }
  try {
    const saved = db.saveBook(title, author);
    const book = db.getBook(saved.lastInsertRowid);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.put("/books/:id", (req, res) => {
  const id = req.params.id;
  const letezik = db.getBook(id);
  const { title, author } = req.body;
  if (!letezik) {
    res.status(404).json("Book not found");
  }
  if (!title || !author) {
    res.status(400).json("Missing data");
  }
  try {
    db.updateBook(id, title, author);
    const book = db.getBook(id);
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.delete("/books/:id", (req, res) => {
  const id = req.params.id;
  const book = db.getBook(id);
  if (!book) {
    res.status(404).json("Book not found");
  }
  db.deleteBook(id);
  res.status(200).json("Delete successful");
});

app.listen(PORT, () => {
  console.log("Server runs on port: " + PORT);
});
