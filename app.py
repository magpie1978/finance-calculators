from flask import Flask, render_template, request, send_file
import os
import pandas as pd
from google.colab import auth
import gspread
from google.auth import default
from gspread_dataframe import get_as_dataframe

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run', methods=['POST'])
def run_script():
    # Authenticate and load the spreadsheet
    auth.authenticate_user()
    creds, _ = default()
    gc = gspread.authorize(creds)

    spreadsheet = gc.open_by_url('https://docs.google.com/spreadsheets/d/1gs53_hEpkkF8AKUGka-dNigMw_WWCubix71hxuK3_9A')
    worksheet = spreadsheet.worksheet('routes')

    df = get_as_dataframe(worksheet, value_render_option='UNFORMATTED_VALUE')

    # Calculate minutes
    def calculate_minutes(duration):
        parts = duration.split('h')
        hours = int(parts[0])
        minutes = int(parts[1]) if len(parts) > 1 else 0
        return hours * 60 + minutes

    df['Minutes'] = df['Duration'].apply(calculate_minutes)

    if 'Remaining Demand' not in df.columns:
        df['Remaining Demand'] = df['Economy']

    # Simulate aircraft selection
    aircraft_type = request.form.get('aircraft', 'A380')  # Default to A380
    demand_threshold = 1703 if aircraft_type == 'A380' else 1459

    # Grouping function
    def find_airport_group(df, target_sum):
        eligible_airports_df = df[df['Remaining Demand'] > demand_threshold].copy()
        minutes_values = eligible_airports_df['Minutes'].tolist()
        iata_codes = eligible_airports_df['IATA'].tolist()
        n = len(minutes_values)

        dp = [[False for _ in range(target_sum + 1)] for _ in range(n + 1)]

        for i in range(n + 1):
            dp[i][0] = True

        for i in range(1, n + 1):
            for j in range(1, target_sum + 1):
                if minutes_values[i - 1] <= j:
                    dp[i][j] = dp[i - 1][j] or dp[i - 1][j - minutes_values[i - 1]]
                else:
                    dp[i][j] = dp[i - 1][j]

        if dp[n][target_sum]:
            subset = []
            i = n
            j = target_sum
            while i > 0 and j > 0:
                if dp[i - 1][j]:
                    i -= 1
                else:
                    subset.append(iata_codes[i - 1])
                    j -= minutes_values[i - 1]
                    i -= 1

            df.loc[df['IATA'].isin(subset), 'Remaining Demand'] -= 1704
            return subset, df
        else:
            return None, df

    all_circuits_data = []
    group_number = 1

    # First pass with target_sum = 10080
    while True:
        airport_group, df = find_airport_group(df, target_sum=10080)
        if airport_group:
            circuit_id = f"{group_number}_10080"
            all_circuits_data.append({'Circuit Number': circuit_id, 'Airports': ', '.join(airport_group)})
            group_number += 1
        else:
            break

    # Second pass with target_sum = 9900
    while True:
        airport_group, df = find_airport_group(df, target_sum=9900)
        if airport_group:
            circuit_id = f"{group_number}_9900"
            all_circuits_data.append({'Circuit Number': circuit_id, 'Airports': ', '.join(airport_group)})
            group_number += 1
        else:
            break

    all_circuits_df = pd.DataFrame(all_circuits_data)

    # Save the CSV
    output_file = 'chris.csv'
    all_circuits_df.to_csv(output_file, index=False)

    return send_file(output_file, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
