## RoboCaptcha Backend

The backend service for roboCaptcha, providing the server side features using Apollo Server GraphQL and MongoDB database. Notable features include user authentication and management, payment system with Stripe and database methods and management.

### Environment Variables
| Name        | Description                                            |
| ----------- | ------------------------------------------------------ |
| MONGODB_URL | Connection string to establish an instance for MongoDB |
### Local Deployment
```
git clone https://github.com/phomies/robocaptcha-backend.git

npm i
npm run start
```