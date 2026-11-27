import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

const FALLBACK_IMAGE = require('../../assets/farm-field.jpg');

export default function ImageWithFallback({ uri, style }) {
  const [imageUri, setImageUri] = useState(uri);

  useEffect(() => {
    setImageUri(uri);
  }, [uri]);

  return (
    <Image
      source={imageUri ? { uri: imageUri } : FALLBACK_IMAGE}
      style={style}
      onError={() => setImageUri(null)}
    />
  );
}
