# How to Find Your Google Cloud Project

## Problem: "My project doesn't show in Google Cloud Console"

### Quick Solution: Access via Firebase Console

**This is the EASIEST and MOST RELIABLE method:**

1. Go to Firebase Console:
   https://console.firebase.google.com/project/my-chart-app-a6f67/settings/general

2. Click on the "Service accounts" tab at the top

3. Click any link that mentions "Google Cloud Platform" or "Manage permissions"

4. Your project will automatically be selected in Google Cloud Console

---

## Troubleshooting: Can't Find Project in Google Cloud Console

### Check 1: Verify You're Using the Correct Google Account

1. Look at the top-right corner of Google Cloud Console
2. Check the email address shown
3. Make sure it's the SAME account you used to create your Firebase project
4. If wrong account → Click your profile picture → "Add another account"

### Check 2: Search All Projects (Not Just Recent)

1. Click the project dropdown at the top
2. Click the "ALL" tab (not "RECENT")
3. Type in search box: `my-chart-app-a6f67`
4. Look through all results

### Check 3: Check All Organizations

1. In the project selector popup
2. Scroll to the bottom
3. Click "SHOW ALL ORGANIZATIONS"
4. Search again for: `my-chart-app-a6f67`

### Check 4: Verify Project Exists in Firebase

1. Go to: https://console.firebase.google.com/
2. Can you see "my-chart-app-a6f67" in your Firebase projects?
3. If YES → The Google Cloud project exists, use Method 1 above
4. If NO → You might be using a different Google account

---

## Once You Find Your Project: Navigate to OAuth Consent Screen

### Path in Google Cloud Console:

```
☰ Hamburger Menu (top left)
    ↓
APIs & Services
    ↓
OAuth consent screen
```

### Or use this direct link (after selecting your project):

https://console.cloud.google.com/apis/credentials/consent

---

## For Localhost Testing: You DON'T Need OAuth Consent Screen!

**Just enable Google sign-in in Firebase:**

1. Go to: https://console.firebase.google.com/project/my-chart-app-a6f67/authentication/providers

2. Click "Google" → Toggle "Enable" → Save

3. Test on localhost - it will work!

4. When you see "This app isn't verified" warning:
   - Click "Advanced"
   - Click "Go to MyChart (unsafe)"
   - This is normal for development!

---

## When You DO Need OAuth Consent Screen:

You only need to configure this when:

- ✅ Deploying to production domain
- ✅ Allowing non-test users to sign in
- ✅ Removing the "unverified app" warning
- ✅ Publishing your app publicly

For local development, skip it!

---

## Quick Reference: All Important URLs

**Firebase Console:**
- Main: https://console.firebase.google.com/project/my-chart-app-a6f67
- Authentication: https://console.firebase.google.com/project/my-chart-app-a6f67/authentication/providers
- Settings: https://console.firebase.google.com/project/my-chart-app-a6f67/settings/general

**Google Cloud Console:**
- Main: https://console.cloud.google.com/
- OAuth Consent: https://console.cloud.google.com/apis/credentials/consent?project=my-chart-app-a6f67

---

## Project Details

- **Project ID:** my-chart-app-a6f67
- **Auth Domain:** my-chart-app-a6f67.firebaseapp.com
- **Firebase Console:** https://console.firebase.google.com/project/my-chart-app-a6f67
