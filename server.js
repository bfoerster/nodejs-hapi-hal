'use strict';
const Joi = require('joi');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Halacious = require('halacious');
const mongoose = require('mongoose');
const PetRoute = require('./src/routes/pets');
const OrdersRoute = require('./src/routes/orders');

mongoose.Promise = global.Promise;
const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/my_petstore';

mongoose.connect(dbURI, {useMongoClient: true})
    .then(() => console.log("Database connection established"))
    .catch(console.log);

const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000,
    routes: {
        validate: {
            headers: Joi.object({
                'accept': Joi.string().invalid('application/json').optional()
            }).options({allowUnknown: true})
        }
    }
});

const options = {
    info: {
        'title': 'Pet API Documentation',
        'version': "1",
    },
    produces: ['application/hal+json']
};

server.register([
        Halacious,
        Inert,
        Vision,
        {
            'register': HapiSwagger,
            'options': options
        }],
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
server.route(OrdersRoute);