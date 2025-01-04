const configuration = () => ({
  database: {
    host: process.env.MONGO_URI || 'mongodb://localhost:27017/lex'
  },
  auth: {
    token: process.env.AUTH_TOKEN
  },
  gcp: {
    clientEmail: process.env.GCP_CLIENT_EMAIL,
    projectId: process.env.GCP_PROJECT_ID,
    privateKey: process.env.GCP_PRIVATE_KEY
  }
});

export default configuration;
