import threading

# Thread target function
def daemon():
	i = 10 
	while i > 0:
		print i
		i = i - 1

def main():
	# Create Thread (target must match function def name)
	d = threading.Thread(name='daemon-thread', target=daemon)
	
	# Spawn Thread
	d.start()
	print "started"
	
	# Block (wait) until thread d is done
	d.join()
	print "done"
	
if __name__ == '__main__':
	main()

