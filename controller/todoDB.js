import { v4 as uuid } from "uuid";

const filePath = Bun.resolveSync("../filestorage/todos.json", import.meta.dir);

async function readFile() {
  const file = Bun.file(filePath);
  const content = await file.text();
  let isContentJson = false;
  let data;

  try {
    data = JSON.parse(content);
    isContentJson = true;
  } catch (e) {
    data = [],
    isContentJson = false;
  }
  return {
    isContentJson,
    data,
  }
}

export async function getTodo(req, res) {
  const content = await readFile();
  console.log(content);
  return res.json({
    status: 1,
    msg: 'ok',
    data: content.data,
  });
}

export async function addTodo(req, res) {
  const content = await readFile();
  let bytes = 0;
  let modifiedContent;
  
  if (req.body.action === 'add') {
    modifiedContent = content.isContentJson ? content.data : [];
    console.log('content', content);
    modifiedContent.push({
      id: uuid(),
      title: req.body.title,
      compleated: false,
    });
    bytes = await Bun.write(filePath, JSON.stringify(modifiedContent));
  }
  return res.json({
    status: bytes > 0 ? 1 : 0,
    msg: bytes > 0 ? 'ok' : 'error in writing',
    data: modifiedContent,
  });
}

export async function deleteTodo(req, res) {
  const { action, id } = req.body;
  const content = await readFile();
  let bytes = 0;
  let status = 0;
  let err;
  console.log(content);
  if (action === 'delete' && id) {
    try {
      const temp = content.data.filter((todo) => todo.id !== id);
      console.log(temp, content);
      if (temp.length === content.data.length) {
        err = `no record found with ${id}`;
      } else {
        bytes = await Bun.write(filePath, JSON.stringify(temp));
        status = 1;
      }
    } catch (e) {
      console.log('error in delete operation', e);
    }
  }

  return res.json({
    status,
    msg: status === 1 ? 'sucess' : 'fail',
    err,
  });
}