import numpy as np
import os
import pandas as pd
import random
import string
from flask import Flask, flash, request, redirect, send_from_directory, url_for
from keras.preprocessing import image
from keras.models import load_model
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

app = Flask(__name__, static_folder='../client/build')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def benignMaligant(folderpath):
    model = load_model('model.h5')
    model.compile(loss='categorical_crossentropy',
                  optimizer='rmsprop', metrics=['accuracy'])
    test_filenames = os.listdir(folderpath)
    test_df = pd.DataFrame({
        'filename': test_filenames
    })
    nb_samples = test_df.shape[0]

    test_gen = image.ImageDataGenerator(rescale=1./255)
    test_generator = test_gen.flow_from_dataframe(
        test_df,
        folderpath,
        x_col='filename',
        y_col=None,
        class_mode=None,
        target_size=(128, 128),
        batch_size=3,
        shuffle=False
    )
    predict = model.predict_generator(
        test_generator, steps=np.ceil(nb_samples/3))
    return str(predict[0][1])


def randomString():
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(24))


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return app.make_response(('No File', 400))
    file = request.files['file']
    if file.filename == '':
        return app.make_response(('', 400))
    if file and allowed_file(file.filename):
        foldername = randomString()
        filename = secure_filename(file.filename)
        folderpath = os.path.join(foldername)
        filepath = os.path.join(foldername, filename)
        os.mkdir(folderpath)
        file.save(filepath)
        message = benignMaligant(folderpath)
        os.remove(filepath)
        os.rmdir(folderpath)
        return app.make_response(message)
    return app.make_response(('Invalid File', 400))


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path != '' and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0')
