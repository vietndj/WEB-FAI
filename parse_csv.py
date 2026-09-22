import pandas as pd
df = pd.read_csv('nghiem_thu.csv', on_bad_lines='skip', skiprows=1) # skip first row
print("--- Nghiệm thu ---")
for idx, row in df.iterrows():
    if str(row.iloc[6]) != 'nan':
        print(f"Row {idx+3}: Trạng thái: {row.iloc[6]}")
