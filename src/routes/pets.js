const Joi = require('joi');
const Pet = require('../models/pet');

module.exports = [
    {
        method: 'GET',
        path: '/api/pets',

        config: {
            handler: async (request, reply) => {
                console.log('GET /pets');
                const allPets = await Pet.find();
                return reply({pets: allPets});
            },
            description: 'Get All Pets',
            notes: 'Returns a list including all pets available',
            tags: ['api'],
            plugins: {
                hal: {
                    embedded: {
                        'pets': {
                            path: 'pets',
                            href: './{item.id}',
                            ignore: ['_id', '__v']
                        }
                    }
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/pets/{id}',

        config: {
            handler: async (request, reply) => {
                console.log('GET /pets/{id}');
                const id = request.params.id;

                const pet = await Pet.findById(id);
                return reply(pet);
            },
            description: 'Get A Pet By Id',
            notes: 'Returns a single pet',
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string()
                        .required()
                        .description('The pets id')
                }
            },
            plugins: {
                hal: {
                    ignore: ['_id', '__v']
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/pets',

        config: {
            handler: async (request, reply) => {
                console.log('POST /pets');
                const body = request.payload;

                const toSave = new Pet(body);
                const pet = await toSave.save();

                return reply(pet);
            },
            description: 'POST a new Pet',
            notes: 'Creates a new pet',
            tags: ['api'],
            validate: {
                payload: {
                    name: Joi.string()
                        .required()
                        .description('The name of the pet'),
                    category: Joi.string()
                        .optional()
                        .description('The pets category ')
                }
            },
            plugins: {
                hal: {
                    ignore: ['_id', '__v'],
                    prepare: (response, done) => {
                        response._links.self.href = '/api/pets/' + response.entity.id;
                        done();
                    }
                }
            }
        }
    }
];
