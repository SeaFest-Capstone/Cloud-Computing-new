# FishApp API Documentation

## Authentication

### Register User

**Endpoint:** `POST /register`

**Request:**
```json
{
  "username": "example",
  "email": "example@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
- `200 OK` - Success
  ```json
  {
    "message": "Register Successful",
    "user": {
      "username": "example",
      "email": "example@example.com"
    }
  }
  ```

- `400 Bad Request` - User already exists
  ```json
  {
    "message": "User already exists"
  }
  ```

- `400 Bad Request` - Password and Confirm Password do not match
  ```json
  {
    "message": "Password and Confirm Password do not match"
  }
  ```

- `500 Internal Server Error` - Email already used
  ```json
  {
    "message": "Email already used",
    "error": "Error message"
  }
  ```

### Login User

**Endpoint:** `POST /login`

**Request:**
```json
{
  "email": "example@example.com",
  "password": "password123"
}
```

**Response:**
- `200 OK` - Success
  ```json
  {
    "message": "Login Successful",
    "user": {
      "uid": "user_id",
      "username": "example",
      "email": "example@example.com",
      "token": "random_token"
    }
  }
  ```

- `404 Not Found` - User not found
  ```json
  {
    "message": "User not found"
  }
  ```

- `500 Internal Server Error` - Email or password is invalid
  ```json
  {
    "message": "Email or password is invalid",
    "error": "Error message"
  }
  ```

## User Profile

### View Profile

**Endpoint:** `GET /profile/:userId`

**Response:**
- `200 OK` - Success
  ```json
  {
    "message": "Successful view profile",
    "data": {
      "username": "example",
      "email": "example@example.com",
      "noTelp": "empty",
      "alamat": "empty",
      "photoProfile": "empty"
    }
  }
  ```

- `404 Not Found` - User not found
  ```json
  {
    "message": "User not found"
  }
  ```

### Update Profile

**Endpoint:** `PUT /updateProfile/:uid`

**Request:**
- Form data including optional `photoProfile` field

**Response:**
- `200 OK` - Success
  ```json
  {
    "message": "User updated successfully",
    "photoProfile": "updated_photo_url"
  }
  ```

- `500 Internal Server Error` - Error updating user
  ```json
  {
    "message": "Error updating user",
    "error": "Error message"
  }
  ```

## Fish

### Add Fish

**Endpoint:** `POST /add-fish`

**Request:**
- Form data including `nameFish`, `price`, `benefit`, `habitat`, `description`, `userId`, and optional `fishPhoto`

**Response:**
- `201 Created` - Success
  ```json
  {
    "message": "Fish added successfully",
    "fishId": "new_fish_id",
    "photoUrl": "fish_photo_url"
  }
  ```

- `500 Internal Server Error` - Error adding fish
  ```json
  {
    "message": "Error adding fish",
    "error": "Error message"
  }
  ```

### View Fish by Habitat

**Endpoint:** `GET /fish/habitat/:habitat`

**Response:**
- `200 OK` - Success
  ```json
  {
    "message": "Successfully view all fish data by habitat",
    "listFish": [
      {
        "uid": "fish_id",
        "nameFish": "Fish Name",
        "price": 10.99,
        "benefit": "Fish benefit",
        "habitat": "Fish habitat",
        "description": "Fish description",
        "userId": "user_id",
        "photoUrl": "fish_photo_url"
      }
    ]
  }
  ```

- `500 Internal Server Error` - Error fetching fish by habitat
  ```json
  {
    "message": "Error fetching fish by habitat",
    "error": "Error message"
  }
  ```

### View Fish Detail

**Endpoint:** `GET /fish/detail/:fishId`

**Response:**
- `200 OK` - Success
  ```json
  {
    "message": "Successfully view detail fish",
    "fish": {
      "uid": "fish_id",
      "nameFish": "Fish Name",
      "price": 10.99,
      "benefit": "Fish benefit",
      "habitat": "Fish habitat",
      "description": "Fish description",
      "userId": "user_id",
      "photoUrl": "fish_photo_url"
    }
  }
  ```

- `404 Not Found` - Fish not found
  ```json
  {
    "message": "Fish not found"
  }
  ```

## Cart

### Add to Cart

**Endpoint:** `POST /add-to-cart/:userId`

**Request:**
```json
{
  "fishIdCart": "US-random_id"
}
```

**Response:**
- `201 Created` - Success
  ```json
  {
    "message": "Item added to cart",
    "cartItemId": "new_cart_item_id"
  }
  ```

- `500 Internal Server Error` - Error adding to cart
  ```json
  {
    "message": "Error adding to cart",
    "error": "Error message"
  }
  ```

### View Cart

**Endpoint:** `GET /view-cart/:userId`

**Response:**
- `200 OK` - Success
  ```json
  {
    "message": "Cart fish found",
    "cart": [
      {
        "cart": {
          "userId": "user_id",
          "fishIdCart": "US-random_id"
        },
        "fishData": {
          "uid": "fish_id",
          "nameFish": "Fish Name",
          "price": 10.99,
          "benefit": "Fish benefit",
          "habitat": "Fish habitat",
          "description": "Fish description",
          "userId": "user_id",
          "photoUrl": "fish_photo_url"
        }
      }
    ]
  }
  ```

- `404 Not Found` - No bookmarks found for this user
  ```json
  {
    "message": "No bookmarks found for this user"
  }
  ```

### Checkout Cart

**Endpoint:** `POST /checkout/:userId`

**Request:**
```json
{
  "fishIdCart": "US-random_id"
}
```

**Response:**
- `201 Created` - Checkout successful
  ```json
  {
    "message": "Checkout successful",
    "fishIdCart": "US-random_id"
  }
  ```

- `500 Internal Server Error` - Error during checkout
  ```json
  {
    "message": "Error during checkout",
    "error": "Error message"
  }
  ```

## History and Scan

### Add Scan Result

**Endpoint:** `POST /addScanResult`

**Request:**
- Form data including `userId`, `fishStatus`, `fishName`, and `fishPhoto`

**Response:**
- `200 OK` - Success
  ```json
  {
    "message": "Scan Result Added",
    "photoUrl": "scan_result_photo_url"
  }
  ```

- `400 Bad Request` - No file uploaded or file has no original name
  ```json
  {
    "message": "No file uploaded"
  }
  ```

- `500 Internal Server Error` - Error adding scan result
  ```json
  {
    "message": "Error adding scan result",
    "error": "Error message"
  }
  ```

### Get Scan History by UserId

**Endpoint:** `GET /scan-history/:userId`

**Response:**
- `200 OK` - Success
  ```json
  [
    {
      "scanId": "SCAN-random_id",
      "userId": "user_id",
      "fishStatus": "Fish Status",
      "fishName": "Fish Name",
      "photoUrl": "scan_result_photo_url",
      "scanDate": "scan_date"
    }
  ]
  ```

- `500 Internal Server Error` - Error fetching scan history
  ```json
  {
    "message": "Error fetching scan history",
    "error": "Error message"
  }
  ```

### Get Detail Fish from History by FishName

**Endpoint:** `GET /history-detail`

**Request:**
```json
{
  "fishName": "Fish Name"
}
```

**Response:**
- `200 OK` - Success
  ```json
  {
    "fishName": "Fish Name",
    "userId": "user_id",
    "fishDetails": {
      "uid": "fish_id",
      "nameFish": "Fish Name",
      "price": 10.99,
      "benefit": "Fish benefit",
      "habitat": "Fish habitat",
      "description": "Fish description",
      "userId": "user_id",
      "photoUrl": "fish_photo_url"
    }
  }
  ```

- `404 Not Found` - No history found for the fish
  ```json
  {
    "message": "No history found for the fish"
  }
  ```

- `500 Internal Server Error` - Error fetching history detail
  ```json
  {
    "message": "Error fetching history detail",
    "error": "Error message"
  }
  ```

---

This documentation provides details on the endpoints, request formats, and possible response scenarios for the FishApp API. Use the provided information to interact with the API endpoints accordingly.