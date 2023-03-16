'use strict';

/**
 * `validateUser` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      strapi.log.info('In validateUser middleware.');

      const user = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
      const params = new URLSearchParams(ctx.url.split('?')[1]);
      let saepId = undefined
      for (const entry of params.entries()) {
        if (entry[0].includes('filters[saep]')) {
          saepId = entry[1]
          break;
        }
      }

      if (saepId) {
        const result = await strapi.db.query('api::user-detail.user-detail').findOne({
          where: {
            user: user.id,
            saep: saepId
          }
        })
  
        if (!result) {
          return;
        }
      }

    }

    await next();
  };
};
