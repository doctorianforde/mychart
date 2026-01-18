# Production Deployment Checklist

## Production URL: https://mychart.aleracarecollective.com

---

## Firebase Configuration

### 1. Authorized Domains ✅

**Location:** Firebase Console → Authentication → Settings → Authorized domains
**URL:** https://console.firebase.google.com/project/my-chart-app-a6f67/authentication/settings

**Add these domains:**
- [ ] `aleracarecollective.com`
- [ ] `mychart.aleracarecollective.com`
- [ ] Already included: `localhost` (for development)
- [ ] Already included: `my-chart-app-a6f67.firebaseapp.com`

---

### 2. Google Sign-In Provider ✅

**Location:** Firebase Console → Authentication → Sign-in method
**URL:** https://console.firebase.google.com/project/my-chart-app-a6f67/authentication/providers

**Ensure:**
- [ ] Google provider is **Enabled**
- [ ] Support email is selected
- [ ] Configuration is saved

---

## Google Cloud Configuration

### 3. OAuth Consent Screen ✅

**Location:** Google Cloud Console → APIs & Services → OAuth consent screen
**URL:** https://console.cloud.google.com/apis/credentials/consent?project=my-chart-app-a6f67

**Configuration:**
- [ ] User Type: External
- [ ] App name: MyChart by Alera Care Collective
- [ ] User support email: [Your email]
- [ ] Developer contact: office@aleracarecollective.com
- [ ] Application home page: https://mychart.aleracarecollective.com
- [ ] Authorized domain: `aleracarecollective.com`
- [ ] Test users: Added (your email and staff emails)
- [ ] Publishing status: Testing mode

---

### 4. OAuth Redirect URIs ✅

**Location:** Google Cloud Console → APIs & Services → Credentials
**URL:** https://console.cloud.google.com/apis/credentials?project=my-chart-app-a6f67

**Find:** "Web client (auto created by Google Service)"

**Authorized redirect URIs should include:**
- [ ] `https://my-chart-app-a6f67.firebaseapp.com/__/auth/handler`
- [ ] `https://mychart.aleracarecollective.com/__/auth/handler` (add if missing)

---

## Environment Variables

### 5. Production Environment Variables ✅

**Check your deployment platform** (Vercel, Netlify, etc.) has these environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAcRgxzA0DvlsQUSjz_8SUR-wDKmCQYMlU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-chart-app-a6f67.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-chart-app-a6f67
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-chart-app-a6f67.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=657729241412
NEXT_PUBLIC_FIREBASE_APP_ID=1:657729241412:web:70b0ff7e18000ffe081711

