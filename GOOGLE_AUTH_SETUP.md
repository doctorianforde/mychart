# Google Authentication Setup Guide

## Quick Setup for Development (No OAuth Consent Screen Needed)

### Step 1: Enable Google Sign-In in Firebase Console

1. Open Firebase Console:
   https://console.firebase.google.com/project/my-chart-app-a6f67/authentication/providers

2. Find "Google" in the provider list and click it

3. Toggle the "Enable" switch to ON

4. Select your support email from the dropdown

5. Click "Save"

**That's it for local development!** Google sign-in will work on localhost.

---

## For Production Deployment: Configure OAuth Consent Screen

### Access Google Cloud Console via Firebase:

1. Go to Firebase Console:
   https://console.firebase.google.com/project/my-chart-app-a6f67/settings/general

2. Scroll to "Your apps" section

3. Click "Google Cloud Platform" link

4. You'll be redirected to Google Cloud Console with your project selected

### Configure OAuth Consent Screen:

1. In Google Cloud Console, go to:
   **APIs & Services → OAuth consent screen**

2. User Type: Select "External"

3. App Information:
   - App name: `MyChart by Alera Care Collective`
   - User support email: `[your email]`
   - Developer contact: `office@aleracarecollective.com`

4. Scopes: Click "Save and Continue" (default is fine)

5. Test users: Add your email for testing

6. Click "Back to Dashboard"

---

## Troubleshooting

### "Project not showing in Google Cloud Console"

**Solution:** Access through Firebase Console instead
- Go to Firebase Console → Settings → Project settings
- Look for "Service accounts" or "Google Cloud Platform" link
- Click it to open Google Cloud Console with your project

### "This app isn't verified" warning

**For Development:**
- This is normal for apps in testing mode
- Click "Advanced" → "Go to [app] (unsafe)" to proceed
- Only appears for non-test users

**For Production:**
- Submit your app for verification in Google Cloud Console
- Or keep it in testing mode with authorized test users

### Google sign-in not working

1. Check browser console (F12) for errors
2. Verify you enabled Google provider in Firebase
3. Clear browser cache and cookies
4. Make sure you're using the correct Firebase project

---

## Production Checklist

Before deploying to production:

- [ ] Enable Google provider in Firebase Console
- [ ] Configure OAuth consent screen
- [ ] Add production domain to authorized domains
- [ ] Set app to "In production" mode (or add all users as test users)
- [ ] Test with different Google accounts
- [ ] Add privacy policy and terms of service URLs
- [ ] Consider app verification if going public

---

## Project Details

- **Firebase Project ID:** my-chart-app-a6f67
- **Auth Domain:** my-chart-app-a6f67.firebaseapp.com
- **Console URLs:**
  - Firebase: https://console.firebase.google.com/project/my-chart-app-a6f67
  - Google Cloud: https://console.cloud.google.com/ (select my-chart-app-a6f67)
