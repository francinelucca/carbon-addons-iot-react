import React from 'react';
import { text, select, boolean, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Bee16 } from '@carbon/icons-react';
import { spacing05 } from '@carbon/layout';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { tableColumns, tableData, actions1, actions2 } from '../../utils/sample';

import TableCard from './TableCard';

export default {
  title: '1 - Watson IoT/TableCard',

  parameters: {
    component: TableCard,
  },
};

export const WithMultipleActions = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);

  const tableDataWithActions = tableData.map((item) => {
    return {
      ...item,
      actions: actions1,
    };
  });
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableColumns,
        }}
        values={tableDataWithActions}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

WithMultipleActions.story = {
  name: 'with multiple actions',
};

export const WithLinks = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);
  const cardVariables = object('Dynamic link variable', {
    assetId: '11112',
    company: 'ibm',
  });
  const tableLinkColumns = [
    {
      dataSourceId: 'pressure',
      label: 'Pressure',
    },
    {
      dataSourceId: 'deviceId',
      label: 'Link',
      linkTemplate: {
        href: text('href', 'https://{company}.com/{assetId}'),
        target: select('target', ['_blank', null], '_blank'),
      },
    },
  ];

  const tableLinkData = tableData.slice(0);
  // eslint-disable-next-line no-return-assign, no-param-reassign
  tableLinkData.forEach((row) => (row.values.deviceId = 'Link'));

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts {assetId}')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableLinkColumns,
        }}
        values={tableLinkData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
        cardVariables={cardVariables}
      />
    </div>
  );
};

WithLinks.story = {
  name: 'With links',

  parameters: {
    info: {
      text: `<p>Links can added by providing a linkTemplate prop to the content.columns[i] property.
                2 additional properties can be configured within the linkTemplate object: href and target</p>
            <p>href is the url the link will use. This property is required.</p>
            <p>target is whether you would like to open the link in a new window or not.
                This property defaults to opening in the current window. Use '_blank' to open in a new window
            </p>
            <p> Note: if using row-specific variables in a TableCard href (ie a variable that has a different value per row),
            do NOT pass the cardVariables prop and be sure that your table has reference to the proper value in another column</p>
  `,
    },
  },
};

export const WithRowSpecificLinkVariables = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGEWIDE);

  const tableLinkColumns = [
    ...tableColumns,
    {
      dataSourceId: 'deviceId',
      label: 'deviceId',
    },
    {
      dataSourceId: 'Link',
      label: 'Link',
      linkTemplate: {
        href: text('href', 'https://ibm.com/{deviceId}?time={hour}'),
        target: select('target', ['_blank', null], '_blank'),
      },
    },
  ];

  const tableLinkData = tableData.slice(0);
  // introduce row specific deviceId data
  const deviceidRowData = [
    '73000',
    '73000',
    '73001',
    '73000',
    '73002',
    '73004',
    '73004',
    '73003',
    '73005',
    '73003',
    '73005',
  ];
  tableLinkData.forEach((row, i) => {
    // eslint-disable-next-line no-return-assign, no-param-reassign
    row.values.deviceId = deviceidRowData[i];
    // eslint-disable-next-line no-return-assign, no-param-reassign
    row.values.Link = 'Link';
  });

  const thresholds = [
    {
      dataSourceId: 'pressure',
      comparison: '>=',
      value: 1,
      severity: 1,
      label: 'Pressure',
      showSeverityLabel: true,
      severityLabel: 'Critical',
    },
  ];

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Asset Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableLinkColumns,
          thresholds,
        }}
        values={tableLinkData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

WithRowSpecificLinkVariables.story = {
  name: 'With row specific link variables',

  parameters: {
    info: {
      text: ` # Passing variables
      To pass row-specific variables in a TableCard href (ie a variable that has a different value per row),
            do NOT pass the cardVariables prop and be sure that your table has reference to the proper value in another column
      `,
    },
  },
};

export const WithSingleActions = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);

  const tableDataWithActions = tableData.map((item) => {
    return {
      ...item,
      actions: actions2,
    };
  });
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableColumns,
        }}
        values={tableDataWithActions}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

WithSingleActions.story = {
  name: 'with single actions',
};

