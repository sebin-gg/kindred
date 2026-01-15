# MongoDB Setup Guide for Windows

## The Error You're Seeing

The error `connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017` means MongoDB is not running or not accessible on port 27017.

## Solution Steps

### Step 1: Check if MongoDB is Running

1. **Open Services (Windows):**
   - Press `Win + R`
   - Type `services.msc` and press Enter
   - Look for "MongoDB" service
   - If it exists, check if it's "Running"
   - If it's stopped, right-click and select "Start"

2. **Or use Command Prompt (as Administrator):**
   ```bash
   # Check if MongoDB service exists
   sc query MongoDB
   
   # Start MongoDB service
   net start MongoDB
   ```

### Step 2: Verify MongoDB is Listening

Open Command Prompt as Administrator and run:
```bash
netstat -ano | findstr 27017
```

You should see output like:
```
TCP    127.0.0.1:27017        0.0.0.0:0              LISTENING       1234
```

If you don't see this, MongoDB is not running.

### Step 3: Install MongoDB (if not installed)

If MongoDB is not installed:

1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows, MSI installer
   - Download and install

2. **During installation:**
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Check "Run service as Network Service user"
   - Check "Install MongoDB Compass" (optional, but helpful)

3. **After installation:**
   - MongoDB should start automatically
   - Verify in Services that "MongoDB" is running

### Step 4: Alternative - Use MongoDB Atlas (Cloud)

If you prefer not to install MongoDB locally:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kindred?retryWrites=true&w=majority
   ```

### Step 5: Test the Connection

After starting MongoDB, restart your backend server:

```bash
cd kindred-backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
📊 Database: kindred
Server running on http://localhost:5000
```

## Common Issues

### Issue: "MongoDB service won't start"
- Check if port 27017 is already in use by another application
- Check MongoDB logs (usually in `C:\Program Files\MongoDB\Server\<version>\log\`)
- Try running MongoDB manually: `mongod --dbpath "C:\data\db"`

### Issue: "Permission denied"
- Run Command Prompt as Administrator
- Check MongoDB data directory permissions (usually `C:\data\db`)

### Issue: "Connection timeout"
- Make sure Windows Firewall allows MongoDB
- Check if antivirus is blocking MongoDB
- Verify the connection string in `.env` file

## Quick Test

Once MongoDB is running, test the connection:

```bash
# In MongoDB Compass, connect to:
mongodb://127.0.0.1:27017

# Or in Command Prompt:
mongosh mongodb://127.0.0.1:27017
```

If you can connect, your backend should work too!
