'use strict';

/**
 * compteur service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::compteur.compteur');
