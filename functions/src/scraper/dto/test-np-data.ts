import { parseISO } from 'date-fns';
import { NpPrice } from './np-price';
import { plainToInstance } from 'class-transformer';
import { NpData } from './np-data';

export const TEST_STRING = `{
    "data": {
      "Rows": [
    {
      "Columns": [
        {
          "Index": 0,
          "Scale": 0,
          "SecondaryValue": null,
          "IsDominatingDirection": false,
          "IsValid": false,
          "IsAdditionalData": false,
          "Behavior": 0,
          "Name": "25-10-2022",
          "Value": "168,85",
          "GroupHeader": null,
          "DisplayNegativeValueInBlue": false,
          "CombinedName": "25-10-2022",
          "DateTimeForData": "0001-01-01T00:00:00",
          "DisplayName": "168,85_True",
          "DisplayNameOrDominatingDirection": "168,85",
          "IsOfficial": true,
          "UseDashDisplayStyle": false
        },
        {
          "Index": 1,
          "Scale": 0,
          "SecondaryValue": null,
          "IsDominatingDirection": false,
          "IsValid": false,
          "IsAdditionalData": false,
          "Behavior": 0,
          "Name": "24-10-2022",
          "Value": "54,45",
          "GroupHeader": null,
          "DisplayNegativeValueInBlue": false,
          "CombinedName": "24-10-2022",
          "DateTimeForData": "0001-01-01T00:00:00",
          "DisplayName": "54,45_True",
          "DisplayNameOrDominatingDirection": "54,45",
          "IsOfficial": true,
          "UseDashDisplayStyle": false
        },
        {
          "Index": 2,
          "Scale": 0,
          "SecondaryValue": null,
          "IsDominatingDirection": false,
          "IsValid": false,
          "IsAdditionalData": false,
          "Behavior": 0,
          "Name": "24-10-2022",
          "Value": "-",
          "GroupHeader": null,
          "DisplayNegativeValueInBlue": false,
          "CombinedName": "24-10-2022",
          "DateTimeForData": "0001-01-01T00:00:00",
          "DisplayName": "-_True",
          "DisplayNameOrDominatingDirection": "-",
          "IsOfficial": true,
          "UseDashDisplayStyle": false
        }
      ],
      "Name": "00&nbsp;-&nbsp;01",
      "StartTime": "2022-10-25T00:00:00",
      "EndTime": "2022-10-25T01:00:00",
      "DateTimeForData": "0001-01-01T00:00:00",
      "DayNumber": 0,
      "StartTimeDate": "0001-01-01T00:00:00",
      "IsExtraRow": false,
      "IsNtcRow": false,
      "EmptyValue": "",
      "Parent": null
      }
    ]
  }
  }
    `;

export const TEST_DATA: Record<string, unknown> = JSON.parse(TEST_STRING);

export const TEST_OBJ: NpPrice[] = [
  {
    value: 168.85,
    startTime: parseISO('2022-10-24T22:00:00.000Z'), // new Date(2022, 10 - 1, 24, 22, 0, 0),
    endTime: parseISO('2022-10-24T23:00:00.000Z'), // new Date(2022, 10 - 1, 24, 23, 0, 0),
  },
  {
    value: 54.45,
    startTime: parseISO('2022-10-23T22:00:00.000Z'), // new Date(2022, 10 - 1, 23, 22, 0, 0),
    endTime: parseISO('2022-10-23T23:00:00.000Z'), // new Date(2022, 10 - 1, 23, 23, 0, 0),
  },
];

export function getTestNpData() {
  return plainToInstance(NpData, TEST_DATA.data, {
    excludeExtraneousValues: true,
  });
}
