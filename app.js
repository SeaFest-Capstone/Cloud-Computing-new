const express = require('express');
const bodyParser = require('body-parser');
const { serverTimestamp } = require('firebase/firestore');
const { nanoid } = require("nanoid");
const { auth, firestore, UserCollection, FishCollection, CartCollection,HistoryCollection,CheckoutCollection } = require('./config');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth');
const { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, addDoc, deleteDoc } = require('firebase/firestore');
const { storage } = require('./config');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const multer = require('multer');
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
const myKey = require('./private/key.json').myKey;


const validateApiKey = (req, res, next) => {
  console.log('Validating API Key');
  const apiKey = req.headers['api-key'];

  if (!apiKey || apiKey !== myKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

const app = express();

app.use(validateApiKey);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, Express and Firebase!');
});


// autentikasi==================================================================================================================
app.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password == confirmPassword) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(firestore, UserCollection, user.uid);
      await setDoc(userDocRef, {
        username,
        email,
        noTelp:"empty",
        alamat:"empty",
        foto:"empty",
      });
      res.send({ message: 'Register Successful', user: { 
        username: username,
        email: email,
       } });
    } catch (err) {
      console.error('Registration failed:', err.message);
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }

  }else{
    return res.status(400).json({ message: 'Password and Confirm Password do not match' });
  }

});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDocRef = doc(firestore, UserCollection, user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      res.status(200).json({ message: 'Login successful', user: { uid: user.uid, ...userData } });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});


// View Profile
app.get('/profile/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const userDoc = await getDoc(doc(firestore, UserCollection, userId));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      res.status(200).json({ message: "Successfull view profile", data: userData});
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ message: 'Error fetching user profile', error: err.message });
  }
});

// Update Profile
app.put('/updateProfile/:uid', upload.single('photoProfile'), async (req, res) => {
  try {
    const uid = req.params.uid;
    const userDataToUpdate = req.body;
    const file = req.file;

    if (file) {
      const fileExt = file.originalname.split('.').pop().toLowerCase();
      const contentType = allowedImageTypes.includes(`image/${fileExt}`) ? `image/${fileExt}` : 'image/jpeg';

      const storageRef = ref(storage, `profilePhotos/${uid}/${file.originalname}`);

      const metadata = {
        contentType: contentType,
      };

      await uploadBytes(storageRef, file.buffer, metadata);

      const photoProfile = await getDownloadURL(storageRef);

      userDataToUpdate.photoProfile = photoProfile;
    }

    const userDocRef = doc(firestore, UserCollection, uid);
    await updateDoc(userDocRef, userDataToUpdate);

    res.status(200).json({ message: 'User updated successfully', photoProfile: userDataToUpdate.photoProfile });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});
// autentikasi==================================================================================================================


// fish==================================================================================================================
// Add Fish
app.post('/add-fish', upload.single('fishPhoto'), async (req, res) => {
  const {
    nameFish,
    price,
    benefit,
    habitat,
    description,
    userId,
  } = req.body;

  const file = req.file;
  const fishIdCart = `US-${nanoid()}`
  try {
    const fishCollectionRef = collection(firestore, FishCollection);

    let photoUrl = ''; 

    if (file) {
      const fileExt = file.originalname.split('.').pop().toLowerCase();
      const contentType = allowedImageTypes.includes(`image/${fileExt}`) ? `image/${fileExt}` : 'image/jpeg';

      const storageRef = ref(storage, `fishPhotos/${nanoid()}/${file.originalname}`);

      const metadata = {
        contentType: contentType,
      };

      await uploadBytes(storageRef, file.buffer, metadata);

      photoUrl = await getDownloadURL(storageRef);
    }

    const newFishDocRef = await addDoc(fishCollectionRef, {
      nameFish,
      price,
      benefit,
      habitat,
      description,
      photoUrl,
      userId,
      fishIdCart
    });

    res.status(201).json({
      message: 'Fish added successfully',
      fishId: newFishDocRef.id, 
      photoUrl: photoUrl, 
    });
  } catch (err) {
    console.error('Error adding fish:', err.message);
    res.status(500).json({ message: 'Error adding fish', error: err.message });
  }
});

app.get('/fish/habitat/:habitat', async (req, res) => {
  const habitat = req.params.habitat;

  try {
    // Reference to the FishCollection
    const fishCollectionRef = collection(firestore, FishCollection);

    // Query fish by habitat
    const q = query(fishCollectionRef, where('habitat', '==', habitat));
    const querySnapshot = await getDocs(q);

    // Map query results to an array with UID included
    const fishArray = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id, // Add UID to the response
        ...data,
      };
    });

    res.status(200).json({ message: "Successfully view all fish data by habitat", listFish: fishArray});
  } catch (err) {
    console.error('Error fetching fish by habitat:', err.message);
    res.status(500).json({ message: 'Error fetching fish by habitat', error: err.message });
  }
});

//nampilin detail ikannya
app.get('/fish/detail/:fishId', async (req, res) => {
  const fishId = req.params.fishId;

  try {
    // Reference to the FishCollection
    const fishDocRef = doc(firestore, FishCollection, fishId);

    // Retrieve the fish document
    const fishDoc = await getDoc(fishDocRef);

    if (fishDoc.exists()) {
      const fishData = fishDoc.data();
      res.status(200).json({
        message: "Successfully view detail fish",
        fish: 
        { uid: fishDoc.id, // Add UID to the response
        ...fishData,
      }
  });
    } else {
      res.status(404).json({ message: 'Fish not found' });
    }
  } catch (err) {
    console.error('Error fetching fish:', err.message);
    res.status(500).json({ message: 'Error fetching fish', error: err.message });
  }
});
// fish==================================================================================================================

