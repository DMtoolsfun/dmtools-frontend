# Phase 1 Testing Instructions
## LemonSqueezy Integration Testing

**Date:** December 3, 2025
**Changes:** Added LemonSqueezy affiliate tracking to pricing.html, packs.html, and account.html

---

## ✅ Automated Verification (COMPLETED)

### HTML Syntax Check
- ✅ **pricing.html** - Valid HTML structure
- ✅ **packs.html** - Valid HTML structure
- ✅ **account.html** - Valid HTML structure

### Script Placement Verification
- ✅ **pricing.html:24** - LemonSqueezy script present and properly placed
- ✅ **packs.html:24** - LemonSqueezy script present and properly placed
- ✅ **account.html:19** - LemonSqueezy script present and properly placed

### Integration Pattern
All three files follow the same pattern as store.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GFG0RYJNR0"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-GFG0RYJNR0');
</script>

<!-- Lemon Squeezy -->
<script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
```

---

## 🌐 Manual Browser Testing

### Prerequisites
1. Deploy changes to your staging/production environment OR
2. Run a local web server to test the HTML files

### Test Environment Setup

**Option 1: Using Python (Simple HTTP Server)**
```bash
cd /home/user/dmtools-frontend
python3 -m http.server 8000
```
Then open: http://localhost:8000

**Option 2: Using Node.js (http-server)**
```bash
npx http-server /home/user/dmtools-frontend -p 8000
```

**Option 3: Deploy to your domain**
If you have automatic deployment, the changes are already live at:
- https://dmtools.fun/pricing.html
- https://dmtools.fun/packs.html
- https://dmtools.fun/account.html

---

## 📋 Testing Checklist

### Test 1: Pricing Page (pricing.html)

**Page Load Test:**
- [ ] Open pricing.html in browser
- [ ] Page loads without errors
- [ ] All styling appears correct
- [ ] Navigation works properly

**Console Check:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for errors
4. Expected: No JavaScript errors

**Network Check:**
1. Open DevTools Network tab
2. Reload the page
3. Filter by "lemon"
4. Expected results:
   - [ ] `lemon.js` loads successfully (Status: 200)
   - [ ] File size: ~20-30KB
   - [ ] No 404 or network errors

**LemonSqueezy Verification:**
1. Open DevTools Console
2. Type: `window.LemonSqueezy`
3. Expected: Object with methods (not `undefined`)
4. Type: `window.createLemonSqueezy`
5. Expected: Function (not `undefined`)

**Functionality Test:**
- [ ] All subscription buttons still work
- [ ] Pricing cards display correctly
- [ ] Navigation links work
- [ ] Google Analytics still loads

---

### Test 2: Packs Dashboard (packs.html)

**Page Load Test:**
- [ ] Open packs.html in browser
- [ ] Page loads without errors
- [ ] All styling appears correct
- [ ] User authentication required (if applicable)

**Console Check:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for errors
4. Expected: No JavaScript errors

**Network Check:**
1. Open DevTools Network tab
2. Reload the page
3. Filter by "lemon"
4. Expected results:
   - [ ] `lemon.js` loads successfully (Status: 200)
   - [ ] No duplicate script loads
   - [ ] No 404 or network errors

**LemonSqueezy Verification:**
1. Open DevTools Console
2. Type: `window.LemonSqueezy`
3. Expected: Object with methods (not `undefined`)

**Functionality Test:**
- [ ] Pack cards display correctly
- [ ] Activation buttons work
- [ ] Gifting features work (if authenticated)
- [ ] Navigation works properly
- [ ] Existing pack management features work

---

### Test 3: Account Page (account.html)

**Page Load Test:**
- [ ] Open account.html in browser
- [ ] Page loads without errors
- [ ] Authentication prompt appears (if not logged in)
- [ ] User data loads correctly (if logged in)

**Console Check:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for errors
4. Expected: No JavaScript errors

**Network Check:**
1. Open DevTools Network tab
2. Reload the page
3. Filter by "lemon"
4. Expected results:
   - [ ] `lemon.js` loads successfully (Status: 200)
   - [ ] Loads only once (no duplicates)
   - [ ] No CORS errors

**LemonSqueezy Verification:**
1. Open DevTools Console
2. Type: `window.LemonSqueezy`
3. Expected: Object with methods (not `undefined`)

**Functionality Test:**
- [ ] Account information displays
- [ ] Subscription status shows correctly
- [ ] Usage statistics load
- [ ] Billing history displays
- [ ] Upgrade/downgrade buttons work
- [ ] Navigation works properly

---

## 🔍 Cross-Browser Testing

Test in multiple browsers to ensure compatibility:

### Desktop Browsers
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on Mac)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Firefox Mobile

---

## 🚨 What to Look For (Potential Issues)

### Critical Issues (Test FAILS if found)
- ❌ JavaScript errors in console
- ❌ Page doesn't load
- ❌ Existing functionality broken
- ❌ LemonSqueezy script 404 error
- ❌ White screen / blank page

### Warning Issues (Note but may not be critical)
- ⚠️ Slow script loading
- ⚠️ Multiple script loads
- ⚠️ Console warnings (not errors)

### Success Indicators
- ✅ Pages load normally
- ✅ LemonSqueezy script loads (Status 200)
- ✅ `window.LemonSqueezy` is defined
- ✅ All existing features work
- ✅ No console errors
- ✅ Navigation works

---

## 📊 Expected Network Requests

When you load each page, you should see these scripts load:

1. **Google Analytics:**
   - `gtag/js?id=G-GFG0RYJNR0` (Status: 200)

2. **LemonSqueezy:**
   - `lemon.js` from `assets.lemonsqueezy.com` (Status: 200)
   - Size: ~20-30KB
   - Type: `application/javascript`

3. **Backend API Calls** (if logged in):
   - Various calls to `dmtools-backend-production.up.railway.app`

---

## 🧪 Advanced Testing (Optional)

### Test Affiliate Tracking
If you have LemonSqueezy checkout buttons on these pages:

1. Open pricing.html
2. Click a subscription purchase button
3. LemonSqueezy checkout should open
4. Check that your affiliate parameters are included in the URL

### Test Analytics Integration
1. Open DevTools Console
2. Type: `gtag('event', 'test', {test_param: 'value'})`
3. Expected: No errors
4. Check Google Analytics to see if event was tracked

### Performance Testing
1. Open DevTools
2. Go to Lighthouse tab
3. Run performance audit
4. Compare before/after scores (should be similar)

---

## 🐛 Troubleshooting Guide

### Issue: LemonSqueezy script 404 error
**Cause:** Script URL incorrect or LemonSqueezy service down
**Fix:** Verify URL is `https://assets.lemonsqueezy.com/lemon.js`

