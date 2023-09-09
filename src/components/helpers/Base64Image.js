import React from 'react';
import { View, Image } from 'react-native';

const Base64Image = ({ base64ImageData, width, height }) => {
  return (
    <View>
      <Image
        source={{ uri: `data:image/png;base64,${base64ImageData}` }}
        style={{ width: width, height: height }}
      />
    </View>
  );
};

export default Base64Image;
