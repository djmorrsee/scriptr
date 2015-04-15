# Welcome to the hello python tutorial scripts
# This is meant to give a crash course in some python syntax. 
# Some of this is more useful than others in practice.


# These are single line comments

''' 
This is a multiline comment, sometimes called a docstring

Python is 'interpreted' one line at a time. In a .py file, every line is read, no boilerplate required
'''

# Modules are imported via import
import sys

# Variables are declared without types
a = 0
b = 'c'
c = [] # List/array
d = 'string' # note use of ' instead of "
e = { 'key' : 'value' } # Dictionary
f = True
g = False # false and true are simply variables with the value of 0 and 1

# Can reuse variables
a = 0
a = ''
a = []
a = set() # Sets are lists with no duplicates

# Conditionals
# Whitespace is king in python, instead of brackets {}
if True:
	print False
	
while False:
	print True
	
for i in range(0, 10):
	print i

'''
Function syntax is straightforward

def func_name(a, b, c):
->	body is indented
	return val

Body of functions are indented, no return or argument types
'''
def foo(arg): 
	return arg + 1

'''
Functions in python are "first class" functions, which means they are 
treated as variables.
'''
f = foo(4) # Bind result of call to foo(4) to f
g = foo # Bind the function foo to g (think of it as an alias)

print f 
print g(4) # Same as the foo(4) call
	
# Lambda functions are functions without a name
g = lambda _g : _g + 1

print g(2) # prints 3

# First class and lambda functions don't appear useful until you start tying it together
def increment_by(val):
	return lambda x : x + val
	
print increment_by(4)(1) # Increments 1 by 4 and prints it

# Lists and comprehensions
l_1 = [1, 2, 3]
l_2 = [x * 2 for x in l_1] # List comprehension, results in [2, 4, 6]
		
# Map, Filter, Reduce
# These functions are magical, and combine the power of list comprehensions and lambdas
# Each of the take a list and a lambda as an argument

bar = [1, 2, 3, 4, 5]

# Applies the lambda to each element and returns a new list (much like a list comprehension shown above)
print map(lambda x : x * x, bar) # prints [1, 4, 9, 16, 25]

# Returns a list of the elements that result in the lambda returning true 
print filter(lambda x : x % 2 == 0, bar) # prints [2, 4] 

# Applies the lambda to each succesive element and returns the single result.
print reduce(lambda x, y : x + y, bar) # prints 15, which is((((1 + 2) + 3) + 4) + 5) 
print reduce(lambda x, y : x * y, bar) # prints 120, which is ((((1 * 2) * 3) * 4) * 5)
