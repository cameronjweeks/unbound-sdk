# SDK Changelog

## v2.6.0 (LOA Generation & Enhanced Document Management)

### ✨ NEW FEATURES - Automated LOA Generation

**`generateLoa(params)` - NEW METHOD**
- ✅ **NEW**: Automated Letter of Authorization (LOA) generation
- ✅ **Template Processing**: Uses RTF template with variable replacement
- ✅ **PDF Generation**: Creates professional PDF with digital signature
- ✅ **Auto-Upload**: Uploads to Storage API and attaches to porting order
- ✅ **Brand Integration**: Uses brand information and order data automatically

```javascript
// Generate and attach LOA automatically
const result = await sdk.phoneNumbers.generateLoa({
  portingOrderId: "port-123",
  signerName: "John Smith",
  signerTitle: "IT Director"
});

console.log(result);
// {
//   success: true,
//   loaDocumentId: "doc-456",
//   storageId: "file-789", 
//   filename: "loa-port-123-1640995200000.pdf",
//   message: "Letter of Authorization generated and attached successfully"
// }
```

**Enhanced `attachPortingDocument(params)`**
- ✅ **Document Replacement**: Auto-replaces existing documents of same type
- ✅ **File Clearing**: Support for `storageId: null` to clear files
- ✅ **Action Tracking**: Returns `action: "created"/"updated"` status

### Technical Features
- **Template Variables**: Supports comprehensive variable replacement
  - **Brand**: `{{BRAND_LOGO}}`, `{{BRAND_NAME}}`
  - **Customer**: `{{NUMBER_PORT_ORDER_ACCOUNT_NAME}}`, `{{NUMBER_PORT_ORDER_STREET_ADDRESS}}`
  - **Address**: `{{NUMBER_PORT_ORDER_CITY}}`, `{{NUMBER_PORT_ORDER_STATE}}`, `{{NUMBER_PORT_ORDER_ZIP_CODE}}`
  - **Service**: `{{NUMBER_PORT_ORDER_CURRENT_CARRIER}}`, `{{NUMBER_PORT_ORDER_BTN}}`, `{{NUMBER_PORT_ORDER_NUMBERS}}`
  - **Signature**: `{{SIGNATURE}}`, `{{PERSON_NAME}}`, `{{PERSON_TITLE}}`, `{{DATE}}`
- **RTF Processing**: Extracts content from RTF templates
- **PDF Styling**: Professional formatting with signature fonts
- **Storage Integration**: Seamless upload and attachment workflow

### Usage Examples

**Complete LOA Workflow:**
```javascript
// 1. Create porting order
const order = await sdk.phoneNumbers.createPortingOrder({
  customerReference: "CUST-123",
  endUser: {
    admin: { entityName: "Acme Corp" },
    location: { streetAddress: "123 Main St" }
  }
});

// 2. Add phone numbers  
await sdk.phoneNumbers.checkPortability({
  phoneNumbers: ["+15551234567"],
  portingOrderId: order.id
});

// 3. Generate LOA automatically
const loa = await sdk.phoneNumbers.generateLoa({
  portingOrderId: order.id,
  signerName: "John Smith",
  signerTitle: "IT Director"
});

// LOA is now generated, uploaded, and attached to order
```

### Benefits
- 🚀 **One-Click Generation**: Complete LOA workflow in single API call
- 📄 **Professional PDFs**: Clean formatting with signature styling
- 🔄 **Auto-Integration**: Seamlessly integrates with existing porting workflow
- 🎨 **Brand Aware**: Uses brand information automatically
- 💾 **Persistent Storage**: Documents stored with 1-year retention

---

## v2.5.0 (Enhanced Phone Number Porting)

### ✨ NEW FEATURES - Two-Phase Validation System

**`checkPortability(params)` Enhanced**
- ✅ **NEW**: `runPortabilityCheck` parameter (boolean, default: false)
- ✅ **ENHANCED**: Two-phase validation system for better performance and UX
- ✅ **ENHANCED**: Internal LRN lookup for instant carrier/compatibility validation
- ✅ **ENHANCED**: Improved compatibility rules for US/Canada vs international numbers

#### Phase 1: Internal Validation (Default)
```javascript
// Fast internal validation using LRN lookup
await sdk.phoneNumbers.checkPortability({
  phoneNumbers: ["+15551234567"],
  portingOrderId: order.id
  // runPortabilityCheck: false (default)
});
```
**Benefits:**
- 🚀 **Instant Results**: No external API calls
- 🛡️ **Smart Validation**: Checks ownership, duplicates, carrier compatibility  
- 📱 **Better UX**: Immediate feedback on number compatibility
- 💰 **Cost Effective**: Reduces external API usage