export const WithThresholdsPrecisionAndExpandedRows = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGEWIDE);

  const thresholds = [
    {
      dataSourceId: 'pressure',
      comparison: '>=',
      value: 10,
      severity: 1,
      icon: 'bee',
      color: 'black',
      label: text('Custom Pressure Severity Header', 'Custom Pressure Severity Header'),
      showSeverityLabel: boolean('Show Pressure Threshold Label', true),
      severityLabel: text('Custom Pressure Critical Label', ''),
    },
    {
      dataSourceId: 'count',
      comparison: '>=',
      value: 10,
      severity: 1, // High threshold, medium, or low used for sorting and defined filtration
      label: text('Custom Count Severity Header', ''),
      showSeverityLabel: boolean('Show Count Threshold Labels', true),
      severityLabel: text('Custom Count Critical Label', 'Custom Critical'),
    },
    {
      dataSourceId: 'count',
      comparison: '=',
      value: 7,
      severity: 2, // High threshold, medium, or low used for sorting and defined filtration
      showSeverityLabel: boolean('Show Count Threshold Labels', true),
      severityLabel: text('Custom Count Moderate Label', ''),
    },
    {
      dataSourceId: 'pressure',
      comparison: '>=',
      value: 10,
      severity: 1,
      label: 'Custom Pressure Severity Header',
      showSeverityLabel: boolean('Show Pressure Threshold Label', true),
      severityLabel: text('Custom Pressure Critical Label', ''),
    },
  ];

  const tableCustomColumns = tableColumns.map((item) =>
    item.dataSourceId === 'count' ? { ...item, precision: 1 } : { ...item }
  );

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableCustomColumns,
          thresholds,
          expandedRows: [
            {
              id: 'long_description',
              label: 'Description',
            },
            {
              id: 'other_description',
              label: 'Other Description',
            },
            {
              id: 'pressure',
              label: 'Pressure',
            },
            {
              id: 'temperature',
              label: 'Temperature',
            },
          ],
        }}
        values={tableData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
        renderIconByName={(name, props = {}) =>
          name === 'bee' ? (
            <Bee16 {...props}>
              <title>{props.title}</title>
            </Bee16>
          ) : (
            <span>Unknown</span>
          )
        }
      />
    </div>
  );
};

WithThresholdsPrecisionAndExpandedRows.story = {
  name: 'with thresholds, precision and expanded rows',
};

export const WithDynamicVariables = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGEWIDE);
  const cardVariables = object('Dynamic link variable', {
    assetId: '11112',
    devicePressureThreshold: 1,
  });

  const tableLinkColumns = [
    ...tableColumns,
    {
      dataSourceId: 'deviceId',
      label: 'Link',
      linkTemplate: {
        href: text('href', 'https://ibm.com/{assetId}'),
        target: select('target', ['_blank', null], '_blank'),
      },
    },
  ];

  const tableLinkData = tableData.slice(0);
  // eslint-disable-next-line no-return-assign, no-param-reassign
  tableLinkData.forEach((row) => (row.values.deviceId = 'Link'));

  const thresholds = [
    {
      dataSourceId: 'pressure',
      comparison: '>=',
      value: text('Custom threshold value', '{devicePressureThreshold}'),
      severity: 1,
      label: text('Custom Pressure Severity Header', '{assetId} Pressure'),
      showSeverityLabel: boolean('Show Pressure Threshold Label', true),
      severityLabel: text('Custom Critical Label', '{assetId} Critical'),
    },
  ];

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Asset {assetId} Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableLinkColumns,
          thresholds,
        }}
        values={tableLinkData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
        cardVariables={cardVariables}
      />
    </div>
  );
};

WithDynamicVariables.story = {
  name: 'With dynamic variables',

  parameters: {
    info: {
      text: ` # Passing variables
      To pass a variable into your card, identify a variable to be used by wrapping it in curly brackets.
      Make sure you have added a prop called 'cardVariables' to your card that is an object with key value pairs such that the key is the variable name and the value is the value to replace it with.
      Optionally you may use a callback as the cardVariables value that will be given the variable and the card as arguments.
      Note: if using row-specific variables in a TableCard href (ie a variable that has a different value per row),
            do NOT pass the cardVariables prop and be sure that your table has reference to the proper value in another column
      `,
    },
  },
};

