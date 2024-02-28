
# Simple Node.js Express API with Login, Signup, File Upload, and Preview

## Currently in Development

### Project Description:

This is a basic web application developed using Node.js and Express.js, providing essential features such as user authentication (login and signup), file upload functionality, and file preview. The project aims to serve as a foundation for developers looking to build lightweight web applications with fundamental user management and file handling capabilities.

### Key Features:

[ ```User Authentication``` ]
- Simple and secure user registration (signup) and authentication (login) system.
- Utilizes JWT (JSON Web Tokens) for secure user authentication.
  - JWTs are stateless, reducing the need for storing user sessions on the server.
  - Provides a secure and efficient way to verify the authenticity of users.

[ ```File Upload``` ]
- Users can upload files through a user-friendly interface.
- Supported file types include various formats for versatility.

[ ```File Preview``` ]
- Implemented file preview functionality to allow users to preview uploaded files before finalizing.

[ ```Security Measures``` ]
- [ ```JWT Token Authentication``` ]
  - Utilizes JWT tokens to authenticate users securely.
  - Provides a secure and scalable authentication mechanism.

- [ ```Encryption``` ]
  - Implements encryption techniques to secure sensitive data during transmission.
  - Ensures the confidentiality of data exchanged between the client and the server.

- [ ```Hashing``` ]
  - Utilizes hashing algorithms to securely store and manage user passwords.
  - Enhances password security by storing only the hash, not the actual password.

### Tech Stack:

- [ ```Node.js``` ] Server-side JavaScript runtime.
- [ ```Express.js``` ] Web application framework for Node.js, providing a robust set of features.
- [ ```Other Dependencies``` ] Utilizes additional libraries for user authentication, file handling, and form processing.

### Getting Started:
1. Clone the repository.
   ```bash
   git clone https://github.com/Mrxscropionx7812/simple7812.git
   
2.Install dependencies using npm.
   ```bash
   npm install
  ```
### Configure Database and Environment Variables:

#### MySQL Configuration:

1. [ ```Database Setup``` ]
   - Ensure you have MySQL installed on your machine.
   - Create a new database named `stonescroll`.
   - Import the SQL dump file  [ `stonescrolldump.sql` ] provided in the project's root directory to set up the [ `strce` ] table with sample data.

   ```bash
   mysql -u your-username -p stonescroll < stonescrolldump.sql
   ```
#### MongoDB Configuration:

1.Ensure you have MongoDB installed on your machine.


2.Create a new database named [ `stonescroll` ].

### HTTP Status Codes:

* [ ```200 OK``` ] The request was successful.
* [ ```201 Created``` ] The request has been fulfilled, and a new resource has been created.
* [ ```204 No Content``` ] The server successfully processed the request but there is no content to send in the response.
* [ ```400 Bad Request``` ] The server cannot or will not process the request due to a client error.
* [ ```401 Unauthorized``` ] The request has not been applied because it lacks valid authentication credentials for the target resource.
* [ ```403 Forbidden``` ] The server understood the request but refuses to authorize it.
* [ ```404 Not Found``` ] The requested resource could not be found.
* [ ```405 Method Not Allowed``` ] The method specified in the request is not allowed for the resource identified by the request URI.
* [ ```422 Unprocessable Entity``` ] The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
* [ ```500 Internal Server Error``` ] A generic error message returned when an unexpected condition was encountered on the server.
* [ ```502 Bad Gateway``` ] The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.
* [ ```503 Service Unavailable``` ] The server is not ready to handle the request. Common causes include a server that is down for maintenance or that is overloaded.



### ENDPOINTS:

* **Signup:**
  - Endpoint: `/home/signup`
  - Method: `POST`
  - Description: Used for user registration and account creation.

* **Login:**
  - Endpoint: `/home/login`
  - Method: `POST`
  - Description: Handles user authentication and login.

* **File Upload:**
  - Endpoint: `/home/upload`
  - Method: `POST`
  - Description: Allows users to upload files to the server.

* **Get Document:**
  - Endpoint: `/home/getdoc`
  - Method: `POST`
  - Description: Retrieves information about a specific document.
  - Query Parameters:
    - `docname`: (Optional) Specifies the name of the document to retrieve. Example: `?docname=ss_2001386585.jpeg`
    - `noofdocs`: (Optional) Number of image to retrieve. Example: `?noofdocs=5`
    - if the parm `empty` it return all images

Feel free to modify the descriptions, methods, and additional details based on the actual functionality and requirements of your API.
