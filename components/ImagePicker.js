import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';


const ImagePickerComp =() => {
  

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}

export default ImagePickerComp;