### Issue: `window.LemonSqueezy is undefined`
**Cause:** Script didn't load or loaded after test
**Fix:** Wait a few seconds and try again, or check Network tab

### Issue: Existing functionality broken
**Cause:** Possible syntax error or script conflict
**Fix:** Check Console for errors, review git diff

### Issue: CORS errors
**Cause:** Testing from `file://` protocol
**Fix:** Use a local web server (http://localhost)

### Issue: Scripts load but page is slow
**Cause:** LemonSqueezy script is large
**Fix:** This is normal, `defer` attribute prevents blocking

---

## ✅ Sign-Off Checklist

Before marking Phase 1 as complete:

- [ ] All 3 pages load without errors
- [ ] LemonSqueezy script loads on all 3 pages
- [ ] No existing functionality broken
- [ ] No console errors
- [ ] Tested in at least 2 browsers
- [ ] Mobile responsive still works
- [ ] Navigation between pages works
- [ ] Google Analytics still works

---

## 📝 Test Results Template

**Tester Name:** _________________
**Date:** _________________
**Environment:** ☐ Local ☐ Staging ☐ Production

### Results Summary

| Page | Loads? | LemonSqueezy? | Errors? | Status |
|------|--------|---------------|---------|--------|
| pricing.html | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ Pass ☐ Fail |
| packs.html | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ Pass ☐ Fail |
| account.html | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ Pass ☐ Fail |

**Overall Status:** ☐ PASS ☐ FAIL

**Notes:**
```
[Add any issues, observations, or concerns here]
```

---

## 🎯 Next Steps After Testing

### If Tests PASS:
1. ✅ Mark Phase 1 as complete
2. 🚀 Move to Phase 2 (Delete duplicate admin dashboard)
3. 📊 Monitor LemonSqueezy analytics for affiliate tracking

### If Tests FAIL:
1. 🐛 Document the specific issue
2. 🔍 Review the error messages
3. 🔧 Apply fixes
4. 🔄 Re-test

---

## 📞 Support

If you encounter issues during testing:
1. Check the browser console for error messages
2. Review the git diff to see exactly what changed
3. Compare with store.html (working reference)
4. Contact development team with specific error details

---

**Testing Document End**
