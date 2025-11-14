# Leadsage Africa - Mobile API Documentation

## Base URL

```
https://leadsage-web-application.vercel.app/api
```

---

## 1. User Registration

### Endpoint

```
POST /register
```

### Request

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@gmail.com",
  "password": "SecurePass123!"
}
```

### Success Response (201)

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_123",
    "email": "john@gmail.com",
    "name": "John Doe"
  },
  "token": "eyJhbGci..."
}
```

### Error Response (400/500)

```json
{
  "success": false,
  "message": "Invalid input",
  "errors": [...]
}
```

---

## 2. User Login

### Endpoint

```
POST /login
```

### Request

```json
{
  "email": "john@gmail.com",
  "password": "SecurePass123!"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_123",
    "email": "john@gmail.com",
    "name": "John Doe"
  },
  "token": "eyJhbGci..."
}
```

### Error Response (401)

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 3. Forgot Password

### Endpoint

```
POST /forgot-password
```

### Request

```json
{
  "email": "john@gmail.com"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "If this email exists in our system, a reset link has been sent to it."
}
```

**Note:** Response is same whether email exists or not (security measure)

---

## 4. Reset Password

### Endpoint

```
POST /reset-password
```

### Request

```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Password reset successful. You can now log in."
}
```

### Error Response (400/500)

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## 5. Google Sign-In

### Endpoint

```
POST /google-auth
```

### Request

```json
{
  "callbackURL": "/dashboard"
}
```

_callbackURL is optional, defaults to "/"_

### Success Response (200)

```json
{
  "success": true,
  "message": "Google authentication initialized",
  "redirectUrl": "https://accounts.google.com/..."
}
```

### Implementation Steps

1. Call the endpoint to get `redirectUrl`
2. Open `redirectUrl` in webview/browser
3. User completes Google sign-in
4. User is redirected back with token

---

## Quick Implementation Guide

### Headers (All Requests)

```
Content-Type: application/json
```

### Authenticated Requests

```
Authorization: Bearer {token}
```

### Token Storage

Store JWT token securely after login/register:

- **iOS**: Keychain
- **Android**: EncryptedSharedPreferences
- **React Native**: SecureStore
- **Flutter**: flutter_secure_storage

### Error Handling

All endpoints return:

```json
{
  "success": boolean,
  "message": string,
  ...
}
```

Check `success` field first, then handle accordingly.

---

## Common HTTP Status Codes

| Code | Meaning                            |
| ---- | ---------------------------------- |
| 200  | Success                            |
| 201  | Created (Registration)             |
| 400  | Bad Request (Validation Error)     |
| 401  | Unauthorized (Invalid Credentials) |
| 500  | Server Error                       |

---

## Testing

### cURL Gmails

**Register:**

```bash
curl -X POST https://your-domain.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@gmail.com","password":"Test123!"}'
```

**Login:**

```bash
curl -X POST https://your-domain.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@gmail.com","password":"Test123!"}'
```

**Forgot Password:**

```bash
curl -X POST https://your-domain.com/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"john@gmail.com"}'
```

---

## Important Notes

1. **Passwords**: Minimum 8 characters (check with backend for exact requirements)
2. **Email Validation**: Must be valid email format
3. **Token Expiry**: JWT tokens expire after X hours (check with backend)
4. **Rate Limiting**: May be implemented on endpoints
5. **Google Auth**: Opens external browser - handle deep linking properly

---

## Need Help?

Contact the backend team for API issues or questions.

---

---

# Listings API

## 1. Get Approved Listings

### Endpoint

```
GET /listings/approved
```

### Query Parameters

| Parameter | Type   | Required | Default | Description       |
| --------- | ------ | -------- | ------- | ----------------- |
| query     | string | No       | -       | Search term       |
| page      | number | No       | 1       | Page number       |
| limit     | number | No       | 10      | Items per page    |
| userId    | string | No       | -       | Filter by user ID |

### Example Request

```
GET /listings/approved?query=house&page=1&limit=10&userId=user_123
```

### Success Response (200)

