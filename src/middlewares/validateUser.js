'use strict';

/**
 * `validateUser` middleware
 */

module.exports = (config, { strapi }) => {
  
  return async (ctx, next) => {
    const isAdmin = ctx.url.includes('admin')
    const i18n = ctx.url.includes('i18n')
    if (ctx.request && ctx.request.header && ctx.request.header.authorization && !isAdmin && !i18n) {
      strapi.log.info('In validateUser middleware.');
      strapi.log.info(`Try to connect to ${ctx.url}.`);

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
        strapi.log.info(`Connection accpeted for user ${user.id}.`);
      }

    }

    await next();
  };
};
