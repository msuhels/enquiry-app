#!/bin/bash

# Initialize Let's Encrypt SSL certificates for Docker deployment
# This script should be run ONCE on initial deployment

set -e

# Configuration
DOMAIN="italycoursefinder.com"
EMAIL="studyeuroindore@gmail.com"  
STAGING=0  # Set to 1 for testing, 0 for production

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Let's Encrypt SSL Certificate Setup ===${NC}"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: docker-compose is not installed${NC}"
    exit 1
fi

# Use either docker-compose or docker compose
COMPOSE_CMD="docker compose"
if ! docker compose version &> /dev/null; then
    COMPOSE_CMD="docker-compose"
fi

# Check if certificates already exist
if [ -d "certbot/conf/live/$DOMAIN" ]; then
    echo -e "${YELLOW}Certificates already exist for $DOMAIN${NC}"
    read -p "Do you want to replace them? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting..."
        exit 0
    fi
    echo "Removing existing certificates..."
    sudo rm -rf certbot/conf/live/$DOMAIN
    sudo rm -rf certbot/conf/archive/$DOMAIN
    sudo rm -rf certbot/conf/renewal/$DOMAIN.conf
fi

# Create required directories
echo "Creating required directories..."
mkdir -p certbot/conf
mkdir -p certbot/www

# Ensure HTTP-only nginx config is in place
echo "Ensuring HTTP-only nginx configuration..."
if [ ! -f "nginx/nginx.conf" ]; then
    echo -e "${RED}Error: nginx/nginx.conf not found${NC}"
    exit 1
fi

# Start services with HTTP-only configuration
echo "Starting services..."
$COMPOSE_CMD up -d nginx nextjs

# Wait for nginx to be ready
echo "Waiting for nginx to start..."
sleep 5

# Test if nginx is responding
if ! curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|301\|302"; then
    echo -e "${YELLOW}Warning: Nginx may not be responding correctly${NC}"
fi

# Determine staging flag
STAGING_FLAG=""
if [ $STAGING -eq 1 ]; then
    STAGING_FLAG="--staging"
    echo -e "${YELLOW}Using Let's Encrypt STAGING environment (for testing)${NC}"
fi

# Request certificate
echo ""
echo "Requesting SSL certificate for $DOMAIN..."
echo "This may take a minute..."

$COMPOSE_CMD run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    $STAGING_FLAG \
    -d $DOMAIN \
    -d www.$DOMAIN

# Check if certificate was obtained successfully
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ SSL certificate obtained successfully!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Replace nginx/nginx.conf with nginx/nginx-ssl.conf (or update manually)"
    echo "2. Restart nginx: $COMPOSE_CMD restart nginx"
    echo ""
    echo "Commands:"
    echo "  cp nginx/nginx-ssl.conf nginx/nginx.conf"
    echo "  $COMPOSE_CMD restart nginx"
else
    echo ""
    echo -e "${RED}✗ Failed to obtain SSL certificate${NC}"
    echo "Common issues:"
    echo "  - Domain DNS not pointing to this server"
    echo "  - Firewall blocking port 80"
    echo "  - Domain not registered or active"
    echo ""
    echo "Check certbot logs: $COMPOSE_CMD logs certbot"
    exit 1
fi

echo ""
echo -e "${GREEN}=== Setup Complete ===${NC}"