# OAuth Consent Screen Configuration Guide

## Step-by-Step Instructions

### Step 1: User Type
- Select: **External**
- Click: **CREATE**

---

### Step 2: OAuth Consent Screen

**Required Fields:**

| Field | Value |
|-------|-------|
| App name | MyChart by Alera Care Collective |
| User support email | [Select your email from dropdown] |
| Developer contact information | office@aleracarecollective.com |

**Optional Fields (can add later):**
- App logo (120x120px recommended)
- Application home page
- Privacy policy link
- Terms of service link

Click: **SAVE AND CONTINUE**

---

### Step 3: Scopes

Default scopes are fine:
- email
- profile
- openid

Click: **SAVE AND CONTINUE** (no changes needed)

---

### Step 4: Test Users

**IMPORTANT:** Only test users can sign in while app is in "Testing" mode.

Add test users:
1. Click **ADD USERS**
2. Enter email addresses (one per line)
3. Click **ADD**

Example test users to add:
```
your-email@gmail.com
office@aleracarecollective.com
staff-member@gmail.com
```

Click: **SAVE AND CONTINUE**

---

### Step 5: Summary

Review your settings.

Click: **BACK TO DASHBOARD**

---

## After OAuth Consent Screen is Configured

### 1. Enable Google Sign-In in Firebase

Go to: https://console.firebase.google.com/project/my-chart-app-a6f67/authentication/providers

1. Click "Google" provider
2. Toggle "Enable" ON
3. Select support email
4. Click "Save"

### 2. Add Production Domain to Authorized Domains

Go to: https://console.firebase.google.com/project/my-chart-app-a6f67/authentication/settings

1. Scroll to "Authorized domains"
2. Click "Add domain"
3. Enter your domain (e.g., `myapp.vercel.app`)
4. Click "Add"

### 3. Verify Redirect URIs (if needed)

If you get "redirect URI mismatch" errors:

Go to: https://console.cloud.google.com/apis/credentials

1. Find "Web client (auto created by Google Service)"
2. Click to edit
3. Add authorized redirect URIs:
   ```
   https://my-chart-app-a6f67.firebaseapp.com/__/auth/handler
   https://your-production-domain.com/__/auth/handler
   ```
4. Save

---

## Testing vs Production Mode

### Testing Mode (Current)
- ✅ Only test users can sign in
- ✅ No verification required
- ✅ Limit: 100 test users
- ✅ Best for internal/private apps

### Production Mode
- ✅ Anyone can sign in
- ❌ May require Google verification (takes time)
- ❌ More security scrutiny
- ✅ Best for public apps

**Recommendation for Healthcare App:**
Keep in **Testing mode** and manually add authorized staff/patients for security and compliance.

---

## Testing Google Sign-In

### On Production Site:

1. Go to your deployed app URL
2. Click "Sign in with Google"
3. Select your Google account
4. You may see "Google hasn't verified this app"
   - Click "Advanced"
   - Click "Continue to MyChart (unsafe)"
5. You should be signed in!

### Common Issues:

**"Access blocked: Authorization Error"**
- Solution: Add user's email as test user in OAuth consent screen

**"Redirect URI mismatch"**
- Solution: Add redirect URI in Google Cloud Console → Credentials

**"Invalid configuration"**
- Solution: Make sure Google provider is enabled in Firebase Console

---

## Adding New Test Users

To allow new people to sign in:

1. Go to OAuth consent screen in Google Cloud Console
2. Scroll to "Test users" section
3. Click "ADD USERS"
4. Enter their email address
5. Click "ADD"

They can now sign in with Google!

---

## Publishing the App (Optional - For Public Access)

Only do this if you want ANYONE to sign in (not recommended for healthcare data):

1. In OAuth consent screen, click "PUBLISH APP"
2. You may need to submit for verification
3. Google will review your app (can take days/weeks)
4. Once approved, anyone can sign in

**Warning:** For apps handling protected health information, keep in Testing mode and control access via test users.

---

## Security Best Practices

For a healthcare application:

✅ Keep app in Testing mode
✅ Add users individually as test users
✅ Implement role-based access control (already done in your app)
✅ Use Firestore security rules (already configured)
✅ Monitor user access in Firebase Console
✅ Consider HIPAA compliance requirements
✅ Add privacy policy and terms of service

---

## Quick Reference URLs

**Firebase Console:**
- Authentication: https://console.firebase.google.com/project/my-chart-app-a6f67/authentication/providers
- Authorized Domains: https://console.firebase.google.com/project/my-chart-app-a6f67/authentication/settings

**Google Cloud Console:**
- OAuth Consent Screen: https://console.cloud.google.com/apis/credentials/consent?project=my-chart-app-a6f67
- Credentials: https://console.cloud.google.com/apis/credentials?project=my-chart-app-a6f67

---

## Troubleshooting Checklist

If Google sign-in isn't working:

- [ ] OAuth consent screen configured
- [ ] App in "Testing" mode (or published)
- [ ] Your email added as test user
- [ ] Google provider enabled in Firebase
- [ ] Production domain added to authorized domains
- [ ] Correct redirect URIs configured
- [ ] Browser cache cleared
- [ ] Using correct Google account

---

## Project Information

- **Project ID:** my-chart-app-a6f67
- **Auth Domain:** my-chart-app-a6f67.firebaseapp.com
- **App Name:** MyChart by Alera Care Collective
- **Company:** Alera Care Collective
