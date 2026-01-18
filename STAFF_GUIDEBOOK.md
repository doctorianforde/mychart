# MyChart Staff Guidebook
## Alera Care Collective

Welcome to the MyChart staff portal! This comprehensive guide will help you manage patient care effectively using the MyChart system.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Staff Dashboard Overview](#staff-dashboard-overview)
3. [Viewing Patient Records](#viewing-patient-records)
4. [Managing Patient Profiles](#managing-patient-profiles)
5. [Understanding Health Alerts](#understanding-health-alerts)
6. [Searching and Filtering Records](#searching-and-filtering-records)
7. [Exporting Data](#exporting-data)
8. [Email Alert System](#email-alert-system)
9. [Security and Privacy](#security-and-privacy)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Accessing the Staff Portal

**Website:** https://mychart.aleracarecollective.com

**Supported Browsers:**
- Google Chrome (recommended)
- Safari
- Firefox
- Microsoft Edge

**Compatible Devices:**
- Desktop computers
- Laptops
- Tablets

---

## 🔐 Creating a Staff Account

### Registration Process

1. **Visit the Website**
   - Go to: https://mychart.aleracarecollective.com

2. **Click "Need an account? Register"**

3. **Fill Out Registration Form**
   - **Email address:** Your work email
   - **Password:** Choose a strong, secure password
   - **Full Name:** Your full name
   - **Age:** Your age
   - **Comorbidities:** Leave blank or enter "N/A"
   - **Phone Number:** Your work phone
   - **I am a:** Select **"Staff"**
   - **Staff Access Code:** Enter one of these codes:
     - `ACC20252026`
     - `Medicaldoctor2026!`

4. **Click "Create Account"**

5. **You're Ready!** You'll have immediate access to the staff dashboard

### ⚠️ Security Note

**Staff access codes must be kept confidential!**
- Do not share codes with non-staff members
- Do not write codes in unsecured locations
- Change codes regularly (contact IT/admin)

---

## 🔑 Signing In

### Standard Sign-In

1. Go to: https://mychart.aleracarecollective.com
2. Enter your **email address**
3. Enter your **password**
4. Click **"Sign In"**
5. You'll be directed to the **staff dashboard**

### Sign-In with Google

1. Click **"Sign in with Google"** button
2. Select your Google account
3. You may see a security warning (this is normal)
   - Click **"Advanced"**
   - Click **"Continue to MyChart (unsafe)"**
4. **Note:** If signing in with Google for the first time, you'll be created as a **patient** account
5. **To convert to staff:** Contact the administrator to change your role in Firestore

---

## 🏠 Staff Dashboard Overview

### Key Differences from Patient Dashboard

As a staff member, your dashboard shows:

✅ **All Patient Records** (instead of just your own)
✅ **Search and Filter Tools**
✅ **Export Functionality** (PDF and Excel)
✅ **No Health Logging Forms** (staff don't log their own health data)
✅ **Patient Profile Management**

### Dashboard Sections

1. **Header Section**
   - Your profile picture and name
   - Sign Out button

2. **Profile Section**
   - Appears when viewing a specific patient
   - Shows patient details
   - Allows prescription updates

3. **All Patient Records Section**
   - Main section showing all patient health readings
   - Search and filter tools
   - Export options

---

## 👥 Viewing Patient Records

### All Patient Records Section

This is the main section where you'll spend most of your time. It displays health readings from all patients in the system.

### Record Information

Each record shows:

**Patient Information:**
- Patient email address
- Patient phone number (if available)

**Reading Details:**
- **Type:** Diabetes Log, Hypertension Log, or Weight Log
- **Subtype:** (For glucose) FBS, 1hr PP, 2hr PP, RBS
- **Value:** The actual reading with units
- **Flag:** Normal, High, Low, or Hypertensive Crisis
- **Date & Time:** When the reading was taken

### Color-Coded Alerts

Critical readings are highlighted with **red badges**:

- **High:** Glucose above threshold
- **Low:** Low glucose or blood pressure
- **Hypertensive Crisis:** Dangerously high blood pressure

### Reading Types

**Diabetes Log:**
- Shows glucose value in mg/dL
- Displays reading type (FBS, RBS, 1hr PP, 2hr PP)
- Flags: Low (<70), High (>130 FBS or >180 other)

**Hypertension Log:**
- Shows systolic/diastolic (e.g., 120/80 mmHg)
- Shows pulse in bpm
- Shows reading site (left arm, right arm, etc.)
- Flags: Low (<90/<60), High (≥140/≥90), Hypertensive Crisis (>180/>120)

**Weight Log:**
- Shows weight in kg
- No flags (informational only)

---

## 🔍 Searching and Filtering Records

### Search Functionality

**Search Bar** (top of All Patient Records section)

**Search by:**
- Patient email address
- Patient phone number
- Reading values
- Reading type

**How to Search:**
1. Type in the search box
2. Results filter automatically as you type
3. Search is case-insensitive

**Examples:**
- `john@example.com` - Find all records for John
- `0411` - Find records with phone numbers starting with 0411
- `diabetes` - Show all diabetes logs
- `150` - Find readings with value 150

### Date Range Filtering

**Filter by date range** to view records from specific time periods.

**How to Use:**

1. **Start Date:** Click and select the beginning date
2. **End Date:** Click and select the ending date
3. Records automatically filter to show only readings within that range

**Tips:**
- Leave **Start Date** blank to see all records up to the end date
- Leave **End Date** blank to see all records from the start date forward
- Clear both dates to see all records

### Combining Search and Filters

You can use search and date filters together:

**Example:**
- Search: `john@example.com`
- Start Date: `2025-01-01`
- End Date: `2025-01-31`
- **Result:** Shows only John's readings from January 2025

---

## 📊 Exporting Data

### Export Options

Two export formats are available:

1. **PDF Export** - For reports and printing
2. **Excel Export** - For data analysis and spreadsheets

### How to Export PDF

1. **Apply any search/filters** you want (optional)
2. **Click "Export PDF"** button
3. **PDF downloads automatically** with filename: `patient_records.pdf`

**PDF includes:**
- Date & Time
- Patient Email
- Type (Diabetes, Hypertension, Weight)
- Subtype (FBS, RBS, etc.)
- Value with units
- Flag (High, Low, Normal)

**Best for:**
- Printing patient reports
- Sharing with healthcare providers
- Documentation
- Patient visits

### How to Export Excel

1. **Apply any search/filters** you want (optional)
2. **Click "Export Excel"** button
3. **Excel file downloads automatically** with filename: `patient_records.xlsx`

**Excel includes:**
- Same data as PDF
- Organized in spreadsheet format
- Easy to sort and analyze

**Best for:**
- Data analysis
- Creating charts/graphs
- Importing into other systems
- Statistical analysis
- Tracking trends over time

### Export Tips

✅ **Filter before exporting** to get only the data you need
✅ **Export regularly** for backup purposes
✅ **Store exports securely** (contains patient health information)
✅ **Delete old exports** when no longer needed

---

## 👤 Managing Patient Profiles

### Viewing a Patient Profile

**From the All Patient Records section:**

1. Find a record from the patient you want to view
2. Click **"View Profile →"** button
3. Patient profile section appears at the top of the page

### Patient Profile Information

The profile displays:

**Left Column - Patient Details:**
- Full Name
- Age
- Phone Number
- Comorbidities (medical conditions)
- Profile Picture

**Right Column - Prescriptions:**
- Current medications and instructions
- Editable by staff

### Updating Profile Pictures

**Staff can update patient profile pictures:**

1. **Open patient profile** (View Profile button)
2. **Hover over the profile picture**
3. **Click when "Edit" appears**
4. **Select an image file:**
   - Must be an image (JPG, PNG, etc.)
   - Maximum size: 5MB
   - Image is automatically resized and stored
5. **Picture updates immediately**

**Use cases:**
- Patient doesn't have a profile picture
- Patient requests picture update
- Picture quality is poor

---

## 💊 Managing Prescriptions

### Viewing Prescriptions

When viewing a patient profile, prescriptions are shown in the right column.

### Updating Prescriptions

**How to Update:**

1. **Open patient profile** (View Profile button)
2. **Click in the prescription text area**
3. **Type or edit prescription information:**
   - Medication names
   - Dosages
   - Instructions
   - Special notes
4. **Click "Update Prescription"** button
5. **Success message appears**
6. **Patient sees updated prescriptions immediately**

### Prescription Best Practices

✅ **Be clear and specific:**
   ```
   Good: "Metformin 500mg - Take 1 tablet twice daily with meals"
   Avoid: "Metformin - as directed"
   ```

✅ **Include all medications:**
   - Prescription medications
   - Over-the-counter medications (if relevant)
   - Supplements (if medically significant)

✅ **Update regularly:**
   - After each appointment
   - When medications change
   - When dosages are adjusted

✅ **Use consistent formatting:**
   ```
   Medication Name Dosage - Instructions

   Example:
   Metformin 500mg - 1 tablet twice daily with meals
   Lisinopril 10mg - 1 tablet once daily in the morning
   Aspirin 100mg - 1 tablet once daily
   ```

### Closing Patient Profile

Click **"Close Profile"** button (top right of profile section) to return to viewing all records.

---

## 🚨 Understanding Health Alerts

### Alert Thresholds

MyChart automatically flags critical readings and sends email alerts to the office.

### Glucose Alerts

| Reading Type | Low | Normal | High |
|--------------|-----|--------|------|
| **Fasting (FBS)** | < 70 | 70-130 | > 130 |
| **After Meals** | < 70 | 70-180 | > 180 |

**Low Glucose (< 70 mg/dL):**
- ⚠️ Patient sees warning dialog
- ❌ **NO email sent to office**
- Patient instructed to consume fast-acting carbs
- Patient advised to consider emergency services if unwell

**High Glucose (> 130 FBS or > 180 other):**
- ⚠️ Patient sees alert dialog
- ✅ **Email sent to office@aleracarecollective.com**
- Contains: patient email, phone, reading value, type, timestamp

### Blood Pressure Alerts

| Category | Systolic | Diastolic | Flag | Email Alert |
|----------|----------|-----------|------|-------------|
| **Low** | < 90 | OR < 60 | 🔴 DANGER | ✅ Yes |
| **Normal** | 90-139 | AND 60-89 | ✅ Normal | ❌ No |
| **High** | 140-180 | OR 90-120 | ⚠️ High | ❌ No |
| **Hypertensive Crisis** | > 180 | OR > 120 | 🔴 DANGER | ✅ Yes |

**Hypertensive Crisis or Low BP:**
- 🔴 Patient sees DANGER dialog
- ✅ **Email sent to office@aleracarecollective.com**
- Patient advised to consider emergency services if unwell
- Contains: patient email, phone, BP reading, pulse, timestamp

### Weight Logs

- No automatic alerts or flags
- Informational tracking only
- Staff should monitor trends manually

---

## 📧 Email Alert System

### How It Works

**When a critical reading is logged:**
1. Patient submits the reading
2. System checks against thresholds
3. If critical, email is sent automatically
4. Patient sees alert dialog
5. Reading is saved to database

### Email Recipients

**All alerts sent to:** office@aleracarecollective.com

Make sure this inbox is monitored regularly!

### Alert Email Content

**High Glucose Alert:**
```
Subject: ALERT: High Glucose Reading - patient@example.com

Patient: patient@example.com
Contact: 0411222333 (or 'Not provided')
Reading: 220 mg/dL (RBS)
Time: 18/01/2026, 2:30 PM
```

**Blood Pressure Crisis Alert:**
```
Subject: ALERT: Hypertensive Crisis Blood Pressure Reading - patient@example.com

Patient: patient@example.com
Contact: 0411222333 (or 'Not provided')
Reading: 190/125 mmHg, Pulse: 95 bpm
Time: 18/01/2026, 2:30 PM
```

### Responding to Alerts

**When you receive an alert email:**

1. **Review the reading** - Check severity
2. **Check patient history** - Log into MyChart and view their profile
3. **Contact patient:**
   - Call the phone number provided
   - Check if they're feeling unwell
   - Provide guidance based on your protocols
4. **Document the interaction** in patient notes (external system)
5. **Escalate if needed** - Inform physician, recommend ER visit, etc.

### Alert Response Times

**Recommended response times:**
- **Hypertensive Crisis:** Within 30 minutes
- **Low Blood Pressure:** Within 30 minutes
- **High Glucose:** Within 1-2 hours
- **During office hours:** Immediate phone call
- **After hours:** Follow your emergency protocols

---

## 🔒 Security and Privacy

### Patient Data Protection

**All patient data is protected by:**
- Firestore security rules
- User authentication
- Role-based access control
- Encrypted data transmission (HTTPS)

### Staff Permissions

**As a staff member, you can:**
✅ View all patient records
✅ View all patient profiles
✅ Update patient prescriptions
✅ Update patient profile pictures
✅ Export patient data
✅ Search and filter all records

**You CANNOT:**
❌ Delete patient accounts (contact administrator)
❌ Change patient passwords
❌ Modify patient email addresses
❌ Delete health records
❌ Change patient personal information (age, name, etc.)

### HIPAA Compliance Considerations

**Best practices:**
- ✅ Sign out when leaving your workstation
- ✅ Don't share your login credentials
- ✅ Only access patient information when necessary for care
- ✅ Securely store any exported data
- ✅ Delete exported files when no longer needed
- ✅ Don't discuss patient information in public areas
- ✅ Lock your computer when stepping away
- ✅ Report any security concerns immediately

### Data Access Logging

**Important:** All data access may be logged for security and compliance purposes.

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Can't See Patient Records

**Problem:** Dashboard shows "No records found" but patients exist

**Solutions:**
1. Check if you're logged in as a staff member (not patient)
2. Refresh the page
3. Sign out and sign back in
4. Check browser console for errors (F12)
5. Contact IT support

#### Search Not Working

**Problem:** Search returns no results even though records exist

**Solutions:**
1. Check spelling and try different search terms
2. Clear all date filters
3. Try searching with partial information
4. Refresh the page
5. Try a different browser

#### Can't Update Prescriptions

**Problem:** "Update Prescription" button doesn't work or shows error

**Solutions:**
1. Make sure you're viewing a patient profile (View Profile button)
2. Check that you actually made changes to the prescription text
3. Ensure you're still signed in (session didn't expire)
4. Try refreshing the page and opening the profile again
5. Check browser console for errors

#### Export Not Working

**Problem:** PDF or Excel export doesn't download

**Solutions:**
1. Check browser pop-up blocker settings
2. Allow downloads from mychart.aleracarecollective.com
3. Check your Downloads folder (may have downloaded without notification)
4. Try a different browser
5. Disable browser extensions temporarily

#### Email Alerts Not Arriving

**Problem:** Critical readings logged but no email received

**Solutions:**
1. **Check spam/junk folder** in office@aleracarecollective.com
2. Add myclinicappdemo@gmail.com to safe senders
3. Check email server settings (may be blocking)
4. Verify environment variables are set on production server
5. Check server logs for email errors
6. Test email by having a patient log a critical reading

#### Profile Picture Won't Update

**Problem:** Can't update patient profile picture

**Solutions:**
1. Ensure file is an image (JPG, PNG, etc.)
2. Check file size (must be under 5MB)
3. Try a smaller or different image
4. Check internet connection
5. Refresh page and try again

---

## 📊 Workflow Best Practices

### Daily Tasks

**Morning Routine:**
1. Sign in to MyChart
2. Check office@aleracarecollective.com for overnight alerts
3. Review any critical readings
4. Contact patients who received alerts
5. Document responses

**Throughout the Day:**
1. Monitor email for real-time alerts
2. Respond to alerts within recommended timeframes
3. Update prescriptions after physician consultations
4. Review patient profiles before appointments

**End of Day:**
1. Follow up on any pending alerts
2. Export daily data for backup (optional)
3. Sign out securely

### Weekly Tasks

**Review and Analysis:**
1. Export weekly data for analysis
2. Identify patients with consistently high/low readings
3. Review patients who haven't logged readings recently
4. Update prescriptions for any medication changes
5. Conduct trend analysis

### Monthly Tasks

**Data Management:**
1. Export monthly reports
2. Archive previous month's exports
3. Review system usage
4. Update staff training if needed
5. Review and update protocols

---

## 📈 Reporting and Analytics

### Using Exported Data

**Excel exports are perfect for:**

**Trend Analysis:**
- Track individual patient progress over time
- Identify patterns in readings
- Compare pre/post medication changes

**Population Health:**
- Identify high-risk patients
- Track overall patient compliance
- Generate statistics for reporting

**Quality Improvement:**
- Measure intervention effectiveness
- Track alert response times
- Identify areas for improvement

### Creating Reports

**Example: Monthly Patient Summary**

1. Export all records for the month
2. Open in Excel
3. Use pivot tables to analyze:
   - Total readings per patient
   - Average glucose levels
   - Blood pressure trends
   - Alert frequency
4. Create charts and graphs
5. Present to clinical team

---

## 🎓 Training and Support

### New Staff Onboarding

**Recommended training sequence:**

1. **Read this guidebook** (60 minutes)
2. **Shadow experienced staff** (2-4 hours)
3. **Practice with test account:**
   - Search for records
   - View patient profiles
   - Update prescriptions (test data)
   - Export data
4. **Review alert response protocols** (30 minutes)
5. **Supervised use** (first week)
6. **Independent use** with support available

### Ongoing Training

- Review guidebook quarterly
- Stay updated on system changes
- Attend staff meetings about MyChart
- Share tips and best practices with team

### Getting Help

**Technical Issues:**
- Email: office@aleracarecollective.com
- Include: screenshots, error messages, what you were trying to do

**Clinical Questions:**
- Consult with supervising physician
- Review clinical protocols
- Discuss in team meetings

**System Updates:**
- Watch for announcement emails
- Read release notes
- Attend training sessions

---

## 🔄 System Updates and Maintenance

### Scheduled Maintenance

**When maintenance is scheduled:**
- You'll receive advance notice
- System may be unavailable during maintenance window
- Usually scheduled during off-hours
- Plan accordingly and inform patients if needed

### Feature Updates

**When new features are released:**
- Read release notes
- Update workflows as needed
- Inform team members
- Update training materials if significant changes

---

## 📞 Contact Information

**Office Email:** office@aleracarecollective.com

**For Technical Support:**
- Email the office with detailed description
- Include screenshots if possible
- Describe steps to reproduce the issue

**For Clinical Questions:**
- Consult supervising physician
- Review clinical protocols

**For Emergencies:**
- Follow standard emergency protocols
- Don't rely solely on MyChart for emergencies

---

## 📋 Quick Reference Guide

### Quick Actions

| I want to... | Steps |
|--------------|-------|
| **View all patient records** | Sign in → Scroll to "All Patient Records" section |
| **Search for a patient** | Type in search box → Results filter automatically |
| **Filter by date** | Enter start/end dates → Records filter automatically |
| **View patient profile** | Find patient's record → Click "View Profile →" |
| **Update prescriptions** | View Profile → Edit prescription text → Click "Update Prescription" |
| **Update profile picture** | View Profile → Hover over picture → Click "Edit" → Select image |
| **Export PDF** | Apply filters (optional) → Click "Export PDF" |
| **Export Excel** | Apply filters (optional) → Click "Export Excel" |
| **Close patient profile** | Click "Close Profile" button |
| **Sign out** | Click "Sign Out" in header |

### Alert Response Quick Guide

| Alert Type | Threshold | Email Sent | Response Time | Action |
|------------|-----------|------------|---------------|--------|
| **Hypertensive Crisis** | >180/120 | ✅ Yes | 30 min | Call patient immediately |
| **Low Blood Pressure** | <90/60 | ✅ Yes | 30 min | Call patient immediately |
| **High Glucose** | >130 FBS or >180 | ✅ Yes | 1-2 hours | Call patient, review care plan |
| **Low Glucose** | <70 | ❌ No | N/A | No email sent - patient manages |

### Staff Access Codes

**Registration codes (keep confidential):**
- `ACC20252026`
- `Medicaldoctor2026!`

---

## ✅ Staff Checklist

### Daily Checklist

- [ ] Check email for overnight alerts
- [ ] Review and respond to all alerts
- [ ] Monitor email throughout the day
- [ ] Update prescriptions as needed
- [ ] Document patient interactions
- [ ] Sign out at end of day

### Weekly Checklist

- [ ] Export weekly data
- [ ] Review patient trends
- [ ] Identify high-risk patients
- [ ] Follow up on non-compliant patients
- [ ] Review alert response times

### Monthly Checklist

- [ ] Export monthly reports
- [ ] Archive data securely
- [ ] Review system usage
- [ ] Update protocols if needed
- [ ] Team review meeting

---

## 🎯 Key Performance Indicators

### Metrics to Track

**Response Times:**
- Time from alert to patient contact
- Goal: <30 min for critical, <2 hours for high glucose

**Patient Engagement:**
- Number of patients actively logging readings
- Frequency of readings per patient
- Patients with zero readings in past month

**Clinical Outcomes:**
- Trend in average glucose levels
- Trend in average blood pressure
- Alert frequency over time

**System Usage:**
- Number of records logged daily/weekly/monthly
- Staff login frequency
- Export frequency

---

## 📚 Glossary

**FBS (Fasting Blood Sugar):** Glucose reading 8+ hours after eating

**PP (Post-Prandial):** After eating (1hr PP, 2hr PP)

**RBS (Random Blood Sugar):** Glucose at any time

**Systolic:** Top blood pressure number (heart beats)

**Diastolic:** Bottom blood pressure number (heart rests)

**BPM:** Beats per minute (pulse/heart rate)

**Hypertensive Crisis:** BP >180/120, requires immediate attention

**Comorbidities:** Other medical conditions

**Firestore:** Cloud database storing all patient data

**Role-based Access:** Different permissions for patients vs. staff

---

**Thank you for your dedicated service!**

MyChart is a tool to enhance patient care. Your expertise and clinical judgment are essential to making the most of this system.

---

*Last Updated: January 2026*
*MyChart by Alera Care Collective*
*Staff Portal Version 1.0*

**For Questions or Feedback:** office@aleracarecollective.com
