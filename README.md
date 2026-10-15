NeoFEED — Neonatal Feeding Readiness Prediction Platform
NeoFEED is a full-stack prototype designed to support neonatal feeding-readiness monitoring by combining sensor readings, machine-learning-based prediction, cardiopulmonary stability checks, and a real-time dashboard.
The platform provides a central interface for viewing neonatal sensor data, estimating a feeding-readiness score, and surfacing potential stability alerts. It is intended for research and demonstration purposes—not as a substitute for clinical assessment or a validated medical device.
Table of Contents
- Overview
- Key Features
- System Architecture
- Technology Stack
- Data Flow
- Machine Learning
- Database Design
- API Endpoints
- Project Structure
- Local Setup
- Environment Variables
- Running the Application
- Deployment
- Security and Limitations
- Future Improvements
Overview
Feeding readiness in newborns can depend on multiple physiological and oral-motor indicators. NeoFEED brings selected indicators together in one interface and demonstrates how a software platform can process sensor data, generate a model-based score, and communicate updates to a dashboard.
The prototype consists of:
1. React frontend — login, sensor monitoring, prediction, and hospital dashboard interfaces.
2. Flask backend — REST API endpoints, authentication, data processing, prediction, and stability checks.
3. Machine-learning component — an Ordinary Least Squares (OLS) regression model that estimates a POFRAS-related score from selected inputs.
4. Real-time communication — Flask-SocketIO for pushing sensor updates and alerts to connected clients.
5. PostgreSQL database — SQLAlchemy models for users, vitals, predictions, and alerts.
6. Sensor data source — a CSV file used by the prototype's sensor-streaming workflow.
Key Features
- Authentication: Login endpoint with password-hash verification and JWT-based authentication.
- Sensor monitoring: View heart rate, SpO₂, suction pressure, tongue motion, and lip-compression readings.
- Readiness prediction: Estimate a POFRAS-related score from sensor features.
- Stability checks: Evaluate readings against configured prototype thresholds and generate potential alerts.
- Real-time updates: Send sensor updates and alerts to the frontend using Socket.IO.
- Hospital dashboard: Display multiple neonates and navigate to an individual neonate's dashboard.
- REST APIs: Retrieve data and request prediction or dataset-processing operations.
- Persistent data model: SQLAlchemy models for users, infant vitals, predictions, and alerts.
Important: Stability thresholds and model outputs are prototype features. They have not been established here as clinically validated decision rules.

System Architecture
```mermaid
flowchart LR
    U[Doctor / Nurse / Parent] --> FE

    subgraph Frontend["Frontend — React"]
        FE[Login and Routing]
        SM[Sensor Monitoring]
        PR[Prediction Page]
        HD[Hospital Dashboard]
        FE --> SM
        FE --> PR
        FE --> HD
    end

    subgraph Backend["Backend — Flask / Python"]
        API[REST API Endpoints]
        AUTH[JWT Authentication]
        BL[Business Logic]
        ML[OLS Readiness Model]
        ST[Stability Checks and Alerts]
        RT[Flask-SocketIO Stream]
        ORM[SQLAlchemy]
        API --> AUTH
        API --> BL
        BL --> ML
        BL --> ST
        RT --> BL
        BL --> ORM
    end

    CSV[(CSV Sensor Data)] --> RT
    FE <-->|HTTP requests and JSON responses| API
    RT -->|Real-time sensor updates and alerts| FE
    ORM <--> DB[(PostgreSQL)]
```
Deployment layout
- Frontend: Vercel
- Backend: Render
- Database: Azure Database for PostgreSQL
- Local development: React and Flask can run locally; the database URL determines which PostgreSQL instance is used.
These are the intended deployment targets. Confirm the environment variables and deployed service configuration to determine which services are active in a particular environment.
Technology Stack
Layer	Technologies
Frontend	React, JavaScript, HTML, CSS
API communication	Axios, REST, JSON
Real-time communication	Socket.IO client, Flask-SocketIO
Backend	Python, Flask
Authentication	JWT, bcrypt password verification
Data processing	Pandas, NumPy
Machine learning	scikit-learn / OLS regression
ORM and database	Flask-SQLAlchemy, PostgreSQL
Hosting	Vercel, Render, Azure Database for PostgreSQL


