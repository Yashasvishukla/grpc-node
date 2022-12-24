const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);

// Object of todoPackage
const todoPackage = grpcObject.todoPackage;


// Create server
const server = new grpc.Server();
server.bind("0.0.0.0: 40000", grpc.ServerCredentials.createInsecure());

// Tell server about what services its using
server.addService(todoPackage.Todo.service, 
    {
        "createTodo": createTodo,
        "readTodos": readTodos,
        "readTodosStream": readTodosStream
    });

server.start();

// Map services

// Add Todo to the TodoList
const todoList = [];
function createTodo (call, callback)
{
    const todoItem = {
        "id": todoList.length + 1,
        "text": call.request.text
    };
    todoList.push(todoItem);
    
    // Call the client back or notify the operation is complete
    callback(null, todoItem);
}

function readTodos (call, callback)
{
    callback(null, {"items": todoList});
}
function readTodosStream(call, callback)
{
    // magic
    todoList.forEach(t => call.write(t));
    call.end();
}