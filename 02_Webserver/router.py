from flask import Flask, url_for, redirect, render_template, request
import requests
import json
import hashlib, binascii, time

app = Flask(__name__)

@app.route('/')
def show_index():
    return redirect("/static/index.html", code=302)

@app.route('/car')
def request_car():
    carId = request.args.get('carId')
    if carId is '':
        return "Sorry, wrong code", r.status_code
    r = requests.get('http://' + bcAddr + ':' + bcPort + '/api/sc.demonstrator.net.Car/' + carId)
    if (r.status_code == 200):
        return (r.text)
    else:
        return "Sorry, wrong code", r.status_code

@app.route('/report')
def submit_transaction():
    inputCar = request.args.get('inputCar')
    inputTilt = request.args.get('inputTilt')
    inputAcc = request.args.get('inputAcc')
    inputTemp = request.args.get('inputTemp')
    inputText = request.args.get('inputText')


    if (inputCar == "" or inputTilt == "" or inputAcc == "" or inputTemp == "" or inputText == ""):
        return "Please fill all fields!", 401

    fileId, fileHash = generateFileInfo(inputText)
    storeSuccess = storeInCouchDB(fileId, fileHash, inputText)

    if (storeSuccess is False):
        return "DB Entry was not Sucessfull, please try again later."



    customPayload = {
      "$class": "sc.demonstrator.net.SensorStatusUpdate",
      "tilted":  inputTilt,
      "acceleration":inputAcc,
      "temperature":  inputTemp,
      "file": {
        "$class": "sc.demonstrator.net.FileObj",
        "fileId": fileId,
        "fileHash": fileHash
      },
      "car": "resource:sc.demonstrator.net.Car#" + inputCar ,
      "issuer": "resource:sc.demonstrator.net.Transport_holder#Transport_holder_TEST"
    }


    print (customPayload)

    r = requests.post('http://' + bcAddr + ':' + bcPort + '/api/sc.demonstrator.net.SensorStatusUpdate/', json = customPayload)
    if (r.status_code == 200):
        return "Yeah! Stored in database with ID: " + fileId + " and Hash: " + fileHash, 200
    else:
        print (r.text)
        return r.text, r.status_code

def generateFileInfo(inputText):
    timestr = str(time.gmtime()[0]) + str(time.gmtime()[1]) + str(time.gmtime()[2]) + str(time.gmtime()[3]) + str(time.gmtime()[4])
    bstring = str.encode(inputText)
    hash = hashlib.pbkdf2_hmac('sha256', bstring, b'salt', 100000)
    hashstr = binascii.hexlify(hash).decode("utf-8")
    fileId = (hashstr[0:10]) + timestr
    return (fileId, hashstr)

def storeInCouchDB(fileId, fileHash, file):
    dbData =  '{"hash" : "' + fileHash + '", "file" : "'+ file + '"}'
    dbUrl = 'http://' + dbUser + ':' + dbPw + '@' + dbAddr + ':' + dbPort + '/' + dbName +  '/' + fileId
    print (dbUrl)
    r = requests.put(dbUrl, data=dbData)
    if (r.status_code == 201):
        info = json.loads(r.text)
        print(info['id'])
        return True
    elif (r.status_code == 409):
        info = json.loads(r.text)
        print (info['reason'] + "Name already in use?")
        return False
    else:
        print ("Please check if connection to database can be established")
        return False

@app.route('/user/<username>')
def show_user_profile(username):
    # show the user profile for that user
    return 'User %s' % username
