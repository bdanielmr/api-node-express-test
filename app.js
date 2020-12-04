const e = require('express');
const express = require('express');
const Joi = require('joi');
const morgan = require('morgan')
//const logger = require('./logger')
const app = express();
app.use(express.json()) //body
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//app.use(logger)

//use middleware morgan 

app.use(morgan('tiny'))
console.log('morgan eject');

// app.use(function(req, res, next) {
//     console.log('Autentificando...');
//     next()
// })

const usuarios = [
    { id: 1, name: 'Blond', email: 'blond@blond.com'},
    { id: 2, name: 'Blonciño', email: 'blonciño@blond.com'},
    { id: 3, name: 'Chala', email: 'chala@blond.com' },
];

app.get('/', (req, res) => {
    res.send('hola blond desde la api express')
})

app.get('/api', (req, res) => {
    res.send(usuarios)
})

app.get('/api/usuario/:idPingo', (req, res) => {
    res.send(req.params.idPingo)
})

app.get('/api/usuarios/:year/:mes', (req, res) => {
    res.send(req.query)
})

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = nombreFormat(req.params.id);
    if(!usuario) res.status(404).send('el usuario no fue encontrado')
    res.send(usuario);
})

app.post('/api/usuarios', (req, res) => {
    const { value, error } = validateName(req.body.nombre);
    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        }
        usuarios.push(usuario)
        res.send(usuario)
    }
    else {
        console.log(error.message)
        res.status(400).send(error.message)
    }


})

app.put('/api/usuarios/:id', (req, res) => {
    let newUsuario = nombreFormat(req.params.id)
    if (!newUsuario) {
        res.status(404).send('el usuario no fue encontrado')
        return;
    }
    const { value, error } = validateName(req.body.nombre);
    if (error) {
        console.log(error)
        res.status(400).send(error.details[0].message)
        return;
    }

    newUsuario.nombre = value.nombre;
    res.send(newUsuario)

})

app.delete('/api/usuarios/:id', (req, res) => {
    let newUsuario = nombreFormat(req.params.id)
    if (!newUsuario) {
        res.status(404).send('el usuario no fue encontrado')
        return;
    }
    const index = usuarios.indexOf(newUsuario);
    usuarios.splice(index, 1)
    res.send(newUsuario)
})

function nombreFormat(id) {
    let usuario = usuarios.find(u => u.id === parseInt(id));
    return usuario
}

function validateName(nombre) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({ nombre: nombre }))
}


const port = process.env.PORT || 3000;

// console.log(process.env)
app.listen(port, () => {
    console.log('servidor eject', port)
})
//$env:PORT="5000"
//
