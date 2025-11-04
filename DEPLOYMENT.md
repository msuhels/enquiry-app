# 🚀 Deployment Guide --- Next.js App with Nginx & Certbot (Ubuntu Server)

This guide explains how to deploy your **Next.js application** inside
Docker, using **Nginx** and **Certbot** installed on the host for HTTPS.

---

## 🧩 Overview

**Architecture**

    Internet
       ↓
    Nginx (on host, handles SSL + reverse proxy)
       ↓
    Next.js App (Docker container, runs on port 3000)

---

## 1️⃣ Update Server and Install Prerequisites

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl ufw git
```

Allow firewall access:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## 2️⃣ Install Docker and Docker Compose

Follow the **official Docker installation** instructions:

```bash
# Install Docker using official script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Enable and start Docker
sudo systemctl enable docker
sudo systemctl start docker

# Verify Docker installation
docker --version
```

Install **Docker Compose Plugin** (official method):

```bash
sudo apt-get install docker-compose-plugin -y
docker compose version
```

---

## 3️⃣ Clone Your Repository

```bash
cd ~
git clone https://github.com/msuhels/enquiry-app.git enquiry-app
cd enquiry-app
```

Make sure your `docker-compose.yml` file is configured properly.

---

## 4️⃣ Install and Configure Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

Check Nginx status:

```bash
sudo systemctl status nginx
```

### Create Nginx site configuration

```bash
sudo nano /etc/nginx/sites-available/italycoursefinder.com
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name italycoursefinder.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and test configuration:

```bash
sudo ln -s /etc/nginx/sites-available/italycoursefinder.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Verify it's serving HTTP:

```bash
curl http://italycoursefinder.com
```

---

## 5️⃣ Run the Dockerized Next.js App

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

Your app should now be accessible at:\
👉 http://italycoursefinder.com

---

## 6️⃣ Install Certbot and Enable HTTPS

```bash
sudo apt install certbot python3-certbot-nginx -y
```

Issue the SSL certificate:

```bash
sudo certbot --nginx -d italycoursefinder.com
```

Certbot will automatically: - Obtain certificates - Update Nginx
configuration - Reload Nginx

Verify success:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Now visit your website securely:\
👉 **https://italycoursefinder.com**

---

## 7️⃣ Test SSL Auto-Renewal

```bash
sudo certbot renew --dry-run
```

Certbot will handle renewals automatically using a system timer.

---

## ✅ Final Checks

```bash
sudo nginx -t
sudo systemctl status nginx
sudo docker ps
sudo certbot certificates
```

---

## 🧾 Summary

Component Runs on Purpose

---

Nginx Host (Ubuntu) Reverse proxy + SSL
Certbot Host Manages HTTPS certificates
Next.js App Docker container Serves app on port 3000
Docker Compose Host Manages container stack

---

**Deployment Completed Successfully 🎉**
