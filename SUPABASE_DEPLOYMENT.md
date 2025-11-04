# Supabase Deployment

This guide walks through **self-hosting Supabase** using Docker and setting up a **reverse proxy with NGINX and SSL** for secure access via a custom domain.

---

## 🧱 Self-Hosting Supabase (Official Steps)

Follow these official Supabase steps to deploy on your server.

```bash
# Get the code
git clone --depth 1 https://github.com/supabase/supabase

# Make your new supabase project directory
mkdir supabase-project

# Tree should look like this
# .
# ├── supabase
# └── supabase-project

# Copy the compose files over to your project
cp -rf supabase/docker/* supabase-project

# Copy the fake env vars
cp supabase/docker/.env.example supabase-project/.env

# Switch to your project directory
cd supabase-project

# Pull the latest images
docker compose pull

# Start the services (in detached mode)
docker compose up -d
```

Once done, Supabase should be running at:

```
http://<your-server-ip>:8000
```

---

## 🌐 Reverse Proxy with NGINX and SSL

After Supabase is running, follow these steps to expose it securely via your own domain.

---

### ⚙️ Step 1: Point Your Domain to the Server

In your DNS provider (e.g., Cloudflare, Namecheap, etc.), create an **A record**:

| Name     | Type | Value                     | TTL  |
| -------- | ---- | ------------------------- | ---- |
| supabase | A    | `<your_server_public_IP>` | Auto |

Once saved, test domain propagation:

```bash
ping supabase.yourdomain.com
```

✅ It should resolve to your server’s IP.

---

### ⚙️ Step 2: Install NGINX + Certbot

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

Check that NGINX is running:

```bash
sudo systemctl status nginx
```

---

### ⚙️ Step 3: Create NGINX Reverse Proxy Config

Let’s assume Supabase runs locally at `http://localhost:8000`.

Create a new NGINX config file:

```bash
sudo nano /etc/nginx/sites-available/supabase.conf
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name supabase.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

Enable the site and reload NGINX:

```bash
sudo ln -s /etc/nginx/sites-available/supabase.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Now check that:

```
http://supabase.yourdomain.com
```

works.

---

### ⚙️ Step 4: Enable SSL (HTTPS)

Use **Let’s Encrypt** via Certbot:

```bash
sudo certbot --nginx -d supabase.yourdomain.com
```

Follow the prompts (email, agreement, etc.).

Certbot automatically updates your config with SSL:

```nginx
listen 443 ssl;
ssl_certificate /etc/letsencrypt/live/supabase.yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/supabase.yourdomain.com/privkey.pem;
```

It will also redirect HTTP → HTTPS automatically.

Test:

```
https://supabase.yourdomain.com
```

---

### ⚙️ Step 5: (Optional) Block Direct IP Access

To prevent users from accessing Supabase directly via IP:port (e.g., `http://<ip>:8000`):

#### **Option A: Using UFW Firewall**

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 8000/tcp
sudo ufw enable
```

Verify:

```bash
sudo ufw status
```

You should see only NGINX ports (80, 443) allowed.

#### **Option B: Restrict Docker Port Binding**

In your `docker-compose.yml`, change:

```yaml
ports:
  - "127.0.0.1:8000:8000"
```

Then restart Supabase:

```bash
docker compose down
docker compose up -d
```

Now, Supabase is accessible only through NGINX (localhost), not directly via public IP.

---

## ✅ Verification

- `https://supabase.yourdomain.com` → ✅ Works
- `http://<your_ip>:8000` → ❌ Blocked
- SSL certificate → ✅ Valid
- Firewall → ✅ Only 80 & 443 open

To check SSL renewal:

```bash
sudo certbot renew --dry-run
```

---

🎉 **You now have a fully self-hosted Supabase instance** with a secure HTTPS reverse proxy using NGINX!

---

# Supabase Backup and Restore Guide

This guide explains how to **back up a Supabase self-hosted database** from one server and **restore it to another server** using Docker.

---

## 🧱 1. Backup Supabase Database (on Source Server)

### 🪣 Step 1. Identify the Database Container

```
supabase-db-ik8cgc0000k0cgggg408ko4k
```

### 🪣 Step 2. Create a Dump (Backup)

Run this command on your **source server**:

```bash
docker exec -t supabase-db-ik8cgc0000k0cgggg408ko4k pg_dump -U postgres -d postgres > supabase_backup.sql
```

✅ This will create a `supabase_backup.sql` file in your **current directory**.

If you want to include all roles, extensions, and schema details (recommended for Supabase):

```bash
docker exec -t supabase-db-ik8cgc0000k0cgggg408ko4k pg_dump -U postgres -Fc -d postgres -f /tmp/supabase_backup.dump
docker cp supabase-db-ik8cgc0000k0cgggg408ko4k:/tmp/supabase_backup.dump .
```

That produces a **compressed dump** (`.dump` file) — better for large databases.

---

## 🧳 2. Transfer Backup to New Server

Copy the backup to your new Supabase server:

```bash
scp supabase_backup.dump username@<new_server_ip>:/root/
```

Or, if you used the `.sql` version:

```bash
scp supabase_backup.sql username@<new_server_ip>:/root/
```

---

## 🧰 3. Restore Backup on Destination Server

### ⚙️ Step 1. Identify New DB Container

On the **destination server**, list your running containers:

```bash
docker ps
```

Find the new Supabase DB container — should look like:

```
supabase-db-xxxxxxx
```

### ⚙️ Step 2. Copy the Backup Into Container

```bash
docker cp /root/supabase_backup.dump supabase-db-xxxxxxx:/tmp/
```

or (if it’s `.sql`):

```bash
docker cp /root/supabase_backup.sql supabase-db-xxxxxxx:/tmp/
```

---

### ⚙️ Step 3. Restore the Database

#### 🟢 Option A: If you used `.dump` file

```bash
docker exec -it supabase-db-xxxxxxx pg_restore -U postgres -d postgres --clean --no-owner /tmp/supabase_backup.dump
```

#### 🟣 Option B: If you used `.sql` file

```bash
docker exec -i supabase-db-xxxxxxx psql -U postgres -d postgres < /root/supabase_backup.sql
```

---

## ✅ 4. Verify the Restore

Once the restore completes successfully, check:

```bash
docker exec -it supabase-db-xxxxxxx psql -U postgres -d postgres -c "\dt"
```

You should see your tables.

Also test your Supabase API — it should now show the same data as your old server.

---

🎉 **You’ve now successfully backed up and restored your Supabase database!**
