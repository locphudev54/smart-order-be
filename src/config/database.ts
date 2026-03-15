export default () => ({
  databaseUri:
    process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_DATABASE_URI : process.env.DEVELOPMENT_DATABASE_URI
})
