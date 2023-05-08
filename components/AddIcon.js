import React, { useRef } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Menu, { MenuItem, MenuDivider } from 'react-native-popup-menu';

const AddIcon = ({ navigation }) => {
  const menuRef = useRef();

  const onAddTaskSelected = () => {
    navigation.navigate('AddTask');
    menuRef.current.close();
  };

  const onAddNoteSelected = () => {
    navigation.navigate('AddNote');
    menuRef.current.close();
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
      <Menu
        ref={menuRef}
        rendererProps={{ anchorStyle: { overflow: 'hidden' } }}
        button={
          <Icon
            name="plus"
            size={20}
            color="white"
            style={{ paddingHorizontal: 10 }}
            onPress={() => menuRef.current.open()}
          />
        }
      >
        <MenuItem onPress={onAddTaskSelected}>Add Task</MenuItem>
        <MenuDivider />
        <MenuItem onPress={onAddNoteSelected}>Add Note</MenuItem>
      </Menu>
    </View>
  );
};

export default AddIcon;