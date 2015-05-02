from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
	return "Hello Brandon, your penis is small"
	
@app.route("/path/")
def path():
	return "Another URL"
	
@app.route("/user/<first>/<second>/") 
def user(first, second):
	return first + second
	
if __name__ == "__main__":
	app.run(host="0.0.0.0")
