import * as fastify from 'fastify'
import * as cors from 'cors'

import { Router } from './router';

const server = fastify();

class REST {
  constructor() {
    this.init();
  }

  init() {
    // set fastify setting
    server.use(cors());
    // server.decorate('conf', CONFIG);

    // set routes
    Router(server);

    server.listen(3000, err => {
      if (err) throw err;
      console.log(`server listening on ${server.server.address().port}`);
    });
  }
}

new REST();