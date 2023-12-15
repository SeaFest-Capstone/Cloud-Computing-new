# Fish App API Documentation

## Authentication

### Register

- **Endpoint:** `/register`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**
  - `username` (string): User's username.
  - `email` (string): User's email address.
  - `password` (string): User's password.
  - `confirmPassword` (string): Confirm the user's password.
- **Response:**
  - Success (Status 200):
    - Message: 'Register Successful'
    - User Object:
      - `username` (string): User's username.
      - `email` (string): User's email address.
  - Failure (Status 400):
    - Message: 'Password and Confirm Password do not match'
  - Failure (Status 500):
    - Message: 'Registration failed'
    - Error: Error message details.

### Login

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Logs in a registered user.
- **Request Body:**
  - `email` (string): User's email address.
  - `password` (string): User's password.
- **Response:**
  - Success (Status 200):
    - Message: 'Login successful'
    - User Object:
      - `uid` (string): User's unique identifier.
      - Other user details.
  - Failure (Status 404):
    - Message: 'User not found'
  - Failure (Status 500):
    - Message: 'Login failed'
    - Error: Error message details.

### View Profile

- **Endpoint:** `/profile/:userId`
- **Method:** `GET`
- **Description:** Retrieves the profile information of a user.
- **Parameters:**
  - `userId` (string): Unique identifier of the user.
- **Response:**
  - Success (Status 200):
    - Message: 'Successful view profile'
    - Data: User profile details.
  - Failure (Status 404):
    - Message: 'User not found'
  - Failure (Status 500):
    - Message: 'Error fetching user profile'
    - Error: Error message details.

### Update Profile

- **Endpoint:** `/updateProfile/:uid`
- **Method:** `PUT`
- **Description:** Updates the profile information of a user.
- **Parameters:**
  - `uid` (string): Unique identifier of the user.
- **Request Body:**
  - User details to update.
- **Response:**
  - Success (Status 200):
    - Message: 'User updated successfully'
    - Photo Profile: URL of the updated profile photo.
  - Failure (Status 500):
    - Message: 'Error updating user'
    - Error: Error message details.

---

## Fish Operations

### Add Fish

- **Endpoint:** `/add-fish`
- **Method:** `POST`
- **Description:** Adds a new fish to the database.
- **Request Body:**
  - Fish details (nameFish, price, benefit, habitat, description, userId).
  - Fish photo (uploaded using `fishPhoto` field).
- **Response:**
  - Success (Status 201):
    - Message: 'Fish added successfully'
    - Fish ID: Unique identifier of the added fish.
    - Photo URL: URL of the uploaded fish photo.
  - Failure (Status 500):
    - Message: 'Error adding fish'
    - Error: Error message details.

### View Fish by Habitat

- **Endpoint:** `/fish/habitat/:habitat`
- **Method:** `GET`
- **Description:** Retrieves a list of fish based on their habitat.
- **Parameters:**
  - `habitat` (string): Habitat of the fish.
- **Response:**
  - Success (Status 200):
    - Message: 'Successfully view all fish data by habitat'
    - ListFish: Array of fish objects with UID included.
  - Failure (Status 500):
    - Message: 'Error fetching fish by habitat'
    - Error: Error message details.

### View Fish Detail

- **Endpoint:** `/fish/detail/:fishId`
- **Method:** `GET`
- **Description:** Retrieves detailed information about a specific fish.
- **Parameters:**
  - `fishId` (string): Unique identifier of the fish.
- **Response:**
  - Success (Status 200):
    - Message: 'Successfully view detail fish'
    - Fish: Fish object with UID included.
  - Failure (Status 404):
    - Message: 'Fish not found'
  - Failure (Status 500):
    - Message: 'Error fetching fish'
    - Error: Error message details.

---

## Cart Operations

### Add to Cart

- **Endpoint:** `/add-to-cart/:userId`
- **Method:** `POST`
- **Description:** Adds a fish item to the user's cart.
- **Parameters:**
  - `userId` (string): Unique identifier of the user.
- **Request Body:**
  - `fishIdCart` (string): Unique identifier of the fish item.
- **Response:**
  - Success (Status 201):
    - Message: 'Item added to cart'
    - CartItemId: Unique identifier of the added cart item.
  - Failure (Status 500):
    - Message: 'Error adding to cart'
    - Error: Error message details.

### View Cart

- **Endpoint:** `/view-cart/:userId`
- **Method:** `GET`
- **Description:** Retrieves the user's cart items.
- **Parameters:**
  - `userId` (string): Unique identifier of the user.
- **Response:**
  - Success (Status 200):
    - Message: 'Cart fish found'
    - Bookmarks: Array of cart items with associated fish data.
  - Failure (Status 404):
    - Message: 'No bookmarks found for this user'
  - Failure (Status 500):
    - Message: 'Error getting cart'
    - Error: Error message details.

### Checkout

- **Endpoint:** `/checkout/:userId`
- **Method:** `POST`
- **Description:** Completes the checkout process and saves the details to CheckoutCollection.
- **Parameters:**
  - `userId` (string): Unique identifier of the user.
- **Request Body:**
  - `totalPrice` (number): Total price of the checkout.
  - `fishDetails` (array): Array of fish items with details.
- **Response:**
  - Success (Status 201):
    - Message: 'Checkout successful'
    - CheckoutId: Unique identifier of the checkout.
  - Failure (Status 500):
    - Message: 'Error during checkout'
    - Error: Error message details.

---

## History and Scan Operations

### Add Scan Result

- **Endpoint:** `/addScanResult`
- **Method:** `POST`
- **Description:** Adds a new scan result to the database.
- **Request Body:**
  - `userId` (string): Unique identifier of the user.
  - `fishStatus` (string): Status of the scanned fish.
  - `fishName` (string): Name of the scanned fish.
- **Request File:**
  - `fishPhoto`: Image file of the scanned fish.
- **Response:**
  - Success (Status 200):
    - Message: '

Scan Result Added'
    - PhotoUrl: URL of the uploaded scan photo.
  - Failure (Status 400):
    - Message: 'No file uploaded' or 'File has no original name'
  - Failure (Status 500):
    - Message: 'Error adding scan result'
    - Error: Error message details.

### View Scan History

- **Endpoint:** `/scan-history/:userId`
- **Method:** `GET`
- **Description:** Retrieves the scan history of a user.
- **Parameters:**
  - `userId` (string): Unique identifier of the user.
- **Response:**
  - Array of scan history objects.
  - Success (Status 200):
    - Scan history data.
  - Failure (Status 500):
    - Message: 'Error fetching scan history'
    - Error: Error message details.

### View Fish Details from History

- **Endpoint:** `/history-detail`
- **Method:** `GET`
- **Description:** Retrieves detailed information about a fish from scan history.
- **Request Body:**
  - `fishName` (string): Name of the fish to retrieve details.
- **Response:**
  - Success (Status 200):
    - FishName: Name of the fish.
    - UserId: Unique identifier of the user.
    - FishDetails: Detailed information about the fish.
  - Failure (Status 404):
    - Message: 'No history found for the fish'
  - Failure (Status 500):
    - Message: 'Error fetching history detail'
    - Error: Error message details.
