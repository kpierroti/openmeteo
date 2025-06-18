import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Text, Card, Provider as PaperProvider, useTheme } from 'react-native-paper';

export default function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão de localização negada');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.coords.latitude}&longitude=${loc.coords.longitude}&current=temperature_2m,weathercode,wind_speed_10m`;
      const res = await fetch(url);
      const data = await res.json();
      setWeather(data.current);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Carregando previsão do tempo...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <Card style={{ margin: 20, padding: 20, width: '90%' }}>
          <Card.Title title="Previsão Atual" />
          <Card.Content>
            <Text>Temperatura: {weather.temperature_2m}°C</Text>
            <Text>Velocidade do vento: {weather.wind_speed_10m} km/h</Text>
            <Text>Código do tempo: {weather.weathercode}</Text>
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
}
