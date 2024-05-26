# lsvault-server

This is a server application for the LockScript Vault project. It uses Fastify for the server, JWT for authentication, and Mongoose for database operations.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install and run the lsvault-server application, follow these steps:

1. Clone the repository by running the following command in your terminal:
    ```
    git clone https://github.com/LockScript/lsvault-server.git
    ```

2. Navigate to the project directory:
    ```
    cd lsvault-server
    ```

3. Install the dependencies using npm:
    ```
    npm install
    ```

4. Set up your environment variables:
    - Create a `.env` file in the root directory of the project.
    - Specify your database connection string in the `.env` file. For example:
      ```
      DB_CONNECTION_STRING=mongodb://localhost:27017/password-manager
      ```

5. Generate a private and public key pair for JWT:
    - Create a `certs` directory in the root directory of the project.
    - Generate the key pair using a tool like OpenSSL or a library like `jsonwebtoken`.
    - Place the private key in the `certs` directory as `private.key`.
    - Place the public key in the `certs` directory as `public.key`.

6. Start the server in development mode:
    ```
    npm run dev
    ```

The server should now be running on `http://localhost:4000`.

Please note that these instructions assume you have Node.js and MongoDB installed on your system. If not, please install them before proceeding.

## Usage

To start the server in development mode, use the command `npm run dev`.

The server provides API endpoints for user and vault operations. These are defined in the `src/modules/user/` and `src/modules/vault/` directories respectively.

## Roadmap

Here are some cool features we plan to add in the future:

- **Multi-factor authentication**: Enhance security by adding support for multi-factor authentication methods such as SMS verification or authenticator apps.
- **File encryption**: Allow users to securely store and manage encrypted files within their vaults.
- **Sharing and collaboration**: Enable users to share vaults or specific items with other users, allowing for secure collaboration.
- **Audit logs**: Implement a logging system to track and record all user actions within the application for auditing purposes.
- **Browser extensions**: Develop browser extensions for popular web browsers to provide seamless integration with the LockScript Vault.
- **Mobile app**: Create a mobile application for iOS and Android devices, allowing users to access their vaults on the go.
- **OAuth login**: Allow users to login with many different OAuth providers such as Google, Microsoft, Github, etc..

### Urgent

- **Full client-side encryption**: Implement a feature that encrypts all sensitive information on the client-side before it is sent to the server. This ensures that data remains secure even if the server is compromised.

Please note that the urgency of this feature is due to its critical importance in ensuring the security of user data.

We are constantly working on improving the LockScript Vault and adding new features. Stay tuned for updates!

## Contributing

Thank you for considering contributing to the lsvault-server project! We welcome all contributions that help improve the project.

To contribute, please follow these guidelines:

1. Fork the repository and create a new branch for your contribution.
2. Make your changes and ensure that they are well-tested.
3. Update the documentation, if necessary.
4. Commit your changes and push them to your forked repository.
5. Submit a pull request to the main repository.

Please ensure that your pull request adheres to the following guidelines:

- Provide a clear and descriptive title for your pull request.
- Include a detailed description of the changes you have made.
- Make sure your code follows the project's coding conventions and style guide.
- Include relevant tests to validate your changes.
- Ensure that your changes do not introduce any new issues or break existing functionality.

By contributing to this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md). Please review it before making any contributions.

If you have any questions or need further assistance, feel free to reach out to the project maintainers.

We appreciate your contributions and look forward to your pull requests!

## Deployment

To deploy the lsvault-server application to a production environment, follow these steps:

1. Set up a production-ready database:
    - Create a new MongoDB database for the application.
    - Obtain the connection string for the production database.

2. Set up your production environment variables:
    - Specify the production database connection string in the `.env` file. For example:
      ```plaintext
      DB_CONNECTION_STRING=mongodb://production-database-url:27017/password-manager
      ```

3. Generate a new private and public key pair for JWT:
    - Create a new `certs` directory in the root directory of the project.
    - Generate the key pair using a tool like OpenSSL or a library like `jsonwebtoken`.
    - Place the private key in the `certs` directory as `private.key`.
    - Place the public key in the `certs` directory as `public.key`.

4. Build the application for production:
    ```bash
    npm run build
    ```

5. Start the server in production mode:
    ```bash
    npm start
    ```

The server should now be running in a production environment.

Please note that these instructions assume you have a production-ready MongoDB database and the necessary environment variables set up. Make sure to secure your production environment and follow best practices for deploying Node.js applications.

If you have any questions or need further assistance, feel free to reach out to the project maintainers.

## Tech Stack

The lsvault-server application is built using the following technologies:

- Fastify: A fast and low-overhead web framework for Node.js.
- JWT: JSON Web Tokens for authentication and authorization.
- Mongoose: An Object Data Modeling (ODM) library for MongoDB.

These technologies work together to provide a secure and efficient server application for the LockScript Vault project.

# lsvault-server

This project is licensed under the MIT license.