```json
{
  "listings": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## 2. Get Listing Details

### Endpoint

```
GET /listings/{slug}
```

### Example Request

```
GET /listings/luxury-apartment-lagos
```

### Success Response (200)

```json
{
  "id": "listing_123",
  "slug": "luxury-apartment-lagos",
  "title": "Luxury Apartment in Lagos",
  "description": "...",
  "price": 5000000,
  "location": "Lagos",
  "images": [...],
  "userId": "user_123",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### Error Response (500)

```
Internal Server Error
```

---

## 3. Get Saved Listings

### Endpoint

```
GET /listings/saved
```

### Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| query     | string | No       | -       |
| page      | number | No       | 1       |
| limit     | number | No       | 10      |

### Example Request

```
GET /listings/saved?page=1&limit=10
```

### Success Response (200)

```json
{
  "listings": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  }
}
```

**Note:** Requires authentication token

---

# Notifications API

## Get Notifications

### Endpoint

```
GET /notifications
```

### Success Response (200)

```json
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "listing_approved",
      "title": "Listing Approved",
      "message": "Your listing has been approved",
      "read": false,
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

**Note:** Requires authentication token

---

# Payment Methods API

## Get Payment Methods

### Endpoint

```
GET /payment-methods
```

### Success Response (200)

```json
{
  "paymentMethods": [
    {
      "id": "pm_123",
      "type": "card",
      "last4": "4242",
      "brand": "visa",
      "isDefault": true
    }
  ]
}
```

**Note:** Requires authentication token

---

# Landlord Applications API

## 1. Get All Applications

### Endpoint

```
GET /landlord/applications
```

### Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| query     | string | No       | -       |
| page      | number | No       | 1       |
| limit     | number | No       | 10      |

### Example Request

```
GET /landlord/applications?query=pending&page=1&limit=10
```

### Success Response (200)

```json
{
  "applications": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

---

## 2. Get Application by ID

### Endpoint

```
GET /landlord/applications/{id}
```

### Example Request

```
GET /landlord/applications/app_123
```

### Success Response (200)

```json
{
  "id": "app_123",
  "status": "pending",
  "userId": "user_123",
  "listingId": "listing_456",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

---

## 3. Get Approved Applications

### Endpoint

```
GET /landlord/applications/approved
```

### Success Response (200)

```json
{
  "applications": [...]
}
```

---

## 4. Get Pending Applications

### Endpoint

```
GET /landlord/applications/pending
```

### Success Response (200)

```json
{
  "applications": [...]
}
```

---

## 5. Get Reviewing Applications

### Endpoint

```
GET /landlord/applications/reviewing
```

### Success Response (200)

```json
{
  "applications": [...]
}
```

---

## 6. Get Rejected Applications

### Endpoint

```
GET /landlord/applications/rejected
```

### Success Response (200)

```json
{
  "applications": [...]
}
```

**Note:** All application endpoints require authentication

---

# Landlord Bookings API

## 1. Get All Bookings

### Endpoint

```
GET /landlord/bookings
```

### Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| query     | string | No       | -       |
| page      | number | No       | 1       |
| limit     | number | No       | -       |

### Example Request

```
GET /landlord/bookings?page=1&limit=10
```

### Success Response (200)

```json
{
  "bookings": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 30
  }
}
```

---

## 2. Get Booking by ID

### Endpoint

```
GET /landlord/bookings/{id}
```

### Example Request

```
GET /landlord/bookings/booking_123
```

### Success Response (200)

```json
{
  "id": "booking_123",
  "status": "confirmed",
  "userId": "user_123",
  "listingId": "listing_456",
  "checkIn": "2025-02-01",
  "checkOut": "2025-02-05",
  "totalAmount": 250000
}
```

---

## 3. Get Pending Bookings

### Endpoint

```
GET /landlord/bookings/pending
```

### Query Parameters

Same as "Get All Bookings"

### Success Response (200)

```json
{
  "bookings": [...]
}
```

---

## 4. Get Confirmed Bookings

### Endpoint

```
GET /landlord/bookings/confirmed
```

### Success Response (200)

```json
{
  "bookings": [...]
}
```

---

## 5. Get Completed Bookings

### Endpoint

```
GET /landlord/bookings/completed
```

### Success Response (200)

```json
{
  "bookings": [...]
}
```

---

## 6. Get Cancelled Bookings

### Endpoint

```
GET /landlord/bookings/cancelled
```

### Success Response (200)

```json
{
  "bookings": [...]
}
```

**Note:** All booking endpoints require authentication

---

# Landlord Leases API

## 1. Get My Leases

### Endpoint

```
GET /landlord/leases
```

### Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| query     | string | No       | -       |
| page      | number | No       | 1       |
| limit     | number | No       | -       |

### Example Request

```
GET /landlord/leases?page=1&limit=10
```

### Success Response (200)

```json
{
  "leases": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

---

## 2. Get Lease Details

### Endpoint

```
GET /landlord/leases/{id}
```

### Example Request

```
GET /landlord/leases/lease_123
```

### Success Response (200)

```json
{
  "id": "lease_123",
  "listingId": "listing_456",
  "tenantId": "user_789",
  "startDate": "2025-02-01",
  "endDate": "2026-02-01",
  "monthlyRent": 150000,
  "status": "active"
}
```

---

## 3. Get Listing Leases

### Endpoint

```
GET /landlord/listings/{id}/leases
```

### Example Request

```
GET /landlord/listings/listing_456/leases
```

### Success Response (200)

```json
{
  "leases": [...]
}
```

**Note:** All lease endpoints require authentication

---

# Landlord Listings Management API

## 1. Get All Landlord Listings

### Endpoint

```
GET /landlord/listings
```

### Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| query     | string | No       | -       |
| page      | number | No       | 1       |
| limit     | number | No       | -       |

### Example Request

```
GET /landlord/listings?query=apartment&page=1&limit=10
```

### Success Response (200)

```json
{
  "listings": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15
  }
}
```

---

## 2. Get Landlord Listing by ID

### Endpoint

```
GET /landlord/listings/{id}
```

### Example Request

```
GET /landlord/listings/listing_123
```

### Success Response (200)

```json
{
  "id": "listing_123",
  "title": "Luxury Apartment",
  "description": "...",
  "price": 5000000,
  "status": "approved",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

---

## 3. Get Listing Preview by Slug

### Endpoint

```
GET /landlord/listings/preview/{slug}
```

### Example Request

```
GET /landlord/listings/preview/luxury-apartment-lagos
```

### Success Response (200)

```json
{
  "slug": "luxury-apartment-lagos",
  "title": "Luxury Apartment",
  "preview": "...",
  "images": [...]
}
```

---

## 4. Edit Listing

### Endpoint

```
POST /landlord/listings/edit
```

### Request Body

```json
{
  "id": "listing_123",
  "data": {
    "title": "Updated Title",
    "description": "Updated description",
    "price": 5500000
  }
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Listing updated successfully"
}
```

### Error Response (400)

```json
{
  "status": "error",
  "message": "Missing listing ID or data"
}
```

**Note:** Requires landlord authentication

---

# User Applications API

## 1. Get All User Applications

### Endpoint

```
GET /user/applications
```

### Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| query     | string | No       | -       |
| page      | number | No       | 1       |
| limit     | number | No       | 10      |

### Example Request

```
GET /user/applications?page=1&limit=10
```

### Success Response (200)

```json
{
  "status": "success",
  "data": {
    "applications": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 20
    }
  }
}
```

---

## 2. Get Application by ID

### Endpoint

```
GET /user/applications/{id}
```

### Example Request

```
GET /user/applications/app_123
```

### Success Response (200)

```json
{
  "status": "success",
  "data": {
    "id": "app_123",
    "listingId": "listing_456",
    "status": "pending",
    "profileData": {...},
    "employmentDetails": {...},
    "rentalHistory": {...}
  }
}
```

---

## 3. Get Approved Applications

### Endpoint

```
GET /user/applications/approved
```

### Success Response (200)

```json
{
  "applications": [...]
}
```

---

## 4. Get Pending Applications

### Endpoint

```
GET /user/applications/pending
```

### Success Response (200)

```json
{
  "applications": [...]
}
```

---

## 5. Get Reviewing Applications

### Endpoint

```
GET /user/applications/reviewing
```

### Success Response (200)

```json
{
  "applications": [...]
}
```

---

## 6. Get Rejected Applications

### Endpoint

```
GET /user/applications/rejected
```

### Success Response (200)

```json
{
  "applications": [...]
}
```

---

## 7. Submit Application

### Endpoint

```
POST /user/applications/submit
```

### Request Body

```json
{
  "id": "listing_123",
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+234123456789"
  }
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Application submitted successfully"
}
```

### Error Response (400)

```json
{
  "status": "error",
  "message": "Application ID and data required"
}
```

---

## 8. Update Profile

### Endpoint

```
POST /user/applications/update-profile
```

### Request Body

```json
{
  "listingId": "listing_123",
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+234123456789",
    "address": "123 Main St"
  }
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Profile updated successfully"
}
```

---

## 9. Update Employment Details

### Endpoint

```
POST /user/applications/update-employment
```

### Request Body

```json
{
  "id": "app_123",
  "data": {
    "employer": "Tech Company",
    "position": "Software Engineer",
    "salary": 500000,
    "startDate": "2023-01-01"
  }
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Employment details updated successfully"
}
```

---

## 10. Update Rental History

### Endpoint

```
POST /user/applications/update-rental-history
```

### Request Body

```json
{
  "id": "app_123",
  "data": {
    "previousAddress": "456 Old St",
    "landlordName": "Mr. Smith",
    "landlordPhone": "+234987654321",
    "duration": "2 years"
  }
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Rental history updated successfully"
}
```

**Note:** All user application endpoints require authentication

---

# User Actions API

## Save/Unsave Listing

### Endpoint

```
POST /save-listing
```

### Request Body

```json
{
  "id": "listing_123"
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Listing saved successfully"
}
```

### Error Response (500)

```json
{
  "status": "error",
  "message": "Something went wrong"
}
```

**Note:** Requires user authentication

---

# User Bookings API

## 1. Cancel Booking

### Endpoint

```
POST /bookings/cancel
```

### Request Body

```json
{
  "id": "booking_123"
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Booking cancelled successfully"
}
```

### Error Response (400)

```json
{
  "status": "error",
  "message": "Booking ID required"
}
```

---

## 2. Apply for Listing

### Endpoint

```
POST /bookings/apply
```

### Request Body

```json
{
  "id": "booking_123"
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Application submitted successfully"
}
```

---

## 3. Mark as Not Sure

### Endpoint

```
POST /bookings/not-sure
```

### Request Body

```json
{
  "id": "booking_123"
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Booking marked as not sure"
}
```

---

## 4. Mark as Uninterested

### Endpoint

```
POST /bookings/uninterested
```

### Request Body

```json
{
  "id": "booking_123",
  "data": {
    "reason": "Too expensive",
    "feedback": "Looking for something cheaper"
  }
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Feedback saved successfully"
}
```

### Error Response (400)

```json
{
  "status": "error",
  "message": "Booking ID and feedback data required"
}
```

**Note:** All booking endpoints require user authentication

---

# User Leases API

## 1. Get My Leases

### Endpoint

```
GET /user/leases
```

### Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| query     | string | No       | -       |
| page      | number | No       | 1       |
| limit     | number | No       | -       |

### Example Request

```
GET /user/leases?page=1&limit=10
```

### Success Response (200)

```json
{
  "leases": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

---

## 2. Get Lease Details

### Endpoint

```
GET /user/leases/{id}
```

### Example Request

```
GET /user/leases/lease_123
```

### Success Response (200)

```json
{
  "id": "lease_123",
  "listingId": "listing_456",
  "startDate": "2025-02-01",
  "endDate": "2026-02-01",
  "monthlyRent": 150000,
  "status": "active"
}
```

---

## 3. Get Lease Payments

### Endpoint

```
GET /user/leases/{id}/payments
```

### Example Request

```
GET /user/leases/lease_123/payments
```

### Success Response (200)

```json
{
  "payments": [
    {
      "id": "payment_123",
      "amount": 150000,
      "status": "paid",
      "dueDate": "2025-02-01",
      "paidDate": "2025-01-31"
    }
  ]
}
```

---

## 4. Accept Lease Agreement

### Endpoint

```
POST /user/leases/accept-agreement
```

### Request Body

```json
{
  "id": "lease_123",
  "moveInDate": "2025-02-01",
  "startDate": "2025-02-01",
  "endDate": "2026-02-01",
  "signature": "data:image/png;base64,..."
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Lease agreement accepted"
}
```

### Error Response (400)

```json
{
  "status": "error",
  "message": "Missing required fields"
}
```

---

## 5. Cancel Lease

### Endpoint

```
POST /user/leases/cancel
```

### Request Body

```json
{
  "id": "lease_123"
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Lease cancelled successfully"
}
```

---

## 6. Mark Lease as Paid

### Endpoint

```
POST /user/leases/mark-paid
```

### Request Body

```json
{
  "id": "lease_123",
  "amount": 150000,
  "trxref": "TRX123456",
  "transaction": "trans_789",
  "reference": "REF123",
  "status": "PAID",
  "method": "card"
}
```

### Success Response (200)

```json
{
  "status": "success",
  "message": "Payment recorded successfully"
}
```

### Error Response (400)

```json
{
  "status": "error",
  "message": "Missing required payment fields"
}
```

**Note:** All lease endpoints require user authentication

---

# User Payments API

## 1. Get My Payments

### Endpoint

```
GET /user/payments
```

### Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| query     | string | No       | -       |
| page      | number | No       | 1       |
| limit     | number | No       | -       |

### Example Request

```
GET /user/payments?page=1&limit=10
```

### Success Response (200)

```json
{
  "payments": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15
  }
}
```

---

## 2. Get Payment Details

### Endpoint

```
GET /user/payments/{id}
```

### Example Request

```
GET /user/payments/payment_123
```

### Success Response (200)

```json
{
  "id": "payment_123",
  "leaseId": "lease_456",
  "amount": 150000,
  "status": "paid",
  "method": "card",
  "reference": "REF123",
  "paidDate": "2025-01-31"
}
```

**Note:** All payment endpoints require user authentication

---

# User Profile API

## Get User Info

### Endpoint

```
GET /user/info
```

### Success Response (200)

```json
{
  "id": "user_123",
  "email": "john@example.com",
  "name": "John Doe",
  "phone": "+234123456789",
  "role": "user",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

**Note:** Requires user authentication

---

# File Upload API

## 1. Get Upload URL

### Endpoint

```
POST /upload
```

### Request Body

```json
{
  "fileName": "apartment-photo.jpg",
  "contentType": "image/jpeg",
  "size": 2048576,
  "isImage": true
}
```

| Field       | Type    | Required | Description                  |
| ----------- | ------- | -------- | ---------------------------- |
| fileName    | string  | Yes      | Name of the file             |
| contentType | string  | Yes      | MIME type (e.g., image/jpeg) |
| size        | number  | Yes      | File size in bytes           |
| isImage     | boolean | Yes      | Whether file is an image     |

### Success Response (200)

```json
{
  "presignedUrl": "https://s3.amazonaws.com/...",
  "key": "uuid-apartment-photo.jpg"
}
```

### Error Response (400)

```json
{
  "error": "Invalid request body"
}
```

### Usage Flow

1. Call this endpoint to get a presigned URL
2. Upload file directly to S3 using the presigned URL (PUT request)
3. Save the returned `key` for future reference

**Note:** Presigned URL expires in 6 minutes

---

## 2. Delete File

### Endpoint

```
DELETE /upload
```

### Request Body

```json
{
  "key": "uuid-apartment-photo.jpg"
}
```

### Success Response (200)

```json
{
  "message": "File deleted successfully"
}
```

### Error Response (400)

```json
{
  "error": "Missing or invalid object key"
}
```

### Error Response (429)

```json
{
  "error": "Duude not good"
}
```

**Note:** Rate limited to 5 requests per minute per user

---

## Upload Flow Example

### Step 1: Get Presigned URL

```bash
POST /upload
{
  "fileName": "photo.jpg",
  "contentType": "image/jpeg",
  "size": 1024000,
  "isImage": true
}

Response: {
  "presignedUrl": "https://...",
  "key": "uuid-photo.jpg"
}
```

### Step 2: Upload to S3

```bash
PUT {presignedUrl}
Content-Type: image/jpeg
Body: [binary file data]
```

### Step 3: Save Key

Store the `key` in your database/application for future reference.

### Step 4: Delete (if needed)

```bash
DELETE /upload
{
  "key": "uuid-photo.jpg"
}
```

**Note:** All upload endpoints require user authentication

---

# General APIs

## 1. Get Categories

### Endpoint

```
GET /categories
```

### Success Response (200)

```json
{
  "categories": [
    {
      "id": "cat_123",
      "name": "Apartment",
      "slug": "apartment"
    }
  ]
}
```

---

## 2. Get Amenities

### Endpoint

```
GET /amenities
```

### Success Response (200)

```json
{
  "amenities": [
    {
      "id": "amen_123",
      "name": "Swimming Pool",
      "icon": "pool"
    }
  ]
}
```

---

## 3. Get Booking Timelines

### Endpoint

```
GET /bookings/{id}/timelines
```

### Example Request

```
GET /bookings/booking_123/timelines
```

### Success Response (200)

```json
{
  "timelines": [
    {
      "id": "timeline_123",
      "status": "confirmed",
      "timestamp": "2025-01-15T10:00:00Z",
      "message": "Booking confirmed"
    }
  ]
}
```

---

# Admin APIs

## Admin Applications Management

### 1. Get All Applications

#### Endpoint

```
GET /admin/applications
```

#### Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| query     | string | No       | -       |
| page      | number | No       | 1       |
| limit     | number | No       | -       |

#### Example Request

```
GET /admin/applications?page=1&limit=20
```

#### Success Response (200)

```json
{
  "applications": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

---

### 2. Get Application by ID

#### Endpoint

```
GET /admin/applications/{id}
```

#### Example Request

```
GET /admin/applications/app_123
```

#### Success Response (200)

```json
{
  "id": "app_123",
  "userId": "user_456",
  "listingId": "listing_789",
  "status": "pending",
  "submittedAt": "2025-01-15T10:00:00Z"
}
```

#### Error Response (404)

```json
{
  "message": "Application not found"
}
```

---

### 3. Get Approved Applications

#### Endpoint

```
GET /admin/applications/approved
```

#### Query Parameters

Same as "Get All Applications"

#### Success Response (200)

```json
{
  "applications": [...]
}
```

---

### 4. Get Rejected Applications

#### Endpoint

```
GET /admin/applications/rejected
```

#### Query Parameters

Same as "Get All Applications"

#### Success Response (200)

```json
{
  "applications": [...]
}
```

---

### 5. Get Pending Review Applications

#### Endpoint

```
GET /admin/applications/pending-review
```

#### Query Parameters

Same as "Get All Applications"

#### Success Response (200)

```json
{
  "applications": [...]
}
```

---

### 6. Get Uncompleted Applications

#### Endpoint

```
GET /admin/applications/uncompleted
```

#### Query Parameters

Same as "Get All Applications"

#### Success Response (200)

```json
{
  "applications": [...]
}
```

---

### 7. Approve Application

#### Endpoint

```
POST /admin/applications/approve
```

#### Request Body

```json
{
  "id": "app_123"
}
```

#### Success Response (200)

```json
{
  "status": "success",
  "message": "Application approved successfully"
}
```

#### Error Response (400)

```json
{
  "status": "error",
  "message": "Application ID required"
}
```

---

### 8. Reject Application

#### Endpoint

```
POST /admin/applications/reject
```

#### Request Body

```json
{
  "id": "app_123",
  "data": {
    "reason": "Incomplete documentation",
    "notes": "Missing proof of income"
  }
}
```

#### Success Response (200)

```json
{
  "status": "success",
  "message": "Application rejected successfully"
}
```

#### Error Response (400)

```json
{
  "status": "error",
  "message": "Missing id or data"
}
```

**Note:** All admin application endpoints require admin authentication

---

## Admin Categories Management

### Create Category

#### Endpoint

```
POST /admin/categories/create
```

#### Request Body

```json
{
  "name": "Villa",
  "slug": "villa",
  "description": "Luxury villas"
}
```

#### Success Response (200)

```json
{
  "status": "success",
  "message": "Category created successfully",
  "category": {
    "id": "cat_123",
    "name": "Villa",
    "slug": "villa"
  }
}
```

#### Error Response (400)

```json
{
  "status": "error",
  "message": "Category data required"
}
```

**Note:** Requires admin authentication

---

## Need Help?

Contact the backend team for API issues or questions.
