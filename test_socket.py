import socket

def main():
	
	# Create and Configure Listener
	s = socket.socket()
	s.bind(("localhost", 7171))
	
	# Block and wait for connection
	s.listen(1)
	conn, addr = s.accept() 
	s.close()
	while 1:
		
		# Loop and read data
		data = conn.recv(1024)
		
		# Connection closed (empty string indicates eof)
		if data == '':
			s.close()
			break
		
		# Handle Data
		if data:
			print data
		else:
			print "ERR"
			exit(0)
	
if __name__ == '__main__':
	main()