Data Flow
1. Login and authentication
1. A user enters credentials in the React login page.
2. The frontend sends a request to POST /api/login.
3. Flask retrieves the user record from the database and verifies the password hash.
4. On success, the backend returns a JWT and relevant user information.
5. The frontend stores the authentication information and attaches the token to protected API requests.
2. Sensor monitoring and real-time updates
1. The backend reads sensor rows from the configured CSV data source.
2. Sensor readings are processed by the backend.
3. The backend calculates a readiness estimate and runs configured stability checks.
4. Flask-SocketIO emits events such as sensor_update and, when applicable, critical_alert.
5. The React frontend listens for these events and updates the dashboard.
3. Individual neonate dashboard
1. A clinician selects a neonate from the hospital dashboard.
2. React navigates to a route such as /dashboard/INF001.
3. The dashboard extracts the neonate ID from the route.
4. The frontend requests the corresponding data from the backend.
5. The backend should authenticate the user and verify that the user is authorized to access that neonate's data before returning it.
4. Persistence
The SQLAlchemy models define tables for users, infant vitals, predictions, and alerts. Defining a model does not automatically persist every streamed reading. The sensor-streaming code must explicitly create database records and commit them for those readings to be stored. Verify that this write path is enabled in your current deployment.
Machine Learning
NeoFEED uses an Ordinary Least Squares (OLS) regression model to estimate a POFRAS-related readiness score from the following features:
Feature	Description
Heart rate	Heart rate reading
SpO₂	Peripheral oxygen saturation
Suction pressure	Measured suction pressure
Tongue motion	Tongue-movement feature
Lip compression	Lip-compression force feature


The model produces a numerical estimate. The backend also computes additional summary metrics and applies separate rule-based stability checks.
Model and clinical considerations
- The model's performance depends on the training dataset, data quality, and evaluation methodology.
- A model estimate is not the same as a clinician-confirmed assessment.
- A standard error or prediction interval should not be labelled as model confidence unless the implementation and statistical interpretation justify that label.
- Stability thresholds must be validated with appropriate clinical expertise and evidence before any real-world clinical use.
Database Design
The current SQLAlchemy models define four tables:
Table	Purpose	Example fields
users	User accounts and access metadata	id, username, password, role, ward, infant_id
infant_vitals	Sensor measurements	id, neonate_id, heart_rate, spo2, suction_pressure, tongue_motion, lip_compression, timestamp
predictions	Readiness prediction records	id, neonate_id, prediction, confidence, timestamp
alerts	Potential stability alerts	id, neonate_id, alert_type, message, severity, timestamp


In the current model definitions, neonate_id in infant_vitals, predictions, and alerts is a string field; it is not declared as a database foreign key. A future schema migration could add an infants table and explicit foreign-key constraints.
API Endpoints
The following endpoints are present in the described backend. Check the current source code for request schemas and exact response fields.
Method	Endpoint	Purpose	Authentication
POST	/api/login	Verify credentials and issue a JWT	Public
POST	/api/register	Register a user	Public in the prototype; restrict in production
GET	/api/data/<neonate_id>	Retrieve data for a neonate	JWT required
POST	/api/predict	Request a readiness prediction	JWT required
POST	/api/process-dataset	Process a dataset	JWT required
GET	/api/me	Retrieve the authenticated user's information	JWT required
GET	/	Basic service/health response	Public


Authentication example
For protected endpoints, send the token in the Authorization header:
Authorization: Bearer <JWT_TOKEN>
Example request:
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  "http://localhost:5000/api/data/INF001"
The request and response payloads for prediction and dataset processing depend on the backend implementation.
Project Structure
The exact filenames can differ by branch; a typical layout is:
NeoFEED/
├── backend/
│   ├── app.py                 # Flask application and Socket.IO events
│   ├── auth.py                # Authentication routes
│   ├── config.py              # Environment-based configuration
│   ├── models.py              # SQLAlchemy models
│   ├── utils.py               # Prediction and processing utilities
│   ├── requirements.txt       # Python dependencies
│   └── neonate_data1.csv      # Prototype sensor source, if stored here
└── frontend/
    └── my-dashboard/
        ├── public/
        ├── src/
        │   ├── api.js          # API client and Socket.IO setup
        │   ├── App.js
        │   ├── RoutesConfig.js
        │   └── ...             # Pages and components
        ├── package.json
        └── ...