export const WithThresholds = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGEWIDE);

  const thresholds = [
    // this threshold is applied to the whole row, not a particular attribute
    {
      dataSourceId: 'count',
      comparison: '<',
      value: 5,
      severity: 3, // High threshold, medium, or low used for sorting and defined filtration
      label: text('Custom Count Severity Header', ''),
      showSeverityLabel: boolean('Show Count Threshold Labels', true),
      severityLabel: text('Custom Count Low Label', ''),
    },
    {
      dataSourceId: 'count',
      comparison: '>=',
      value: 10,
      severity: 1, // High threshold, medium, or low used for sorting and defined filtration
      showSeverityLabel: boolean('Show Count Threshold Labels', true),
      severityLabel: text('Custom Count Critical Label', 'Custom Critical'),
    },
    {
      dataSourceId: 'count',
      comparison: '=',
      value: 7,
      severity: 2, // High threshold, medium, or low used for sorting and defined filtration
      showSeverityLabel: boolean('Show Count Threshold Labels', true),
      severityLabel: text('Custom Count Moderate Label', ''),
    },
    {
      dataSourceId: 'pressure',
      comparison: '>=',
      value: 10,
      severity: 1,
      label: text('Custom Pressure Severity Header', 'Custom Pressure Severity Header'),
      showSeverityLabel: boolean('Show Pressure Threshold Label', true),
      severityLabel: text('Custom Pressure Critical Label', ''),
    },
  ];

  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableColumns,
          thresholds,
        }}
        values={tableData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

WithThresholds.story = {
  name: 'with thresholds',

  parameters: {
    info: {
      text: `
     Thresholds can be based off 1 specific data source with the unique key: dataSourceId .

     Comparisons can then be added by defined the comparison key with one of the following: <,<=,=,>,>= .

     Severity has 3 possible settings, 1 (high), 2 (medium), 3 (low).

     Value is the number limit being compared in the comparison that was defined.

     Label is a custom label that can be defined and displayed in the column. If a custom label is not set,
     the label will default to '<dataSourceId> Severity'

     In addition, if the dataSourceId does not have a column displayed, a new column will be added at the end
     of the table.
    `,
    },
  },
};

export const WithThresholdsOnlyWithIcon = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGEWIDE);

  const thresholds = [
    // this threshold is applied to the whole row, not a particular attribute
    {
      dataSourceId: 'count',
      comparison: '<',
      value: 5,
      severity: 3, // High threshold, medium, or low used for sorting and defined filtration
      label: text('Custom Count Severity Header', ''),
      showSeverityLabel: boolean('Show Count Threshold Labels', true),
      severityLabel: text('Custom Count Low Label', ''),
    },
    {
      dataSourceId: 'count',
      comparison: '>=',
      value: 10,
      severity: 1, // High threshold, medium, or low used for sorting and defined filtration
      showSeverityLabel: boolean('Show Count Threshold Labels', true),
      severityLabel: text('Custom Count Critical Label', 'Custom Critical'),
    },
    {
      dataSourceId: 'count',
      comparison: '=',
      value: 7,
      severity: 2, // High threshold, medium, or low used for sorting and defined filtration
      showSeverityLabel: boolean('Show Count Threshold Labels', true),
      severityLabel: text('Custom Count Moderate Label', ''),
    },
    {
      dataSourceId: 'pressure',
      comparison: '>=',
      value: 10,
      severity: 1,
      label: text('Custom Pressure Severity Header', ''),
      showSeverityLabel: boolean('Show Pressure Threshold Label', true),
      severityLabel: text('Custom Pressure Critical Label', ''),
    },
  ];

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: [...tableColumns.slice(0, 1), tableColumns[2]],
          thresholds,
        }}
        values={tableData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

WithThresholdsOnlyWithIcon.story = {
  name: 'with thresholds only with icon',

  parameters: {
    info: {
      text: `
        If you don't pass the underlying 'pressure' or 'count' column we will show the threshold icon columns at the right of the table
      `,
    },
  },
};

export const WithMatchingThresholds = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableColumns,
          expandedRows: [{}],
          thresholds: [
            {
              dataSourceId: 'count',
              comparison: '>',
              value: 0,
              severity: 3,
              label: text('Custom Count Severity Header', ''),
              showSeverityLabel: boolean('Show Count Threshold Labels', true),
              severityLabel: text('Custom Count Low Label', ''),
            },
            {
              dataSourceId: 'count',
              comparison: '>',
              value: 2,
              severity: 1,
              showSeverityLabel: boolean('Show Count Threshold Labels', true),
              severityLabel: text('Custom Count Critical Label', ''),
            },
          ],
        }}
        values={tableData.map((i) => ({ id: i.id, values: i.values }))}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

