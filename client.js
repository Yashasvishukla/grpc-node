// Client also needs to understand same schema which server is using using protoBuffers

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

// Client connects to server
const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure());

// Create Todo Request from the client end
// const textArg = process.argv[2];
client.createTodo({
    "id": -1,
    "text": "Hello"
}, (error, response) =>
{
    console.log("received from the server " + JSON.stringify(response));
});


// Fetch all the TodoList from the server
client.readTodos({}, (error, response) =>
{
    if(response.items != null)
        response.items.forEach(i => console.log(i.text));
});

const callObject = client.readTodosStream();
callObject.on("data", item => {
    console.log("received item from server " + JSON.stringify(item));
});

callObject.on("end", e => console.log("ended the communication"));