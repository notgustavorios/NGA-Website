import csv

def clean_csv(input_file, output_file):
    with open(input_file, mode='r', newline='') as infile, open(output_file, mode='w', newline='') as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile)
        
        # Read header and write it to the output file
        header = next(reader)
        writer.writerow(header)
        
        for row in reader:
            print(f"Original row: {row}")  # Debugging: Print the original row
            
            # Strip leading/trailing spaces and any type of quotes from the first element
            row[0] = row[0].strip().strip('"“”')
            
            # Clean the third column by removing quotes and replacing comma with dot
            row[2] = row[2].strip().strip('"“”').replace(',', '.')
            
            print(f"Cleaned row: {row}")  # Debugging: Print the cleaned row
            
            writer.writerow(row)

# Example usage
input_file = 'csv-files/FIG-FX-updated.csv'  # Path to the input CSV file
output_file = 'output.csv'  # Path to the output CSV file
clean_csv(input_file, output_file)