// cart==================================================================================================================
// Add to Cart
app.post('/add-to-cart/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { fishIdCart } = req.body;

  try {
    const cartCollectionRef = collection(firestore, CartCollection);
    const newCartItemRef = await addDoc(cartCollectionRef, {
      userId,
      fishIdCart,
    });

    res.status(201).json({
      message: 'Item added to cart',
      cartItemId: newCartItemRef.id,
    });
  } catch (err) {
    console.error('Error adding to cart:', err.message);
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
});

// Endpoint untuk menampilkan cart berdasarkan userId
app.get('/view-cart/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const cartcollsction = collection(firestore, CartCollection);
    const q = query(cartcollsction, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No bookmarks found for this user' });
    }

    const cartData = [];
    for (const doc of querySnapshot.docs) {
      const cart = doc.data();
      const fishIdCart = cart.fishIdCart;
          
      const fishcollection = collection(firestore, FishCollection);
      const fishQuery = query(fishcollection, where('fishIdCart', '==', fishIdCart));
      const fishQuerySnapshot = await getDocs(fishQuery);

      if (!fishQuerySnapshot.empty) {
        const fishDoc = fishQuerySnapshot.docs[0];
        const fishData = fishDoc.data();
        cartData.push({ cart, fishData });
      }
    }

    res.status(200).json({ message: 'Cart fish found', bookmarks: cartData });
  } catch (error) {
    console.error('Error getting cart:', error.message);
    res.status(500).json({ message: 'Error getting cart', error: error.message });
  }
});

// View Cart nyimpen cekout
app.post('/checkout/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { totalPrice, fishDetails } = req.body;

  try {
    // Save the checkout details to CheckoutCollection
    const checkoutCollectionRef = collection(firestore, CheckoutCollection);
    const newCheckoutRef = await addDoc(checkoutCollectionRef, {
      userId,
      totalPrice,
      items: fishDetails,
      timestamp: serverTimestamp(),
    });

    res.status(201).json({
      message: 'Checkout successful',
      checkoutId: newCheckoutRef.id,
    });
  } catch (err) {
    console.error('Error during checkout:', err.message);
    res.status(500).json({ message: 'Error during checkout', error: err.message });
  }
});


// history dan scan==================================================================================================================

app.post('/addScanResult', upload.single('fishPhoto'), async (req, res) => {
  const {
    userId,
    fishStatus,
    fishName,
  } = req.body;

  const scanDate = new Date().toISOString();
  const scanId = `SCAN-${nanoid()}`;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    if (!file.originalname) {
      return res.status(400).json({ message: 'File has no original name' });
    }

    const fileExt = file.originalname.split('.').pop().toLowerCase();
    const contentType = allowedImageTypes.includes(`image/${fileExt}`) ? `image/${fileExt}` : 'image/jpeg';

    const storageRef = ref(storage, `fishScan/${scanId}/${file.originalname}`);


    const metadata = {
      contentType: contentType,
    };

    await uploadBytes(storageRef, file.buffer, metadata);

    const photoUrl = await getDownloadURL(storageRef);

    const scanDocRef = await addDoc(collection(firestore, HistoryCollection), {
      scanId: scanId,
      userId: userId,
      fishStatus: fishStatus,
      fishName: fishName,
      photoUrl: photoUrl,
      scanDate: scanDate,
    });

    res.send({ message: 'Scan Result Added', photoUrl: photoUrl });
  } catch (err) {
    console.error('Error adding scan result:', err.message);
    res.status(500).json({ message: 'Error adding scan result', error: err.message });
  }
});

// Get Scan History by UserId
app.get('/scan-history/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const historyCollectionRef = collection(firestore,HistoryCollection);
    const q = query(historyCollectionRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    // Map query results to an array
    const scanHistoryArray = querySnapshot.docs.map((doc) => doc.data());

    res.status(200).json(scanHistoryArray);
  } catch (err) {
    console.error('Error fetching scan history:', err.message);
    res.status(500).json({ message: 'Error fetching scan history', error: err.message });
  }
});

// Get Detail Fish from History by FishName
app.get('/history-detail', async (req, res) => {
  const { fishName } = req.body;

  try {
    // Reference to the HistoryCollection
    const historyCollectionRef = collection(firestore, HistoryCollection);

    // Query scan history by fishName
    const q = query(historyCollectionRef, where('fishName', '==', fishName));
    const querySnapshot = await getDocs(q);

    // Check if there's any history for the given fishName
    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No history found for the fish' });
    }

    // Assuming there's only one history for the given fishName
    const historyData = querySnapshot.docs[0].data();
    const { fishName: historyFishName, userId } = historyData; // Rename fishName here

    // Retrieve details of the fish from FishCollection
    const fishCollectionRef = collection(firestore, FishCollection);
    const fishQuery = query(fishCollectionRef, where('nameFish', '==', historyFishName)); // Use the renamed variable here
    const fishSnapshot = await getDocs(fishQuery);

    if (fishSnapshot.empty) {
      return res.status(404).json({ message: 'Fish details not found' });
    }

    const fishDetails = fishSnapshot.docs[0].data();

    // Combine history data with fish details
    const result = {
      fishName: historyFishName, // Use the renamed variable here
      userId,
      fishDetails,
    };

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching history detail:', err.message);
    res.status(500).json({ message: 'Error fetching history detail', error: err.message });
  }
});







module.exports = app;

