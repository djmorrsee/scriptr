from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
	return "Hello Brandon, your penis is small"
	
@app.route("/path/")
def path():
	return "Another URL"
	
@app.route("/user/<username>") 
def user(username):
	return "Your name is " + str(username)
	
if __name__ == "__main__":
	app.run(host="0.0.0.0")