WithMatchingThresholds.story = {
  name: 'with matching thresholds',
};

export const WithCustomColumnSort = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGEWIDE);

  const tableCustomColumns = tableColumns.map((item) =>
    item.dataSourceId === 'count' ? { ...item, sort: 'DESC' } : item
  );

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableCustomColumns,
        }}
        values={tableData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

WithCustomColumnSort.story = {
  name: 'with custom column sort',
};

export const WithFixedColumnSize = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);

  const tableCustomColumns = tableColumns.map((item, index) =>
    index === 0 ? { ...item, width: 250, name: 'Alert with long string name' } : item
  );

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableCustomColumns,
        }}
        values={tableData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

WithFixedColumnSize.story = {
  name: 'with fixed column size',
};

export const WithRowExpansion = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableColumns,
          expandedRows: [
            {
              id: 'long_description',
              label: 'Description',
            },
            {
              id: 'other_description',
              label: 'Other content to show',
            },
          ],
        }}
        values={tableData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

WithRowExpansion.story = {
  name: 'with row expansion',
};

export const WithRowExpansionAndTimestamp = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableColumns,
          expandedRows: [
            {
              id: 'hour',
              label: 'Time',
              type: 'TIMESTAMP',
            },
          ],
        }}
        values={tableData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

WithRowExpansionAndTimestamp.story = {
  name: 'with row expansion and timestamp',
};

export const WithRowExpansionAndLinkVariables = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title="Open Alerts"
        id="table-list"
        tooltip="Here's a Tooltip"
        content={{
          columns: tableColumns,
          expandedRows: [
            {
              id: 'long_description',
              label: 'Description',
              linkTemplate: {
                href: text('href', 'http://ibm.com/{variable}'),
              },
            },
            {
              id: 'other_description',
              label: 'Other content to show',
            },
          ],
        }}
        values={tableData}
        cardVariables={object('Dynamic link variable', {
          variable: 'variable-value',
        })}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

WithRowExpansionAndLinkVariables.story = {
  name: 'with row expansion and link variables',

  parameters: {
    info: {
      text: ` # Passing variables
    To pass a variable into your card, identify a variable to be used by wrapping it in curly brackets.
    Make sure you have added a prop called 'cardVariables' to your card that is an object with key value pairs such that the key is the variable name and the value is the value to replace it with.
    Optionally you may use a callback as the cardVariables value that will be given the variable and the card as arguments.
    Note: if using row-specific variables in a TableCard href (ie a variable that has a different value per row),
          do NOT pass the cardVariables prop and be sure that your table has reference to the proper value in another column
    `,
    },
  },
};

export const WithRowExpansionAndRowSpecificLinkVariables = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title="Open Alerts"
        id="table-list"
        tooltip="Here's a Tooltip"
        content={{
          columns: tableColumns,
          expandedRows: [
            {
              id: 'long_description',
              label: 'Description',
              linkTemplate: {
                href: text('href', 'http://ibm.com/{pressure}'),
              },
            },
            {
              id: 'other_description',
              label: 'Other content to show',
            },
          ],
        }}
        values={tableData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

WithRowExpansionAndRowSpecificLinkVariables.story = {
  name: 'with row expansion and row specific link variables',

  parameters: {
    info: {
      text: ` # Passing variables
    To pass a variable into your card, identify a variable to be used by wrapping it in curly brackets.
    Make sure you have added a prop called 'cardVariables' to your card that is an object with key value pairs such that the key is the variable name and the value is the value to replace it with.
    Optionally you may use a callback as the cardVariables value that will be given the variable and the card as arguments.
    Note: if using row-specific variables in a TableCard href (ie a variable that has a different value per row),
          do NOT pass the cardVariables prop and be sure that your table has reference to the proper value in another column
    `,
    },
  },
};

export const NoRowActions = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableColumns,
        }}
        values={tableData.map((i) => ({ id: i.id, values: i.values }))}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

NoRowActions.story = {
  name: 'no row actions',
};

export const EmptyTable = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableColumns,
        }}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

EmptyTable.story = {
  name: 'empty table',
};

export const Editable = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableColumns,
        }}
        isEditable
        availableActions={{ edit: true, clone: true, delete: true }}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

Editable.story = {
  name: 'editable',
};

export const EditableWithExpandedRows = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableColumns,
          expandedRows: [{}],
        }}
        isEditable
        availableActions={{ edit: true, clone: true, delete: true }}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  );
};

