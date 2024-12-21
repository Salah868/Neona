python
from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Handle login (you'll add Discord auth here)
        return redirect(url_for('home'))
    return render_template('login.html')

if __name__ == '__main__':
    app.run(debug=True)
