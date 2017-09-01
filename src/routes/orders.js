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
            plugins: {
                hal: {
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