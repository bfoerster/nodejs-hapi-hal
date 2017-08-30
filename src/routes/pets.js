const Joi = require('joi');
const _ = require('underscore');

const allPets = [];

module.exports = [
    {
        method: 'GET',
        path: '/pets',

        config: {
            handler: (request, reply) => {
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
                            ignore: 'id'
                        }
                    }
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/pets/{id}',

        config: {
            handler: (request, reply) => {
                const id = request.params.id;
                return reply(createPet(id, 'Bodo', 'Dackel'));
            },
            description: 'Get A Pet By Id',
            notes: 'Returns a single pet',
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string()
                        .required()
                        .description('The pets id'),
                }
            },
            plugins: {
                hal: {
                    ignore: 'id'
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/pets',

        config: {
            handler: (request, reply) => {
                const body = request.payload;
                body.id = randomId();
                allPets.push(body);
                return reply(body);
            },
            description: 'POST a new Pet',
            notes: 'Creates a new pet',
            tags: ['api'],
            plugins: {
                hal: {
                    ignore: 'id',
                    prepare: (rep, done) => {
                        rep._links.self.href = '/pets/' + rep.entity.id;
                        done();
                    }
                }
            }
        }
    }
];

function randomId() {
    return Math.floor(Math.random() * 1000);
}

function createPet(id, name, category) {
    const pet = {
        id: id,
        name: name,
        category: category
    };
    return pet;
}