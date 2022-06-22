'use strict';

/**
 *  manga controller
 */

const { parseMultipartData } = require('@strapi/utils')
const { createCoreController } = require('@strapi/strapi').factories

const parseBody = ctx => {
    if (ctx.is('multipart')) {
      return parseMultipartData(ctx)
    }
  
    const { data } = ctx.request.body || {}
  
    return { data }
  }

module.exports = createCoreController('api::manga.manga', ({ strapi }) => ({
  async update (ctx) {
    const { data, files } = parseBody(ctx)
    const { id } = ctx.params

    const sanitizedInputData = await this.sanitizeInput(data, ctx)

    const entry = await strapi.entityService.findOne('api::manga.manga', id, {
        populate: { cover: true },
      });
    
    if (files['cover']) {
        const file = await strapi.service('plugin::upload.upload').findOne(entry.cover.id );
        if (file) {
            await strapi.service('plugin::upload.upload').remove(file);
        }
    }

    const response = await super.update(ctx);
    return response;
  }
}))