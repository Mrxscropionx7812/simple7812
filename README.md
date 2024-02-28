# Simple Node.js Express API with Login, Signup, File Upload, and Preview

## Currently in Development

### Project Description:

This is a basic web application developed using Node.js and Express.js, providing essential features such as user authentication (login and signup), file upload functionality, and file preview. The project aims to serve as a foundation for developers looking to build lightweight web applications with fundamental user management and file handling capabilities.

### Key Features:

**User Authentication:**
- Simple and secure user registration (signup) and authentication (login) system.

**File Upload:**
- Users can upload files through a user-friendly interface.
- Supported file types include various formats for versatility.

**File Preview:**
- Implemented file preview functionality to allow users to preview uploaded files before finalizing.

### Tech Stack:

- **Node.js:** Server-side JavaScript runtime.
- **Express.js:** Web application framework for Node.js, providing a robust set of features.
- **Other Dependencies:** Utilizes additional libraries for user authentication, file handling, and form processing.

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

1. **Database Setup:**
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

*   **\033[32m200 OK:\033[0m** The request was successful.
*   **\033[32m201 Created:\033[0m** The request has been fulfilled, and a new resource has been created.
*   **\033[32m204 No Content:\033[0m** The server successfully processed the request but there is no content to send in the response.
*   **\033[31m400 Bad Request:\033[0m** The server cannot or will not process the request due to a client error.
*   **\033[31m401 Unauthorized:\033[0m** The request has not been applied because it lacks valid authentication credentials for the target resource.
*   **\033[31m403 Forbidden:\033[0m** The server understood the request but refuses to authorize it.
*   **\033[31m404 Not Found:\033[0m** The requested resource could not be found.
*   **\033[31m405 Method Not Allowed:\033[0m** The method specified in the request is not allowed for the resource identified by the request URI.
*   **\033[31m422 Unprocessable Entity:\033[0m** The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
*   **\033[31m500 Internal Server Error:\033[0m** A generic error message returned when an unexpected condition was encountered on the server.
*   **\033[31m502 Bad Gateway:\033[0m** The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.
*   **\033[31m503 Service Unavailable:\033[0m** The server is not ready to handle the request. Common causes include a server that is down for maintenance or that is overloaded.