EMAIL_USER=myclinicappdemo@gmail.com
EMAIL_PASS=zigc cvjo mlga mojy
```

**Important:** These should match your `.env.local` file

---

## Testing Checklist

### 6. Test Google Sign-In

**URL:** https://mychart.aleracarecollective.com

**Test Steps:**
1. [ ] Open production URL in incognito/private window
2. [ ] Click "Sign in with Google" button
3. [ ] Select your Google account (must be a test user)
4. [ ] If you see "Google hasn't verified this app":
   - [ ] Click "Advanced"
   - [ ] Click "Continue to MyChart (unsafe)"
5. [ ] Should redirect to dashboard
6. [ ] Profile picture should load (if you have one)
7. [ ] User email should display correctly

---

### 7. Test Email/Password Authentication

1. [ ] Click "Need an account? Register"
2. [ ] Fill out registration form
3. [ ] Upload profile picture
4. [ ] Register as patient
5. [ ] Sign out
6. [ ] Sign in with email/password
7. [ ] Should work correctly

---

### 8. Test Database Connectivity (Patient View)

**As a Patient user:**

1. [ ] **Log Glucose Reading:**
   - Fill in date, time, glucose value, last meal time
   - Submit form
   - Check if success message appears
   - Verify reading appears in "Medical Records" section

2. [ ] **Log Blood Pressure:**
   - Fill in date, time, systolic, diastolic, pulse
   - Submit form
   - Check if success message appears
   - Verify reading appears in "Medical Records" section

3. [ ] **Log Weight:**
   - Fill in date, time, weight
   - Submit form
   - Check if success message appears
   - Verify reading appears in "Medical Records" section

4. [ ] **Verify in Firestore Console:**
   - Go to: https://console.firebase.google.com/project/my-chart-app-a6f67/firestore/data
   - Check `records` collection
   - Verify new documents were created

---

### 9. Test Database Connectivity (Staff View)

**Create or sign in as Staff user:**

1. [ ] Register with staff code: `ACC20252026` or `Medicaldoctor2026!`
2. [ ] Should see "All Patient Records" instead of logging forms
3. [ ] Should see records from all patients
4. [ ] Click "View Profile" on a patient record
5. [ ] Should see patient details and prescriptions
6. [ ] Try updating a prescription
7. [ ] Verify prescription saves correctly

---

### 10. Test Email Alerts

**Test high glucose alert:**
1. [ ] Log in as patient
2. [ ] Log a high glucose reading (>180 mg/dL)
3. [ ] Check if alert appears
4. [ ] Check email: office@aleracarecollective.com should receive alert
5. [ ] Verify email contains patient info and reading

**Test blood pressure crisis alert:**
1. [ ] Log blood pressure reading with systolic >180 or diastolic >120
2. [ ] Check if emergency alert appears
3. [ ] Verify email sent to office@aleracarecollective.com

---

## Security Checklist

### 11. Firestore Security Rules

**Location:** Firebase Console → Firestore Database → Rules
**URL:** https://console.firebase.google.com/project/my-chart-app-a6f67/firestore/rules

**Verify rules are deployed:**
- [ ] Users can only read/write their own user document
- [ ] Staff can read all users
- [ ] Patients can only create records for themselves
- [ ] Patients can only read their own records
- [ ] Staff can read/write all records

**Test:**
1. [ ] Patient cannot see other patients' records
2. [ ] Patient cannot modify other users' data
3. [ ] Staff can see all patient records

---

### 12. Security Best Practices

- [ ] `.env.local` is in `.gitignore` (never commit to git)
- [ ] Environment variables are set in deployment platform
- [ ] OAuth app is in "Testing" mode (for HIPAA compliance)
- [ ] Only authorized users added as test users
- [ ] Firebase security rules are properly configured
- [ ] Consider implementing 2FA for staff accounts
- [ ] Monitor Firebase usage and authentication logs

---

## Common Issues & Solutions

### Issue: "Redirect URI mismatch"
**Solution:** Add `https://mychart.aleracarecollective.com/__/auth/handler` to OAuth credentials

### Issue: "Access blocked: Authorization Error"
**Solution:** Add user's email as test user in OAuth consent screen

### Issue: Google sign-in works locally but not in production
**Solution:**
1. Check authorized domains in Firebase
2. Verify environment variables in deployment platform
3. Clear browser cache and cookies

### Issue: Database not showing data
**Solution:**
1. Check browser console for Firestore errors
2. Verify Firestore security rules allow the operation
3. Check if user is properly authenticated
4. Verify data exists in Firestore console

### Issue: Email alerts not sending
**Solution:**
1. Check server logs for email errors
2. Verify `EMAIL_USER` and `EMAIL_PASS` environment variables
3. Check if Gmail security settings block the app
4. Consider using OAuth2 or dedicated email service

---

## Monitoring & Maintenance

### Regular Checks:

1. **Firebase Authentication:**
   - Monitor user sign-ups
   - Check for failed login attempts
   - Review test user list

2. **Firestore Database:**
   - Monitor read/write operations
   - Check for unusual activity
   - Review storage usage

3. **Email Alerts:**
   - Test periodically
   - Verify deliverability
   - Check spam folder

4. **Google OAuth:**
   - Keep test user list updated
   - Monitor for verification requirements
   - Check for security warnings

---

## Production URLs Quick Reference

- **Production App:** https://mychart.aleracarecollective.com
- **Firebase Console:** https://console.firebase.google.com/project/my-chart-app-a6f67
- **Google Cloud Console:** https://console.cloud.google.com/?project=my-chart-app-a6f67
- **Firestore Data:** https://console.firebase.google.com/project/my-chart-app-a6f67/firestore/data
- **Authentication Users:** https://console.firebase.google.com/project/my-chart-app-a6f67/authentication/users

---

## Deployment Information

**Project Name:** MyChart by Alera Care Collective
**Production URL:** https://mychart.aleracarecollective.com
**Firebase Project ID:** my-chart-app-a6f67
**Company:** Alera Care Collective
**Support Email:** office@aleracarecollective.com

---

## Next Steps After Deployment

1. [ ] Complete all testing checklist items
2. [ ] Add all staff members as test users
3. [ ] Document patient onboarding process
4. [ ] Set up backup and disaster recovery
5. [ ] Create user training materials
6. [ ] Implement monitoring and alerts
7. [ ] Consider HIPAA compliance audit
8. [ ] Set up regular data backups
9. [ ] Create privacy policy and terms of service
10. [ ] Plan for scaling and performance monitoring
