const Order = require('../models/order');
const _ = require('underscore');

module.exports = [
    {
        method: 'GET',
        path: '/api/orders',
        config: {
            handler: async (request, reply) => {
                console.log('GET orders');
                const allOrders = await Order.find().populate('pets');
                return reply({orders: allOrders});
            },
            plugins: {
                hal: {
                    embedded: {
                        'orders': {
                            path: 'orders',
                            href: './{item.id}',
                            ignore: ['_id', '__v'],
                            links: {
                                pets: {
                                    href: '/api/orders/{id}/pets'
                                }
                            },
                            embedded: {
                                'pets': {
                                    path: 'pets',
                                    href: '/api/pets/{item.id}',
                                    ignore: ['_id', '__v']
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/orders/{id}',
        config: {
            handler: async (request, reply) => {
                console.log('GET /orders/{id}');
                const id = request.params.id;

                const order = await Order.findById(id).populate('pets');
                return reply(order);
            },
            plugins: {
                hal: {
                    ignore: ['_id', '__v'],
                    links: {
                        pets: {
                            href: '/api/orders/{id}/pets'
                        }
                    },
                    embedded: {
                        'pets': {
                            path: 'pets',
                            href: '/api/pets/{item.id}',
                            ignore: ['_id', '__v']
                        }
                    }
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/orders/{id}/pets',
        config: {
            handler: async (request, reply) => {
                console.log('GET /orders/{id}/pets');
                const id = request.params.id;

                const order = await Order.findById(id).populate({path: 'pets'});
                return reply({pets: order.pets});
            },
            plugins: {
                hal: {
                    ignore: ['_id', '__v'],
                    embedded: {
                        'pets': {
                            path: 'pets',
                            href: '/api/pets/{item.id}',
                            ignore: ['_id', '__v']
                        }
                    }
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/orders',
        config: {
            handler: async (request, reply) => {
                console.log('POST orders');
                const body = request.payload;

                const petObjectIdPromises = _.map(body.pets, async petURL => {
                    const id = petURL.substring(petURL.lastIndexOf('/') + 1);
                    return id;
                });

                const petObjectIds = await Promise.all(petObjectIdPromises);
                body.pets = petObjectIds;

                const toSave = new Order(body);
                let order = await toSave.save();
                order = await Order.findById(order).populate('pets');

                return reply(order);
            },
            plugins: {
                hal: {
                    ignore: ['_id', '__v'],
                    prepare: (response, done) => {
                        response._links.self.href = '/api/orders/' + response.entity.id;
                        done();
                    },
                    links: {
                        pets: {
                            href: '/api/orders/{id}/pets'
                        }
                    },
                    embedded: {
                        'pets': {
                            path: 'pets',
                            href: '/api/pets/{item.id}',
                            ignore: ['_id', '__v']
                        }
                    }
                }
            }
        }
    }
];