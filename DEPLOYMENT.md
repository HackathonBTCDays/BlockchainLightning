# Deployment Guide

This guide covers deploying the Lightning Certificate system to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Mobile App Deployment](#mobile-app-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Cloud Platform Deployment](#cloud-platform-deployment)
6. [Production Checklist](#production-checklist)

## Prerequisites

Before deploying to production:

- [ ] Valid LNbits production instance or API keys
- [ ] Domain name and SSL certificate
- [ ] Cloud hosting account (AWS, DigitalOcean, Heroku, etc.)
- [ ] Production database (MongoDB or PostgreSQL)
- [ ] Monitoring and logging setup
- [ ] Backup strategy

## Backend Deployment

### Option 1: Docker Deployment

#### 1. Build Docker Image

```bash
cd backend
docker build -t lightning-certificate-backend .
```

#### 2. Run Container

```bash
docker run -d \
  --name lightning-backend \
  -p 3000:3000 \
  -e LNBITS_URL=https://your-lnbits-instance.com \
  -e LNBITS_ADMIN_KEY=your_admin_key \
  -e LNBITS_INVOICE_KEY=your_invoice_key \
  -e NODE_ENV=production \
  lightning-certificate-backend
```

#### 3. Using Docker Compose

```bash
# From project root
docker-compose up -d
```

### Option 2: Manual Deployment

#### 1. Prepare Server

```bash
# Install Node.js on Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Clone and Setup

```bash
git clone https://github.com/HackathonBTCDays/BlockchainLightning.git
cd BlockchainLightning/backend
npm install --production
```

#### 3. Configure Environment

```bash
cp .env.example .env
nano .env
```

Set production values:
```env
PORT=3000
NODE_ENV=production
LNBITS_URL=https://your-production-lnbits.com
LNBITS_ADMIN_KEY=your_production_admin_key
LNBITS_INVOICE_KEY=your_production_invoice_key
BITCOIN_NETWORK=mainnet
```

#### 4. Start with PM2

```bash
pm2 start src/index.js --name lightning-backend
pm2 save
pm2 startup
```

#### 5. Setup Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### 6. Enable SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Option 3: Platform-as-a-Service Deployment

#### Heroku

1. Install Heroku CLI
```bash
npm install -g heroku
```

2. Login and Create App
```bash
heroku login
heroku create lightning-certificate-api
```

3. Configure Environment Variables
```bash
heroku config:set LNBITS_URL=https://your-lnbits.com
heroku config:set LNBITS_ADMIN_KEY=your_key
heroku config:set LNBITS_INVOICE_KEY=your_key
heroku config:set NODE_ENV=production
```

4. Deploy
```bash
git push heroku main
```

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build command: `npm install`
3. Configure run command: `npm start`
4. Set environment variables in dashboard
5. Deploy

#### AWS Elastic Beanstalk

1. Install EB CLI
```bash
pip install awsebcli
```

2. Initialize EB
```bash
cd backend
eb init -p node.js lightning-certificate-api
```

3. Create Environment
```bash
eb create production
```

4. Set Environment Variables
```bash
eb setenv LNBITS_URL=https://your-lnbits.com
eb setenv LNBITS_ADMIN_KEY=your_key
eb setenv LNBITS_INVOICE_KEY=your_key
```

5. Deploy
```bash
eb deploy
```

## Mobile App Deployment

### iOS Deployment (TestFlight & App Store)

#### 1. Prerequisites

- Apple Developer Account ($99/year)
- Xcode installed on macOS
- App Store Connect access

#### 2. Configure App

Update `mobile/src/config/config.js`:
```javascript
export const API_BASE_URL = 'https://api.yourdomain.com/api';
```

#### 3. Build for iOS

```bash
cd mobile
npm install

# Install iOS dependencies
cd ios
pod install
cd ..

# Build release version
npm run build:ios
```

#### 4. Archive and Upload

1. Open project in Xcode
2. Select "Any iOS Device" as target
3. Product → Archive
4. Upload to App Store Connect
5. Submit for review

#### 5. TestFlight Beta Testing

1. Upload build to App Store Connect
2. Enable TestFlight
3. Add beta testers
4. Send invitations

### Android Deployment (Google Play)

#### 1. Prerequisites

- Google Play Developer Account ($25 one-time)
- Android Studio installed
- Signing key generated

#### 2. Generate Signing Key

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore lightning-certificate.keystore \
  -alias lightning-certificate-key \
  -keyalg RSA -keysize 2048 -validity 10000
```

#### 3. Configure Gradle

Edit `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('lightning-certificate.keystore')
            storePassword 'your-password'
            keyAlias 'lightning-certificate-key'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

#### 4. Build Release APK

```bash
cd mobile/android
./gradlew assembleRelease
```

APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

#### 5. Upload to Google Play

1. Go to Google Play Console
2. Create new app
3. Upload APK/AAB
4. Fill in store listing
5. Submit for review

### Expo Deployment (Alternative)

If using Expo:

```bash
npm install -g eas-cli
eas login
eas build --platform all
eas submit --platform ios
eas submit --platform android
```

## Docker Deployment

### Full Stack with Docker Compose

1. Create `.env` file in project root:
```env
LNBITS_URL=https://your-lnbits.com
LNBITS_ADMIN_KEY=your_admin_key
LNBITS_INVOICE_KEY=your_invoice_key
BITCOIN_NETWORK=mainnet
```

2. Start all services:
```bash
docker-compose up -d
```

3. Check logs:
```bash
docker-compose logs -f backend
```

4. Stop services:
```bash
docker-compose down
```

### Production Docker Setup

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  backend:
    image: your-registry/lightning-backend:latest
    restart: always
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    volumes:
      - certificates:/app/certificates
    networks:
      - app-network
    
  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  certificates:
```

## Cloud Platform Deployment

### AWS Deployment

#### Using EC2

1. Launch EC2 instance (Ubuntu 20.04)
2. SSH into instance
3. Install Docker and Docker Compose
4. Clone repository
5. Configure environment
6. Run with Docker Compose

#### Using ECS (Container Service)

1. Build and push Docker image to ECR
2. Create task definition
3. Create ECS service
4. Configure load balancer
5. Set up CloudWatch monitoring

### Google Cloud Platform

1. Create GCP project
2. Enable Cloud Run
3. Build container image
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/lightning-backend
```
4. Deploy to Cloud Run
```bash
gcloud run deploy lightning-backend \
  --image gcr.io/PROJECT-ID/lightning-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Microsoft Azure

1. Create Azure Container Instance
2. Build and push to Azure Container Registry
3. Deploy container
4. Configure custom domain
5. Enable Application Insights

## Production Checklist

### Security

- [ ] HTTPS enabled (SSL/TLS)
- [ ] Environment variables secured
- [ ] API authentication implemented
- [ ] Rate limiting configured
- [ ] CORS properly restricted
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] Secrets not in version control

### Performance

- [ ] Database indexes created
- [ ] Caching implemented (Redis)
- [ ] CDN for static assets
- [ ] Load balancing configured
- [ ] Horizontal scaling ready
- [ ] Connection pooling
- [ ] Compression enabled

### Monitoring

- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic/DataDog)
- [ ] Uptime monitoring (Pingdom/UptimeRobot)
- [ ] Log aggregation (ELK/Papertrail)
- [ ] Alerts configured
- [ ] Health checks implemented

