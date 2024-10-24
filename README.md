# Superhealth
Multiple health-related regression neural network models trained accessible securely on the internet.

## Datasets 
The datasets were gathered from UC Irvine Machine Learning Repository:
- [Heart Disease](https://archive.ics.uci.edu/dataset/45/heart+disease)
- [Maternal Health Risk](https://archive.ics.uci.edu/dataset/863/maternal+health+risk)
- [Estimation of Obesity Levels Based On Eating Habits and Physical Condition](https://archive.ics.uci.edu/dataset/544/estimation+of+obesity+levels+based+on+eating+habits+and+physical+condition)
- [CDC Diabetes Health Indicators](https://archive.ics.uci.edu/dataset/891/cdc+diabetes+health+indicators)

## Python Setup
This project was developed in Python3 with a virtual environment through [venv](https://docs.python.org/3/library/venv.html). You can find and install the dependencies by utilizing the `requirements.txt` provided.

## Model Training and Creation
- The models were created using [PyTorch](https://pytorch.org/). There's one notebook for each model. These notebooks may be used to train or retrain the models as needed. A minimal setup was used when programming on these notebooks. Other than [PyTorch](https://pytorch.org/), the only core libraries necessary are [numpy](https://numpy.org/) and [pandas](https://pandas.pydata.org/). For model export and import, the corresponding [onnx](https://onnx.ai/) library or runtime is required.

## Trained Models
Inside the `/onnx/` directory, you will find the exported models in `.onnx` format. Please open their corresponding notebooks to see the model architecture, or open these `.onnx` files on [Netron](https://netron.app/).

## Web Application
The web application has its own `/onnx/` directory which is a copy of the `/onnx` on the project root. The only requirement when hosting the web application is the ability to securely read resources. Therefore opening the web application's build files require a protocol other than the file protocol which is insecure. All model computations happen on the client-side (i.e. the device running the web application) for privacy and security. Please open the `/web/` directory for more information.