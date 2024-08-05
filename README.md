# Fetch-Rewards-API

This Node-App contains two endpoints as  mentioned

1. /receipts/process

2. /receipts/{id}/points

**To start the application**

Prerequisites: docker installed

Docker commands to start the application

1. docker build -t fetch-rewards-app .  (Make sure to be in the Node-App folder where the Dockerfile is located)

2. docker run -p 8088:8088 fetch-rewards-app (You will see a message saying that Server running on PORT)

To close the server

1. Use command "docker ps" to get all running containers

2. Copy the id from the container and use in "docker stop {id}"