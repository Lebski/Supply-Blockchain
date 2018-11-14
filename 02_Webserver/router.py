from flask import Flask, url_for, redirect, render_template, request
import requests
import hashlib, binascii, time

app = Flask(__name__)

addr = '35.198.86.59'
port = '3000'



@app.route('/')
def show_index():
    return redirect("/static/index.html", code=302)

@app.route('/car')
def request_car():
    carId = request.args.get('carId')
    if carId is '':
        return "Sorry, wrong code", r.status_code
    r = requests.get('http://' + addr + ':' + port + '/api/sc.demonstrator.net.Car/' + carId)
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

    fileId, fileHash = generateFileInfo(inputText)

    #Disabled for prototyping
    #if (inputCar == "" or inputTilt == "" or inputAcc == "" or inputTemp == "" or inputText == ""):
    #    return "Please fill all fields!", 200
    print(carId)
    #r = requests.post('http://' + addr + ':' + port + '/api/sc.demonstrator.net.Car/' + carId, data = customPayload)
    return "Thanks for your service", 200

def generateFileInfo(inputText):
    timestr = str(time.gmtime()[0]) + str(time.gmtime()[1]) + str(time.gmtime()[2]) + str(time.gmtime()[3]) + str(time.gmtime()[4])
    bstring = str.encode(inputText)
    hash = hashlib.pbkdf2_hmac('sha256', bstring, b'salt', 100000)
    hashstr = binascii.hexlify(hash).decode("utf-8")
    fileId = (hashstr[0:10]) + timestr
    return (fileId, hashstr)

@app.route('/user/<username>')
def show_user_profile(username):
    # show the user profile for that user
    return 'User %s' % username

print (generateFileInfo("Hello"))
