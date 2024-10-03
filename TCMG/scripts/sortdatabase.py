import json

# Load the JSON data from the input file
with open('input.json', 'r') as infile:
    data = json.load(infile)

# Sort the data by the 'name' key
sorted_data = sorted(data, key=lambda x: x['name'])

# Write the sorted data to a new JSON file
with open('sorted.json', 'w') as outfile:
    json.dump(sorted_data, outfile, indent=4)

print("Sorting completed and saved to sorted.json")
