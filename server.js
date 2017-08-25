'use strict';
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Halacious = require('halacious');

const PetRoute = require('./src/routes/pets');

const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

const options = {
    info: {
        'title': 'Pet API Documentation',
        'version': "1",
    }
};

server.register([
    Inert,
    Vision,
    {
        'register': HapiSwagger,
        'options': options
    },
    Halacious],
    (err) => {
    server.start((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Server started at ', server.info.uri);
        }
    });
});

server.route(PetRoute);