# User Appointments API Documentation

## Overview
This API provides endpoints for users to manage their appointments with lawyers.

## Base URL
```
http://localhost:5001/api/user/appointments
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header.

## Endpoints

### 1. Get User Appointments
**GET** `/api/user/appointments`

Retrieves all appointments for the authenticated user.

**Query Parameters:**
- `start` (optional): Start date filter (ISO string)
- `end` (optional): End date filter (ISO string)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Consultation",
      "description": "Legal consultation",
      "event_type": "consultation",
      "start_date_time": "2024-12-20T14:00:00.000Z",
      "end_date_time": "2024-12-20T15:00:00.000Z",
      "client_id": 1,
      "lawyer_id": null,
      "lawyer_name": "John Doe",
      "status": "scheduled",
      "created_at": "2024-12-04T10:00:00.000Z"
    }
  ]
}
```

### 2. Create User Appointment
**POST** `/api/user/appointments`

Creates a new appointment for the authenticated user.

**Request Body:**
```json
{
  "title": "Consultation Meeting",
  "date": "2024-12-20",
  "time": "14:00",
  "type": "consultation",
  "lawyer_name": "John Doe",
  "description": "Initial consultation about case"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Consultation Meeting",
    "start_date_time": "2024-12-20T14:00:00.000Z",
    "end_date_time": "2024-12-20T15:00:00.000Z",
    "client_id": 1,
    "status": "scheduled"
  }
}
```

### 3. Update User Appointment
**PUT** `/api/user/appointments/:id`

Updates an existing appointment for the authenticated user.

**Request Body:** (same as create, all fields optional)
```json
{
  "title": "Updated Consultation",
  "date": "2024-12-21",
  "time": "15:00"
}
```

### 4. Delete User Appointment
**DELETE** `/api/user/appointments/:id`

Deletes an appointment for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Appointment deleted successfully"
  }
}
```

### 5. Get Upcoming Appointments
**GET** `/api/user/appointments/upcoming`

Retrieves upcoming appointments for the authenticated user.

**Query Parameters:**
- `days` (optional): Number of days to look ahead (default: 30)

## Appointment Types
- `consultation`: Legal consultation
- `meeting`: General meeting
- `court`: Court hearing
- `review`: Document review

## Frontend Integration

The frontend Calendar component (`Frontend/src/pages/userdashboard/Calendar.jsx`) integrates with these APIs to:

1. Display appointments in a calendar view
2. Create new appointments via modal
3. Show upcoming appointments list
4. Delete appointments with confirmation

## Usage Example

```javascript
// Fetch appointments for current month
const response = await api.get('/user/appointments', {
  params: {
    start: startOfMonth.toISOString(),
    end: endOfMonth.toISOString()
  }
});

// Create new appointment
const newAppointment = await api.post('/user/appointments', {
  title: 'Legal Consultation',
  date: '2024-12-20',
  time: '14:00',
  type: 'consultation',
  lawyer_name: 'John Smith'
});
```

## Notes
- Appointments are automatically set to 1-hour duration
- The `lawyer_id` field is initially null and can be set when a lawyer accepts the appointment
- All dates are stored in UTC and should be converted to local time in the frontend
- The system supports different appointment types for better categorization