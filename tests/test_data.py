class EditStream(object):
	def __init__(self):
		self.stream = bytearray()
	def insert_item(self, position, ch):
		self.stream.insert(position, ch)
	def remove_item(self, position):
		if self.stream[position]:
			del self.stream[position]
	def insert_range(self, start, ch_arr):
		i = start
		for ch in ch_arr:
			self.insert_item(i, ch)
			i = i + 1
	def print_stream(self):
		for i in self.stream:
			print i
			
class StreamController(object):
	def __init__(self):
		self.stream = EditStream()
		self.connections = []
		
	def sync_connections(self):
		for i in self.connections:
			print i
		
def test_suite():
	a = EditStream()
	for i in range(0, 1000):
		a.insert_item(0, random.randint(0, 255))
		
	for i in range(0, 1000):
		a.remove_item(len(a.stream) - 1)

def test_print():
	import random
	a = EditStream()
	for i in range(0, 1000):
		a.insert_item(0, random.randint(0, 255))
		a.print_stream()

test_print()

#~ import timeit
#~ num = 10000
#~ print timeit.timeit("test_suite()", setup="from __main__ import test_suite", number=num) / num
