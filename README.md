# product-management

**Running project:**
- Clone the repo
- Create and ```.env``` file and copy data from ```.env.example``` or provide your own data.
- Run the app: ```npm run server```
- The application but default create an admin IF NOT FOUND with credentials:
    email: admin@legal-doctrine.com and password: legal123456!

- For the database models, you will find them inside ```database/models``` folder. there are 4 models: 
    - Admin: this model for managing app admins and admin auth.
    - User: this model for managing users with their auth and purchases.
    - Category: a model for managing product categories, enable / disable category.
    - Product: a model for the app products with their name, desc, price, enable and available status.
    - Purchase: a model to manage user purchases with different product for each purchase.

- To use the API, I have made a public Postman documentation available, you can find it here:
  https://documenter.getpostman.com/view/12889252/2s9YCBvVpL

- For the auth, I went with JWT authentication. There are two kind of users (Admin / User).
you will find some parts uses ```onRequest: [fastify.authenticate]``` which is like a middleware to authenticate a normal user. where other places uses ```onRequest: [fastify.authenticateAdmin]``` which authenticate an ADMIN.
- For the ease of use, I have deployed the app to a Railway, which you can use this domain to communicate with:
https://product-management-production-6c59.up.railway.app/