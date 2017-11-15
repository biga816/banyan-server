export const getOptions = {
  schema: {}
};

export const postOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        test: { type: 'number' }
      }
    }
  }
};