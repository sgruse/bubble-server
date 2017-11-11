// External Dependencies
import * as path from 'path'
import * as express from 'express'
import * as logger from 'morgan'

import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'

import * as exphbs from 'express-handlebars'
import * as expressValidator from 'express-validator'
import * as session from 'express-session'

import * as passport from 'passport'
import * as LocalStrategy from 'passport-local'

// Routes
import HeroRouter from './routes/HeroRouter'
import SessionRouter from './routes/session'

class App {

  // ref to Express instance
  public express: express.Application
  
	//Run configuration methods on the Express instance.
	constructor() {
	  this.express = express();
	  this.middleware();
	  this.routes();
	}

	// Configure Express middleware.
	private middleware(): void {
		this.express.use(logger('dev'));
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: false }));
	}

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    // placeholder route handler
    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!'
      });
    });
	this.express.use('/', router)

	// Other routes
	this.express.use('/api/v1/heroes', HeroRouter)
	this.express.use('/session', SessionRouter)
  }
}

export default new App().express