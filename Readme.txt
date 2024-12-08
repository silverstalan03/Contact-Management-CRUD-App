========== Contact Management System - Installation & Deployment Guide ==========

Project Details:
----------------
Author: Silver Stalan Inbaraj
Application URL: http://34.244.187.51/
GitHub Repository: https://github.com/silverstalan03/Contact-Management-CRUD-App.git

Technology Stack:
----------------
- Frontend: React.js
- Backend: Express.js, Node.js
- Database: MongoDB
- CI/CD: Jenkins
- Code Quality: SonarQube
- Containerization: Docker
- Cloud Platform: AWS EC2
- Web Server: Nginx

Local Development Setup:
-----------------------
1. Clone the repository:
   git clone https://github.com/silverstalan03/Contact-Management-CRUD-App.git
   cd Contact-Management-CRUD-App

2. Install dependencies:
   Backend:
   cd backend
   npm install

   Frontend:
   cd frontend
   npm install

3. Configure environment:
   Backend (.env):
   MONGODB_URI=mongodb://localhost:27017/contacts
   PORT=5002

   Frontend (.env):
   REACT_APP_API_URL=http://34.244.187.51:5002/api

4. Start the application:
   Backend: npm start
   Frontend: npm start

Docker Deployment:
-----------------
1. Build and run containers:
   docker-compose up --build

2. Access the application:
   Frontend: http://localhost:3000
   API: http://localhost:5002

CI/CD Pipeline Setup:
--------------------
1. Jenkins Configuration:
   - Configure GitHub webhook
   - Set up build triggers
   - Configure SonarQube integration
   - Set up Docker build stage
   - Configure AWS deployment

2. SonarQube Setup:
   - Install SonarQube Scanner
   - Configure quality gates
   - Set up code analysis rules

AWS Deployment:
--------------
1. EC2 Configuration:
   - Instance type: t2.micro
   - Security group: Ports 80, 22, 5002
   - Install Docker and Docker Compose

2. Nginx Configuration:
   - Configure reverse proxy
   - Set up port forwarding

Features:
---------
- Create, Read, Update, Delete contacts
- Responsive design
- Real-time updates
- Automated deployment
- Code quality monitoring
- Containerized architecture

Maintenance:
-----------
- Monitor Jenkins builds
- Check SonarQube reports
- Review application logs
- Backup MongoDB data