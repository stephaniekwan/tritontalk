require('dotenv').config({path: require('path').resolve(__dirname, '../.env')})

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const axios = require('axios')

const app = require('../index')
before(function(){
  console.log('Waiting for MongoDB connection...')
  return require('../models/db')
})

dependencies = { chai, axios, app }

require('./index')(dependencies)
require('./auth')(dependencies)
require('./db_basic_crud.js')(dependencies)
require('./db_linked_crud.js')(dependencies)