
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prisma-streams.cjs.production.min.js')
} else {
  module.exports = require('./prisma-streams.cjs.development.js')
}
