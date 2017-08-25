const Joi = require('joi');
const _ = require('underscore');

module.exports = [{
    method: 'GET',
    path: '/pets',

    config: {
        handler: (request, reply) => {
            const allPets = _.range(0, 10, 1).map((id) => createPet(id, 'Bodo', 'Dackel'));
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
    }];


function createPet(id, name, category) {
    const pet = {
        id: id,
        name: name,
        category: category
    };
    return pet;
}