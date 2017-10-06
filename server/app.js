var express = require('express');
var http = require('http');
var https = require('https');
var app = express();
var fs = require('fs');
var cors = require('cors');
let bodyParser = require('body-parser');

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.send('hello world');
});

app.get('/allTodoItems', function(req, res) {
    fs.readFile('todostore.json', 'utf8', (err, data) => {
        let jsonData = '{}';
        if(data) {
            jsonData = JSON.parse(data);
        }
        res.send(jsonData);
    })
});

app.post('/addTodoItems', function(req, res) {
    console.log('post request received');

    const todoItem = req.body.todoItem;
    const item = req.body.time;
    
    fs.readFile('todostore.json', 'utf8', function (err, data) {
        let jsonObj = data == '' ? {} : JSON.parse(data)
        let todoStore = jsonObj.todoStore;
        if(!jsonObj.todoStore) {
            jsonObj.todoStore = [];
        }

        let maxId = 1;
        jsonObj.todoStore.forEach(function(element) {
            let id = Number(element.id);
            if(id > maxId) {
                maxId = id;
            }
        }, this);

        jsonObj.todoStore.push( 
            {
                "id": maxId + 1,
                "description": todoItem,
                "timeCreated": item
            }
        );
    
        fs.writeFile('todostore.json', JSON.stringify(jsonObj))
        res.send('successfully added');
    })
});

app.post('/editTodoItems', function(req, res) {
    console.log('delete request received');

    const id = req.body.id;
    const newDesc = req.body.description;
    fs.readFile('todostore.json', function (err, data) {
        var json = JSON.parse(data)
        let todoItems = json.todoStore;

        todoItems.forEach(function(item) {
            if(item.id === id) {
                item.description = newDesc;   
            }
        }, this);

        let jsonStr = JSON.stringify(json);
        fs.writeFile('todostore.json', jsonStr)
        res.send('successfully added');
    })
});

app.post('/deleteTodoItems', function(req, res) {
    console.log('delete request received');

    const id = req.body.id;
    fs.readFile('todostore.json', function (err, data) {
        var json = JSON.parse(data)
        let todoItems = json.todoStore;

        let filterTodoItems = todoItems.filter(function(item) {
            if(item.id !== id) {
                return true;
            }
            else {
                return false;
            }
        }, this);

        let jsonObj = {'todoStore': filterTodoItems};
        let jsonStr = JSON.stringify(jsonObj);
        fs.writeFile('todostore.json', jsonStr)
        res.send('successfully added');
    })
});

// var sslOptions = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem'),
//     passphrase: '1234'
//   };

//app.listen(3000);
http.createServer(app).listen(3000);
//https.createServer(sslOptions, app).listen(3000);
