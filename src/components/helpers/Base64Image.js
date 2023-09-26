import React from 'react';
import { View, Image } from 'react-native';

const Base64Image = ({ base64ImageData, width, height, redonda }) => {
  return (
    <View>
      <Image
        source={{ uri: `data:image/png;base64,${base64ImageData}` }}
        style={{ width: width, height: height, borderRadius: redonda ? 100 : 0}}
      />
    </View>
  );
};

export default Base64Image;
