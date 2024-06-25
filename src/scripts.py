import os
import csv

def replace_commas_in_third_column(input_file, output_file):
    # wow, we're opening a file. groundbreaking stuff.
    with open(input_file, mode='r', newline='') as csvfile:
        reader = csv.reader(csvfile)
        rows = []
        for row in reader:
            if len(row) > 2:
                row[2] = row[2].replace(',', '.')
            rows.append(row)
    
    # now we write it back because you couldn't figure out how to do it in place
    with open(output_file, mode='w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerows(rows)

def clean_csv_files_in_folder(folder_path):
    if not os.path.isdir(folder_path):
        print(f"the path {folder_path} is not a directory. maybe check your path?")
        return

    for filename in os.listdir(folder_path):
        if filename.endswith(".csv"):
            input_file = os.path.join(folder_path, filename)
            output_file = os.path.join(folder_path, f"cleaned_{filename}")
            replace_commas_in_third_column(input_file, output_file)
            print(f"cleaned {filename} and saved as cleaned_{filename}")

#clean_csv_files_in_folder('/Users/gustavo/Desktop/NGA Routines/cleaned-csv')


import pandas as pd

# Load the CSV file
csv_path = '/Users/gustavo/Desktop/NGA Routines/superskills/PB-SS.csv'
df = pd.read_csv(csv_path)

# HTML structure initialization
html_output = """
<div id="skill-table-container">
    <div id="floor">
        <table class="skill-table" data-group="1">
            <tr>
                <th colspan="3">Non-acrobatic elements -- GRP I </th>
            </tr>
            <tr>
                <th>Skill</th>
                <th>Difficulty</th>
                <th>Element Group</th>
            </tr>
"""

# Iterate through the dataframe and create rows for each entry
for index, row in df.iterrows():
    html_output += f"""
            <tr class="skill-entry">
                <td>{row['Name']}</td>
                <td>{row['Difficulty']}</td>
                <td>{row['ElementGroup']}</td>
            </tr>
    """

# Closing the HTML tags
html_output += """
        </table>
    </div>
</div>
"""

# Output the HTML
print(html_output)
