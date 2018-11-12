from flask import Flask, url_for

app = Flask(__name__)


@app.route('/user/<username>')
def show_user_profile(username):
    # show the user profile for that user
    return 'User %s' % username

#url_for('static', filename='intex.html')
#url_for('static', filename='style.css')
