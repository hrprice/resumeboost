const configuration = () => ({
  database: {
    host: process.env.MONGO_URI
  },
  gcp: {
    clientEmail: process.env.GCP_CLIENT_EMAIL,
    projectId: process.env.GCP_PROJECT_ID,
    privateKey: process.env.GCP_PRIVATE_KEY
  }
});

export default configuration;
