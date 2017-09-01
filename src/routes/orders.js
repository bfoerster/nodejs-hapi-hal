const Order = require('../models/order');

module.exports = [
    {
        method: 'GET',
        path: '/api/orders',
        config: {
            handler: async (request, reply) => {
                console.log('GET orders');
                const allOrders = await Order.find();
                return reply({orders: allOrders});
            },
            // TODO add link to pets...
            plugins: {
                hal: {
                    embedded: {
                        'orders': {
                            path: 'orders',
                            href: './{item.id}',
                            ignore: ['_id', '__v'],
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

                const order = await Order.findById(id);
                return reply(order);
            },
            plugins: {
                hal: {
                    ignore: ['_id', '__v'],
                    // TODO add link to pets...
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
        method: 'POST',
        path: '/api/orders',
        config: {
            handler: async (request, reply) => {
                console.log('POST orders');
                const body = request.payload;

                const toSave = new Order(body);
                const order = await toSave.save();

                return reply(order);
            },
            plugins: {
                hal: {
                    ignore: ['_id', '__v'],
                    prepare: (response, done) => {
                        response._links.self.href = '/api/orders/' + response.entity.id;
                        done();
                    },
                    embedded: {
                        'orders': {
                            path: 'orders',
                            href: './{item.id}',
                            ignore: ['_id', '__v']
                        }
                    }
                }
            }
        }
    }
];