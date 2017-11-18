import * as fastify from 'fastify'
import * as cors from 'cors'
import * as dotenv from 'dotenv';
import * as firebase from 'firebase'

import { Router } from './router';

const server = fastify();

/**
 * REST
 * 
 * @class REST
 */
class REST {
  constructor() {
    this.init();
  }

  public init(): void {
    // set fastify setting
    server.use(cors());
    dotenv.config();
    firebase.initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID
    });

    // set routes
    Router(server);

    server.listen(3000, err => {
      if (err) throw err;
      console.log(`server listening on ${server.server.address().port}`);
    });
  }
}

new REST();