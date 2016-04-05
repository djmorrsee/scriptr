> 5. Test
> 6. Test


# scriptr

A collaborative code editor

## Initial Testing

## test_socket.py

Tests on python's socket module.

The system must have listeners for each user connected.

#### The dummy client

For this to work, we need a connection on the other end of this python program. 

	nc localhost 7171
	
The above command starts a "netcat" server (at least on ubuntu)

Kill this service to stop the python listener.

## test_threading.py

Tests on python's threading module

Our implementation must have multiple threads to handle, at a minimum, network connections and data manipulation.

## test_data.py

Tests on a number of modules, for the goal of dealing with our data efficiently

Looking into the StringIO and bytearray[] python constructs.