EditableWithExpandedRows.story = {
  name: 'editable with expanded rows',
};

export const WithIsLoading = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGE);

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', true)}
      />
    </div>
  );
};

WithIsLoading.story = {
  name: 'with isLoading',
};

export const I18N = () => {
  const size = select('size', [CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE], CARD_SIZES.LARGEWIDE);

  const thresholds = [
    // this threshold is applied to the whole row, not a particular attribute
    {
      dataSourceId: 'count',
      comparison: '<',
      value: 5,
      severity: 3, // High threshold, medium, or low used for sorting and defined filtration
    },
    {
      dataSourceId: 'count',
      comparison: '>=',
      value: 10,
      severity: 1, // High threshold, medium, or low used for sorting and defined filtration
    },
    {
      dataSourceId: 'count',
      comparison: '=',
      value: 7,
      severity: 2, // High threshold, medium, or low used for sorting and defined filtration
    },
    {
      dataSourceId: 'pressure',
      comparison: '>=',
      value: 10,
      severity: 1,
    },
  ];

  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing05 + 4,
      }}
    >
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        tooltip={text('Tooltip text', "Here's a Tooltip")}
        locale={select('locale', ['fr', 'en'], 'fr')}
        content={{
          columns: tableColumns.map((item) =>
            item.dataSourceId === 'count' ? { ...item, precision: 3 } : { ...item }
          ),
          thresholds,
        }}
        values={tableData}
        onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
        size={size}
        isLoading={boolean('isLoading', false)}
        i18n={{
          criticalLabel: text('criticalLabel', 'Critical'),
          moderateLabel: text('moderateLabel', 'Moderate'),
          lowLabel: text('lowLabel', 'Low'),
          selectSeverityPlaceholder: text('selectSeverityPlaceholder', 'Select a severity'),
          severityLabel: text('severityLabel', '__Severity__'),

          // table i18n
          searchPlaceholder: text('searchPlaceholder', 'Search'),
          filterButtonAria: text('filterButtonAria', 'Filters'),
          defaultFilterStringPlaceholdText: text(
            'defaultFilterStringPlaceholdText',
            'Type and hit enter to apply'
          ),
          /** pagination */
          pageBackwardAria: text('i18n.pageBackwardAria', '__Previous page__'),
          pageForwardAria: text('i18n.pageForwardAria', '__Next page__'),
          pageNumberAria: text('i18n.pageNumberAria', '__Page Number__'),
          itemsRange: (min, max) => `__${min}–${max} items__`,
          currentPage: (page) => `__page ${page}__`,
          itemsRangeWithTotal: (min, max, total) => `__${min}–${max} of ${total} items__`,
          pageRange: (current, total) => `__${current} of ${total} pages__`,
          /** table body */
          clickToExpandAria: text('i18n.clickToExpandAria', '__Click to expand content__'),
          clickToCollapseAria: text('i18n.clickToCollapseAria', '__Click to collapse content__'),
          /** toolbar */
          clearAllFilters: text('i18n.clearAllFilters', '__Clear all filters__'),
          clearFilterAria: text('i18n.clearFilterAria', '__Clear filter__'),
          filterAria: text('i18n.filterAria', '__Filter__'),
          openMenuAria: text('i18n.openMenuAria', '__Open menu__'),
          closeMenuAria: text('i18n.closeMenuAria', '__Close menu__'),
          clearSelectionAria: text('i18n.clearSelectionAria', '__Clear selection__'),
          /** empty state */
          emptyMessage: text('i18n.emptyMessage', '__There is no data__'),
          emptyMessageWithFilters: text(
            'i18n.emptyMessageWithFilters',
            '__No results match the current filters__'
          ),
          emptyButtonLabel: text('i18n.emptyButtonLabel', '__Create some data__'),
          emptyButtonLabelWithFilters: text('i18n.emptyButtonLabel', '__Clear all filters__'),
          inProgressText: text('i18n.inProgressText', '__In Progress__'),
          actionFailedText: text('i18n.actionFailedText', '__Action Failed__'),
          learnMoreText: text('i18n.learnMoreText', '__Learn More__'),
          dismissText: text('i18n.dismissText', '__Dismiss__'),
          downloadIconDescription: text('downloadIconDescription', 'Download table content'),
        }}
      />
    </div>
  );
};

I18N.story = {
  name: 'i18n',
};
