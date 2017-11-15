import {Router, Request, Response, NextFunction} from 'express'
// const Heroes = require('../data.json')

/**
 * The session router will house all routes that relate to session.
 * This will be: signup / login / logout
 */
export class SessionRouter {
	router: Router
  
	/**
	 * Initialize the Session Router
	 */
	constructor() {
	  this.router = Router()
	  this.init()
	}
  
	/**
	 * GET all Heroes.
	 */
	public signup(req: Request, res: Response, next: NextFunction) {
	  res.send({
		  message: 'This will be the signup route',
		  status: 200
	  })
	}
  
	/**
	 * Take each handler, and attach to one of the Express.Router's
	 * endpoints.
	 */
	init() {
	  this.router.get('/', this.signup)
	  this.router.get('/signup', this.signup)
	}
  
  }
  
  // Create the HeroRouter, and export its configured Express.Router
  const sessionRoutes = new SessionRouter()
  sessionRoutes.init()
  
  export default sessionRoutes.router