# Deployment Guide for Giftlist Application

This guide provides step-by-step instructions for deploying the Giftlist application on an Ubuntu web server using
Docker Compose.

## Prerequisites

- Ubuntu server (20.04 LTS or newer)
- SSH access to the server
- Git installed on the server
- Docker and Docker Compose installed on the server

## 1. Install Docker and Docker Compose

If Docker and Docker Compose are not already installed on your server, you can install them with the following commands:

```bash
# Update package index
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Add Docker repository
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Update package index again
sudo apt update

# Install Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add your user to the docker group to run Docker without sudo
sudo usermod -aG docker $USER

# Apply the group changes to current terminal session
newgrp docker
```

## 2. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/superlonci/giftlist
cd giftlist
```

## 3. Configure Environment Variables

Create a `.env` file in the project root directory:

```bash
# Create .env file
cat > .env << EOL
# Application encryption key (generate a new one for production)
ENCRYPTION_KEY=generate_a_new_one

# MySQL passwords
MYSQL_ROOT_PASSWORD=generate_a_new_one
MYSQL_PASSWORD=generate_a_new_one
EOL
```

> **Note:** For production, you should generate new secure passwords and encryption key.

## 4. Deploy with Docker Compose

```bash
# Build and start the containers
docker-compose up -d

# Check the logs to monitor the deployment
docker-compose logs -f
```

The application will:

1. Build the Docker image
2. Start the MySQL database
3. Wait for the database to be ready
4. Run Prisma migrations
5. Seed the database with initial data
6. Start the application

## 6. Access the Application

Once deployed, the application will be available at:

```
http://your-server-ip:3000
```

## 7. Deployment Script (Optional)

For convenience, you can create a deployment script:

```bash
# Create deployment script
cat > deploy.sh << 'EOL'
#!/bin/bash

# Pull latest changes
git pull

# Build and start containers
docker-compose down
docker-compose up --build -d

# Show logs
docker-compose logs -f
EOL

# Make the script executable
chmod +x deploy.sh
```

You can then run `./deploy.sh` to update and redeploy the application.

## Troubleshooting

### Database Connection Issues

If the application cannot connect to the database:

```bash
# Check if MySQL container is running
docker-compose ps

# Check MySQL logs
docker-compose logs db

# Connect to MySQL to verify databases
docker-compose exec db mysql -u root -p
# Enter the MYSQL_ROOT_PASSWORD when prompted
# Then run:
SHOW DATABASES;
```

### Application Issues

```bash
# Check application logs
docker-compose logs app

# Access the application container
docker-compose exec app sh
```

## Maintenance

### Backup Database

```bash
# Create a backup
docker-compose exec db sh -c 'exec mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" giftlist' > backup.sql
```

### Restore Database

```bash
# Restore from backup
cat backup.sql | docker-compose exec -T db sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" giftlist'
```

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build
```
