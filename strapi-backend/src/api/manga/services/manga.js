'use strict';

/**
 * manga service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::manga.manga');
