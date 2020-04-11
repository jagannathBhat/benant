# benant

An app that helps people determine if a tumor on their skin is Benign or Malignant.

## Thank You

I would like to thank my friends Amal Menon and Arya Nair for gathering the images for training the model.

## How to Use

1. Download this repo.
2. Install [NodeJS](https://nodejs.org/en/download/), [Python](https://www.python.org/downloads/) and [Pip](https://pip.pypa.io/en/stable/installing/).
3. Run the following commands inside the folder. (It might take a few minutes to execute)

   ```bash
   npm run install
   npm run build
   npm start
   ```

4. Open the web app on <http://localhost:5000>.

## How it works

Open Development servers using the following command.

```bash
   npm run dev
```

### Model Training

- The model for skin cancer detection was developed using Keras.
- An image classifier is used to classify if an image shows a cancerous tumor or not.

### Backend

- Keras is used to load the trained model and detect if uploaded image shows a cancerous tumor or not.
- The server is built using Flask.

### Frontend

- The frontend uses ReactJS.