### Database

- [ ] Production database configured
- [ ] Backup strategy implemented
- [ ] Migration scripts tested
- [ ] Connection string secured
- [ ] Replication configured (if needed)

### Backup & Recovery

- [ ] Automated backups scheduled
- [ ] Backup retention policy defined
- [ ] Disaster recovery plan documented
- [ ] Recovery tested regularly

### Documentation

- [ ] API documentation updated
- [ ] Deployment runbook created
- [ ] Troubleshooting guide written
- [ ] Architecture diagram current

### Testing

- [ ] All tests passing
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Penetration testing done

### Operations

- [ ] CI/CD pipeline configured
- [ ] Rollback procedure documented
- [ ] On-call rotation setup
- [ ] Incident response plan ready

## Post-Deployment

### Monitoring Commands

```bash
# Check backend health
curl https://api.yourdomain.com/health

# View PM2 logs
pm2 logs lightning-backend

# View Docker logs
docker logs lightning-backend

# Check system resources
htop
df -h
```

### Maintenance

```bash
# Update application
git pull origin main
npm install
pm2 restart lightning-backend

# Database backup
mongodump --uri="mongodb://..." --out=/backup/

# Certificate renewal (Let's Encrypt)
sudo certbot renew
```

### Scaling

When traffic increases:

1. **Vertical Scaling**: Upgrade server resources
2. **Horizontal Scaling**: Add more instances
3. **Database Scaling**: Add read replicas
4. **Caching**: Implement Redis
5. **CDN**: Use CloudFlare or similar

## Troubleshooting

### Backend Won't Start
- Check logs: `pm2 logs` or `docker logs`
- Verify environment variables
- Check port availability
- Verify database connection

### High Memory Usage
- Increase server RAM
- Optimize code
- Implement caching
- Check for memory leaks

### Slow Response Times
- Enable caching
- Optimize database queries
- Use CDN for static assets
- Implement load balancing

### Database Connection Issues
- Check connection string
- Verify firewall rules
- Check database server status
- Verify credentials

## Support

For deployment issues:
1. Check logs first
2. Review documentation
3. Search GitHub issues
4. Open new issue with details

## Additional Resources

- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Native Deployment Guide](https://reactnative.dev/docs/signed-apk-android)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Docker Documentation](https://docs.docker.com/)
- [Let's Encrypt](https://letsencrypt.org/)

---

Remember to test thoroughly in staging before deploying to production!
