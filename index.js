const express = require('express');
const server = express();
server.use(express.json());

server.use((req, res, next) => {
    console.log(`Método: ${req.method}; URL: ${req.url}`);

    return next();
});

// Middlewares
function checkUserExists(req, res, next) {
    if (!req.body.name){
        return res.status(400).json({
            error: 'User name required!'
        });
    }
    return next();
}

function checkUserInArray (req, res, next){
    const user = users[req.params.index];

    if (!user) {
        return res.status(400).json({
            error : 'User Id not exists!',
        });
    }
    req.user = user;
    return next();
}

 // CRUD
const users = ['Daniel', 'Jose', 'Marcos'];

server.get('/users', checkUserInArray, (req, res) => { // Lista todos user
    res.json(users);
})

server.get('/users/:index', checkUserInArray, (req, res) => {  // Lista user
    const { index } = req.params;
    res.json(req.user);
} );

server.post('/users', checkUserExists, (req, res) => { // add user
    const { name } = req.body;
    users.push(name);

    return res.json(users);
});

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {  //update user
    const { name } = req.body;
    const { index } = req.params;
    users[index] = name;

    return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req, res) => { // delete user
    const { index } = req.params;
    
    users.splice(index, 1);

    return res.send(`Deletado user id: ${index}`);
})

server.listen('3000');