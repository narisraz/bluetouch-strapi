'use strict';

/**
 * `validateUser` middleware
 */

module.exports = (config, { strapi }) => {
  
  return async (ctx, next) => {
    const isAdmin = ctx.url.includes('admin')
    if (ctx.request && ctx.request.header && ctx.request.header.authorization && !isAdmin) {
      strapi.log.info('In validateUser middleware.');

      const user = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
      let saepId = ctx.request.header.saep

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
