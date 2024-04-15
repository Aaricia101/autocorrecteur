import sys
data_to_pass_back = 'send this to node process'
input = sys.argv[1]
output = input + " - " + data_to_pass_back

print(output)
sys.stdout.flush()