#### Phase 2: External Validation (Optional)
```javascript
// Run full external portability check when ready
await sdk.phoneNumbers.checkPortability({
  phoneNumbers: ["+15551234567"],
  portingOrderId: order.id,
  runPortabilityCheck: true
});
```

#### Compatibility Rules Updated
- **US/Canada**: Mobile, landline, local numbers can be grouped; toll-free separate
- **International**: Each number type must be in separate orders
- **Carrier Matching**: All numbers must be from same carrier/SPID

#### Database Fields Enhanced
- `currentProvider`: SPID carrier name from LRN lookup
- `country`: Extracted from phone number format
- `phoneNumberType`: From LRN lookup  
- `portabilityStatus`: 'pending' → 'portable'/'not-portable'/'error'

#### Migration Guide
No breaking changes - existing code continues to work. New `runPortabilityCheck` parameter is optional and defaults to `false`.

**Recommended Usage:**
```javascript
// Step 1: Add numbers with internal validation (draft phase)
await sdk.phoneNumbers.checkPortability({
  phoneNumbers: ["+15551234567", "+15559876543"],
  portingOrderId: order.id
});

// Step 2: Run external validation before submission
await sdk.phoneNumbers.checkPortability({
  phoneNumbers: ["+15551234567", "+15559876543"], 
  portingOrderId: order.id,
  runPortabilityCheck: true
});
```

---

## v2.4.0 (Breaking Changes)

### 🚨 BREAKING CHANGES - Phone Number Porting

**Overview**: Phone number management in porting orders has been completely redesigned for better data integrity and validation.

#### Changed Methods

**`createPortingOrder(params)`**
- ❌ **REMOVED**: `phoneNumbers` parameter
- ❌ **REMOVED**: `phoneNumberBlocks` parameter  
- ❌ **REMOVED**: `phoneNumberConfiguration` parameter
- ✅ **KEPT**: `customerReference`, `endUser`, `activationSettings`, `tags`

**`updatePortingOrder(id, params)`**
- ❌ **REMOVED**: `phoneNumbers` parameter
- ❌ **REMOVED**: `phoneNumberBlocks` parameter
- ❌ **REMOVED**: `phoneNumberConfiguration` parameter
- ✅ **KEPT**: `customerReference`, `endUser`, `activationSettings`, `tags`

**`checkPortability(params)`**
- ✅ **NEW**: `portingOrderId` parameter (optional)
- ✅ **ENHANCED**: Now validates number compatibility and saves to orders
- ✅ **ENHANCED**: Prevents duplicate numbers and incompatible number mixing

#### Migration Guide

**Before (v2.3.x):**
```javascript
// Old way - phone numbers in order creation
const order = await sdk.phoneNumbers.createPortingOrder({
  phoneNumbers: ["+15551234567", "+15559876543"],
  customerReference: "CUST-123",
  endUser: { admin: { entityName: "My Company" } }
});
```

**After (v2.4.0):**
```javascript
// Step 1: Create empty order
const order = await sdk.phoneNumbers.createPortingOrder({
  customerReference: "CUST-123", 
  endUser: { admin: { entityName: "My Company" } }
});

// Step 2: Add validated phone numbers
await sdk.phoneNumbers.checkPortability({
  phoneNumbers: ["+15551234567", "+15559876543"],
  portingOrderId: order.id
});

// Step 3: Get complete order with numbers
const completeOrder = await sdk.phoneNumbers.getPortingOrder(order.id);
```

#### New Validations

`checkPortability()` now validates:
- ✅ **Ownership**: Numbers not already owned by account
- ✅ **Availability**: Numbers not in other active porting orders  
- ✅ **Compatibility**: Numbers compatible for same order (country, type, SPID, FastPort)

**Compatibility Error Example:**
```javascript
try {
  await sdk.phoneNumbers.checkPortability({
    phoneNumbers: ["+15551234567"], // US local
    portingOrderId: "existing-order-with-uk-numbers"
  });
} catch (error) {
  // Error: "Cannot add these numbers to the existing porting order. 
  // Numbers differ in: country. Please create a separate porting order."
}
```

#### Benefits

- 🛡️ **Data Integrity**: Only validated Telnyx data saved
- 🚫 **Prevents Errors**: Blocks incompatible number combinations
- 🔄 **Real-time Counts**: Phone number counts always accurate
- 📱 **Better UX**: Clear error messages guide users

#### Required Frontend Changes

1. **Update Order Creation Flow**: Remove phone numbers from initial creation
2. **Add Validation Step**: Use `checkPortability` with `portingOrderId`
3. **Handle New Errors**: Show compatibility error messages to users
4. **Update Number Management**: Use dedicated flow for adding/removing numbers

---

*For questions or migration support, contact the API team.*