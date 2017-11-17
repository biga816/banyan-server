import * as fastify from 'fastify';

export const getOptions: fastify.RouteShorthandOptions = {
  schema: {}
};

export const postOptions: fastify.RouteShorthandOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        test: { type: 'number' }
      }
    }
  }
};