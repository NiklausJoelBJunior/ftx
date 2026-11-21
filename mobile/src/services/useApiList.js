import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { api } from './api';

export function useApiList(endpoint) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(endpoint)
      .then(setItems)
      .catch(error => Alert.alert('FTX', error.message))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { items, loading };
}
