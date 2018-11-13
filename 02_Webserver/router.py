from flask import Flask, url_for, redirect, render_template, request
import requests
app = Flask(__name__)


@app.route('/')
def show_index():
    return redirect("/static/index.html", code=302)

@app.route('/car')
def request_car():
    carId = request.args.get('carId')
    if carId is '':
        return "Sorry, wrong code", 404
    r = requests.get('http://35.198.86.59:3000/api/sc.demonstrator.net.Car/' + carId)
    if (r.status_code == 200):
        return (r.text)
    else:
        return "Sorry, wrong code", r.status_code



@app.route('/user/<username>')
def show_user_profile(username):
    # show the user profile for that user
    return 'User %s' % username
