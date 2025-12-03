# Google Authentication Setup Guide

## Prerequisites
1. Google Cloud Console account
2. A Google OAuth 2.0 Client ID

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `http://localhost:3000` (if using different port)
   - Add authorized redirect URIs:
     - `http://localhost:5173` (for development)
   - Copy the **Client ID**

## Step 2: Configure Environment Variables

### Frontend (.env file in `sample frontend/`)
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Backend (.env file in `backend/`)
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Step 3: Install Dependencies

### Frontend
```bash
cd "sample frontend"
npm install @react-oauth/google
```

### Backend
```bash
cd backend
npm install google-auth-library
```

## Step 4: Test the Implementation

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd "sample frontend"
   npm run dev
   ```

3. Navigate to the login page and click "Continue with Google"
4. You should be redirected to Google's login page
5. After successful authentication, you'll be logged in

## Troubleshooting

### Common Issues:

1. **"Invalid client" error**
   - Check that GOOGLE_CLIENT_ID matches in both frontend and backend
   - Ensure the Client ID is correct in Google Cloud Console

2. **"Redirect URI mismatch"**
   - Add your frontend URL to authorized redirect URIs in Google Cloud Console
   - Make sure the URL matches exactly (including http/https and port)

3. **"Access blocked"**
   - If testing locally, you may need to add your email as a test user in Google Cloud Console
   - Go to "OAuth consent screen" > "Test users" and add your email

4. **Token verification fails**
   - Ensure GOOGLE_CLIENT_ID is set in backend .env
   - Check that the token is being sent correctly from frontend

## Security Notes

- Never commit your .env files to version control
- Use different Client IDs for development and production
- In production, use HTTPS and update authorized origins/redirects accordingly
- Regularly rotate your OAuth credentials




