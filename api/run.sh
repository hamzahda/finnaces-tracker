#!/bin/bash
# Current status
echo "Starting run.sh"
date
echo "Current directory:"
pwd

# Install npm packages
echo "Installing required npm packages"
npm install
echo "npm packages installed"

# Build application
echo "Building api"
npm run build

# Run the application
echo "Starting api"
npm run server

# Keep container running
tail -f /dev/null
