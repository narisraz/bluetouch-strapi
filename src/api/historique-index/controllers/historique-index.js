'use strict';

/**
 * historique-index controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::historique-index.historique-index', ({ strapi }) => ({
  validate: async (ctx) => {
    const {tournee} = ctx.request.body.data

    const indices = await strapi.db.query('api::historique-index.historique-index').findMany({
      select: ['id'],
      where: {
        valide: false,
        tournee
      },
    });

    return await strapi.db.query('api::historique-index.historique-index').updateMany({
      where: {
        valide: false,
        id: indices.map(i => i.id)
      },
      data: {
        valide: true,
      },
    });
  }
}));
