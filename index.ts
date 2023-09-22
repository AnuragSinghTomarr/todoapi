import express from "express";
import { addTodo, deleteTodo, getTodo } from "./controller/todoDB";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ status: 1, msg: 'online' });
});

app.route('/todos')
  .get(getTodo)
  .post(addTodo)
  .delete(deleteTodo)

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});