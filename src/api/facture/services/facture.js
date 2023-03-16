'use strict';

/**
 * facture service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::facture.facture');