Local Setup
Prerequisites
- Python 3.10+ (use the version supported by the project's dependencies)
- Node.js and npm
- PostgreSQL, either local or cloud-hosted
- Git
1. Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_DIRECTORY>
Replace the placeholders with the actual repository URL and directory.
2. Configure the backend
cd backend
python -m venv .venv
Activate the virtual environment:
Windows PowerShell
.venv\Scripts\Activate.ps1
Linux / macOS / WSL
source .venv/bin/activate
Install dependencies:
pip install -r requirements.txt
Create a local .env file in the backend directory using the variables below. Make sure the database exists and the configured account has the required permissions.
3. Configure the frontend
In a separate terminal:
cd frontend/my-dashboard
npm install
Set the frontend API base URL using the environment-variable name supported by the project. For Create React App, this is commonly REACT_APP_API_URL; for Vite, it is commonly VITE_API_URL. Ensure api.js actually reads that variable.
4. Initialize the database
Create the configured PostgreSQL database first. If the application defines an init_db() function, ensure it is invoked by the intended development or deployment startup process. Creating SQLAlchemy model classes alone does not create database tables.
Environment Variables
Example backend .env:
SECRET_KEY=replace_with_a_long_random_secret
JWT_SECRET_KEY=replace_with_a_different_long_random_secret
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:5432/neofeed_db
For Azure Database for PostgreSQL, configure TLS according to the server's requirements; a connection URL may use ?sslmode=require.
For the frontend, configure the API base URL with the variable name your build tool uses, for example:
REACT_APP_API_URL=http://localhost:5000
Do not commit .env files, credentials, signing keys, database passwords, or production tokens. If a password contains special characters, URL-encode it in the connection URL.
Running the Application
Start the backend from its configured directory using the command supported by the project. For local development, this may be:
python app.py
Start the frontend in another terminal:
cd frontend/my-dashboard
npm start
If the frontend uses Vite, the development command is commonly:
npm run dev
Use the scripts defined in package.json and the actual backend entry point for your checkout. Open the local frontend URL printed by the development server and verify that its API base URL points to the backend.
Deployment
Frontend — Vercel
1. Import the frontend repository or monorepo into Vercel.
2. Set the project root to the frontend application directory.
3. Configure the build command and output directory according to the framework.
4. Set the production API URL environment variable.
5. Deploy and verify login, API calls, routing, and Socket.IO connectivity.
Backend — Render
1. Connect the backend repository to a Render Web Service.
2. Set the root directory, Python runtime, dependency-install command, and Socket.IO-compatible start command.
3. Configure DATABASE_URL, SECRET_KEY, and JWT_SECRET_KEY as environment variables.
4. Configure HTTP CORS and Socket.IO origins to allow only the intended frontend origin.
5. Check logs and test all protected endpoints after deployment.
The production start command must be compatible with the app's Flask-SocketIO async mode and installed dependencies; confirm it against the current deployment configuration.
Database — Azure Database for PostgreSQL
1. Create or select a PostgreSQL Flexible Server and database.
2. Configure network access and TLS.
3. Set the backend's DATABASE_URL to the Azure connection string.
4. Create or migrate the required tables.
5. Verify database connectivity from the deployed backend without exposing credentials.
Security and Limitations
- Clinical safety: This is a research/demo prototype, not a medical device or clinical decision system.
- Authorization: A valid JWT alone is not sufficient. Enforce role-based access and neonate-level access on the backend for every relevant endpoint.
- Registration: Public registration should not allow arbitrary users to grant themselves doctor or other privileged roles.
- Debug routes: Remove or protect debugging endpoints such as /api/debug-users before production deployment.
- Secrets: Use environment variables or a secrets manager; never commit credentials.
- CORS: Avoid wildcard origins in production when the application is intended for specific frontend domains.
- Data persistence: Confirm that streamed sensor readings, predictions, and alerts are explicitly inserted and committed if persistent history is required.
- Data validation: Validate incoming values, handle missing or invalid readings, and log errors without exposing sensitive information.
- Privacy: Neonatal data is sensitive. Apply least-privilege access, secure transport, retention policies, and appropriate institutional safeguards.
- Model validity: Document the dataset, training procedure, validation results, limitations, and appropriate interpretation before making claims about predictive performance.
Future Improvements
- Add an infants table and proper foreign-key relationships.
- Implement and test role-based access control for doctors, nurses, and parents.
- Persist streamed vitals, predictions, and alerts reliably.
- Add database migrations, automated tests, structured logging, and monitoring.
- Validate and version the ML model with suitable metrics and reproducible training.
- Add explicit data-quality checks and robust handling of sensor disconnections.
- Improve audit trails and access logging for sensitive records.
- Add clinical review and validation before considering any real-world clinical use.
