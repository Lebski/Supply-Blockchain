from flask import Flask, url_for, redirect

app = Flask(__name__)


@app.route('/')
def show_index():
    return redirect("/static/index.html", code=302)


@app.route('/user/<username>')
def show_user_profile(username):
    # show the user profile for that user
    return 'User %s' % username
