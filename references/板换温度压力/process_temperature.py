#! /usr/bin/env python
# -*- encoding: utf8 -*-

import csv
import datetime
import json


def csv_file(filename):
    with open(filename) as f:
        reader = csv.DictReader(f)
        for row in reader:
            date = datetime.datetime.strptime(row['day'], '%m/%d/%Y')
            row['day'] = date.isoformat()
            yield row


def calc_avg(prev_avg, num, n):
    return (prev_avg * n + num) / (n + 1)


def gen_series_from_csv(filename):
    last_date = None
    last_highest = None
    last_lowest = None
    avg = 0
    n = 0
    items = []
    for row in csv_file(filename):
        t = float(row['temp'])
        if row['day'] != last_date:
            if last_highest and last_lowest:
                items.append({
                    'high': last_highest,
                    'avg': avg,
                    'low': last_lowest
                })
            
            last_date = row['day']
            last_highest = last_lowest = t
            avg = n = 0

        if t > last_highest:
            last_highest = t
        elif t < last_lowest:
            last_lowest = t
        avg = calc_avg(avg, t, n)
        n += 1

    # add last item
    items.append({
        'high': last_highest,
        'avg': avg,
        'low': last_lowest
    })

    return {
        'name': filename.split('.')[0].split('_')[-1],
        'items': items
    }


def gen_groups_from_csv(filename):
    last_date = None
    groups = []
    for row in csv_file(filename):
        if row['day'] != last_date:
            groups.append(row['day'])
        last_date = row['day']
    return groups

def run():
    groups = gen_groups_from_csv('rt_P03_d500018b.csv')
    series = []
    for filename in ['rt_P03_d500018b.csv', 'rt_P03_d5000180.csv', 'rt_P03_d5000181.csv']:
        series.append(gen_series_from_csv(filename))

    data = {
        'groups': groups,
        'series': series
    }
    
    with open('temperature_data.json', 'w+') as f:
        f.write(json.dumps(data))


if __name__ == '__main__':
    run()
