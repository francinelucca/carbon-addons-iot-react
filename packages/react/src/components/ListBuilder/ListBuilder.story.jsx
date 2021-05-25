import React, { createElement, useMemo, useState } from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { withReadme } from 'storybook-readme';
import isEmpty from 'lodash/isEmpty';
import { ArrowRight16, Subtract16 } from '@carbon/icons-react';

import StoryNotice, { experimentalStoryTitle } from '../../internal/StoryNotice';
import Button from '../Button/Button';
import { generateUserList } from '../SelectUsersModal/SelectUsersModal.story';

import ListBuilder from './ListBuilder';
import README from './README.md';

export const Experimental = () => <StoryNotice componentName="ListBuilder" experimental />;
Experimental.story = {
  name: experimentalStoryTitle,
};

export const NoItemsSelected = withReadme(README, () => (
  <ListBuilder
    onAdd={action('onAdd')}
    onRemove={action('onRemove')}
    items={[
      {
        id: '1',
        content: {
          value: 'item one',
        },
      },
      { id: '2', content: { value: 'item two' } },
    ]}
  />
));

NoItemsSelected.story = {
  name: 'with no items selected',
};

export const ItemsSelected = withReadme(README, () => (
  <ListBuilder
    onAdd={action('onAdd')}
    onRemove={action('onRemove')}
    items={[
      {
        id: '1',
        content: {
          value: 'item one',
        },
      },
    ]}
    selectedItems={[{ id: '2', content: { value: 'item two' } }]}
  />
));

ItemsSelected.story = {
  name: 'with items selected',
};

export const StatefulExample = withReadme(README, () => {
  const [selected, setSelected] = useState([]);
  const [items, setItems] = useState([
    {
      id: '1',
      content: {
        value: 'item one',
      },
    },
    {
      id: '2',
      content: {
        value: 'item two',
      },
    },
    {
      id: '3',
      content: {
        value: 'item three',
      },
    },
  ]);

  const handleAdd = (event, id) => {
    setSelected((prev) => {
      const newItem = items.find((item) => item.id === id);
      return [...prev, newItem];
    });
    setItems((prev) => {
      return prev.filter((pItem) => pItem.id !== id);
    });

    // just to show the actions in storybook
    action('onAdd')(event, id);
  };

  const handleRemove = (event, id) => {
    setItems((prev) => {
      const removedItem = selected.find((item) => item.id === id);
      return [...prev, removedItem];
    });
    setSelected((prev) => prev.filter((pItem) => pItem.id !== id));

    // just to show the actions in storybook
    action('onRemove')(event, id);
  };

  return (
    <ListBuilder onAdd={handleAdd} onRemove={handleRemove} items={items} selectedItems={selected} />
  );
});

StatefulExample.story = {
  name: 'stateful example',
  decorators: [createElement],
};

const itemsAreEqual = (item1, item2) => {
  if (!item1 || !item2) {
    return false;
  }

  // they're exactly the object, like some of the storybook examples
  if (item1 === item2) {
    return true;
  }

  // they have the same ids
  if (item1.id && item2.id && item1.id === item2.id) {
    return true;
  }

  // they have the same email
  if (item1.email && item2.email && item1.email === item2.email) {
    return true;
  }

  return false;
};

const mapUsers = (
  unmodifiedUsers,
  { parents = [], selectedUsers = [], depth = 0, renderRowActions, renderDisabledState }
) =>
  unmodifiedUsers.map((user) => {
    const { id, name, username, email, users = [], groups = [] } = user;

    const mappedGroups = isEmpty(groups)
      ? []
      : mapUsers(groups, {
          depth: depth + 1,
          selectedUsers,
          parents: [...parents, user],
          renderRowActions,
          renderDisabledState,
        });
    const mappedUsers = isEmpty(users)
      ? []
      : mapUsers(users, {
          depth: depth + 1,
          selectedUsers,
          parents: [...parents, user],
          renderRowActions,
          renderDisabledState,
        });
    const children = mappedGroups.concat(mappedUsers);

    return {
      id: id || email,
      content: {
        value: isEmpty(children) ? name : `${name} (${children.length})`,
        secondaryValue: username,
        tertiaryValue: email,
        rowActions: renderRowActions({ user, parents, selected: selectedUsers, depth }),
      },
      isCategory: depth === 0 && !isEmpty(children),
      disabled: renderDisabledState({ user, parents, selected: selectedUsers, depth }),
      children,
    };
  });

const flattenUsers = (results, user) => {
  return user.children && user.children.length > 0
    ? user.children.reduce(flattenUsers, results)
    : results.concat(user);
};

export const ComplexNestedExample = withReadme(README, () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const users = generateUserList();

  const handleRemove = (row) => {
    setSelectedUsers(selectedUsers.filter((s) => s !== row));
  };

  const handleAdd = (row) => {
    setSelectedUsers([row].concat(...selectedUsers));
  };

  const displayAllUsersList = (unmodifiedUsers, selection = []) => {
    return mapUsers(unmodifiedUsers, {
      selectedUsers: selection,
      renderDisabledState: ({ user, selected, parents }) => {
        const isInSelected = selected.filter((s) => itemsAreEqual(s, user)).length > 0;
        const isChildOfSelected =
          selected.filter((u) => parents.filter((p) => itemsAreEqual(p, u)).length > 0).length > 0;

        return isInSelected || isChildOfSelected;
      },
      renderRowActions: ({ user, selected, parents, depth }) => {
        const { username } = user;
        const isInSelected = selected.filter((s) => itemsAreEqual(s, user)).length > 0;
        const isChildOfSelected =
          selected.filter((u) => parents.filter((p) => itemsAreEqual(p, u)).length > 0).length > 0;

        // Don't render actions on the top level unless it's a user. TODO: is this supposed to support a flat list, too?
        const isCategory = depth === 0 && user && !user.username;

        if (isInSelected || isChildOfSelected || isCategory) {
          return null;
        }

        return () => [
          <Button
            key={`${username}-list-item-button-${depth}`}
            style={{ color: 'black' }}
            role="button"
            aria-label="Add user"
            renderIcon={ArrowRight16}
            hasIconOnly
            kind="ghost"
            size="small"
            onClick={() => handleAdd(user)}
            iconDescription="Add user"
          />,
        ];
      },
    });
  };

  const displaySelectedUsersList = (unmodifiedUsers) => {
    return mapUsers(unmodifiedUsers, {
      renderDisabledState: () => false,
      renderRowActions: ({ user, depth }) => {
        const { username } = user;

        if (depth === 0) {
          return () => [
            <Button
              key={`${username}-list-item-button-${depth}`}
              style={{ color: 'black' }}
              aria-label="Remove user"
              renderIcon={Subtract16}
              hasIconOnly
              kind="ghost"
              size="small"
              onClick={() => handleRemove(user)}
              iconDescription="Remove user"
            />,
          ];
        }

        return null;
      },
    });
  };

  const usersList = displayAllUsersList(users, selectedUsers);
  const userCount = useMemo(() => usersList.reduce(flattenUsers, []).length, [usersList]);
  const selectedList = displaySelectedUsersList(selectedUsers);

  return (
    <ListBuilder
      items={usersList}
      itemCount={userCount}
      testID="select-users"
      selectedItems={selectedList}
      i18n={{
        allListTitle: (count) => {
          return `Users (${count} available)`;
        },
      }}
    />
  );
});

ComplexNestedExample.story = {
  name: 'complex nested example',
  decorators: [createElement],
};

export default {
  title: 'Watson IoT Experimental/☢️ ListBuilder',
  decorators: [withKnobs],
  parameters: {
    component: ListBuilder,
  },
};