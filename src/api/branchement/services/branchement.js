'use strict';

/**
 * branchement service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::branchement.branchement');
