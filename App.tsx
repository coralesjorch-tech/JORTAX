import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, Alert
} from "react-native";

type Vehicle = "AUTO" | "MOTOTAXI";
type Role = "PASAJERO" | "CONDUCTOR";
type Payment = "Efectivo" | "Yape" | "Plin";

// Valores DEMO editables. Sustituir por tarifas aprobadas por JORTAX en Chimbote.
const FARES = {
  AUTO: { base: 4.0, perKm: 1.8 },
  MOTOTAXI: { base: 2.5, perKm: 1.2 },
};

const money = (value: number) => `S/ ${value.toFixed(2)}`;

export default function App() {
  const [role, setRole] = useState<Role>("PASAJERO");
  const [vehicle, setVehicle] = useState<Vehicle>("AUTO");
  const [origin, setOrigin] = useState("Mi ubicación actual");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("5");
  const [payment, setPayment] = useState<Payment>("Efectivo");
  const [available, setAvailable] = useState(false);

  const km = Math.max(0, Number(distance.replace(",", ".")) || 0);
  const fare = useMemo(() => {
    const rate = FARES[vehicle];
    return rate.base + km * rate.perKm;
  }, [vehicle, km]);

  const requestRide = () => {
    if (!destination.trim()) {
      Alert.alert("Falta el destino", "Escribe el destino para continuar.");
      return;
    }
    Alert.alert(
      "Solicitud de demostración",
      `Vehículo: ${vehicle}\nDestino: ${destination}\nDistancia ingresada: ${km} km\nTarifa referencial: ${money(fare)}\nPago: ${payment}\n\nEsta versión todavía no envía solicitudes a conductores reales.`
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101010" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>JOR<Text style={styles.gold}>TAX</Text></Text>
            <Text style={styles.tagline}>Muévete por Chimbote con confianza</Text>
          </View>
          <View style={styles.badge}><Text style={styles.badgeText}>CHIMBOTE</Text></View>
        </View>

        <View style={styles.roleSwitch}>
          <TouchableOpacity onPress={() => setRole("PASAJERO")}
            style={[styles.roleButton, role === "PASAJERO" && styles.roleActive]}>
            <Text style={[styles.roleText, role === "PASAJERO" && styles.roleTextActive]}>Pasajero</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRole("CONDUCTOR")}
            style={[styles.roleButton, role === "CONDUCTOR" && styles.roleActive]}>
            <Text style={[styles.roleText, role === "CONDUCTOR" && styles.roleTextActive]}>Conductor</Text>
          </TouchableOpacity>
        </View>

        {role === "PASAJERO" ? (
          <>
            <Text style={styles.title}>¿A dónde vamos hoy?</Text>
            <Text style={styles.label}>PUNTO DE RECOJO</Text>
            <TextInput value={origin} onChangeText={setOrigin} style={styles.input}
              placeholder="Ingresa tu ubicación" placeholderTextColor="#888" />
            <Text style={styles.label}>DESTINO</Text>
            <TextInput value={destination} onChangeText={setDestination} style={styles.input}
              placeholder="¿A dónde quieres ir?" placeholderTextColor="#888" />

            <Text style={styles.titleSmall}>Elige tu vehículo</Text>
            <View style={styles.vehicleRow}>
              {(["AUTO", "MOTOTAXI"] as Vehicle[]).map((v) => (
                <TouchableOpacity key={v} onPress={() => setVehicle(v)}
                  style={[styles.vehicleCard, vehicle === v && styles.vehicleSelected]}>
                  <Text style={styles.vehicleEmoji}>{v === "AUTO" ? "🚗" : "🛺"}</Text>
                  <Text style={[styles.vehicleName, vehicle === v && styles.darkText]}>{v}</Text>
                  <Text style={[styles.vehicleHint, vehicle === v && styles.darkText]}>
                    {v === "AUTO" ? "Taxi" : "Urbano"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>DISTANCIA ESTIMADA (KM) – DEMO</Text>
            <TextInput value={distance} onChangeText={setDistance} keyboardType="decimal-pad"
              style={styles.input} placeholder="Ej. 5" placeholderTextColor="#888" />
            <Text style={styles.helper}>En la versión conectada, la distancia se calculará con el mapa y la ruta real.</Text>

            <Text style={styles.titleSmall}>Método de pago</Text>
            <View style={styles.paymentRow}>
              {(["Efectivo", "Yape", "Plin"] as Payment[]).map((p) => (
                <TouchableOpacity key={p} onPress={() => setPayment(p)}
                  style={[styles.payment, payment === p && styles.paymentSelected]}>
                  <Text style={[styles.paymentText, payment === p && styles.darkText]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.fareBox}>
              <Text style={styles.fareCaption}>TARIFA REFERENCIAL</Text>
              <Text style={styles.fare}>{money(fare)}</Text>
              <Text style={styles.fareDetail}>
                Base {money(FARES[vehicle].base)} + {km.toFixed(1)} km × {money(FARES[vehicle].perKm)}/km
              </Text>
              <Text style={styles.disclaimer}>Importes ilustrativos; deben configurarse y aprobarse antes del lanzamiento.</Text>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={requestRide}>
              <Text style={styles.primaryText}>SOLICITAR VIAJE</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.driverPanel}>
            <Text style={styles.title}>Panel del conductor</Text>
            <Text style={styles.helper}>Activa tu disponibilidad para indicar que puedes recibir solicitudes.</Text>
            <TouchableOpacity onPress={() => setAvailable(!available)}
              style={[styles.availability, available && styles.available]}>
              <View style={[styles.dot, available && styles.dotOn]} />
              <Text style={styles.availabilityText}>{available ? "ESTÁS DISPONIBLE" : "ESTÁS DESCONECTADO"}</Text>
            </TouchableOpacity>
            <Text style={styles.label}>TIPO DE VEHÍCULO</Text>
            <View style={styles.vehicleRow}>
              {(["AUTO", "MOTOTAXI"] as Vehicle[]).map((v) => (
                <TouchableOpacity key={v} onPress={() => setVehicle(v)}
                  style={[styles.vehicleCard, vehicle === v && styles.vehicleSelected]}>
                  <Text style={styles.vehicleEmoji}>{v === "AUTO" ? "🚗" : "🛺"}</Text>
                  <Text style={[styles.vehicleName, vehicle === v && styles.darkText]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Próxima función</Text>
              <Text style={styles.infoText}>Recepción de solicitudes, aceptación de viajes, navegación GPS e historial de ganancias.</Text>
            </View>
          </View>
        )}

        <Text style={styles.footer}>JORTAX © 2026 · Versión inicial de demostración</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#101010" },
  container: { padding: 20, paddingBottom: 36 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  brand: { color: "#FFFFFF", fontSize: 32, fontWeight: "900", letterSpacing: 1 },
  gold: { color: "#C9A34A" },
  tagline: { color: "#C9C9C9", fontSize: 11, marginTop: 2 },
  badge: { borderWidth: 1, borderColor: "#C9A34A", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: "#E5C779", fontSize: 10, fontWeight: "800" },
  roleSwitch: { flexDirection: "row", backgroundColor: "#242424", borderRadius: 12, padding: 4, marginBottom: 24 },
  roleButton: { flex: 1, padding: 12, alignItems: "center", borderRadius: 9 },
  roleActive: { backgroundColor: "#C9A34A" },
  roleText: { color: "#DDD", fontWeight: "700" },
  roleTextActive: { color: "#111" },
  title: { color: "#FFF", fontSize: 23, fontWeight: "800", marginBottom: 20 },
  titleSmall: { color: "#FFF", fontSize: 16, fontWeight: "800", marginTop: 22, marginBottom: 12 },
  label: { color: "#D8B765", fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: "#242424", color: "#FFF", borderWidth: 1, borderColor: "#393939", borderRadius: 11, padding: 14, fontSize: 14 },
  helper: { color: "#AAA", fontSize: 12, lineHeight: 18, marginTop: 8 },
  vehicleRow: { flexDirection: "row", gap: 12 },
  vehicleCard: { flex: 1, backgroundColor: "#242424", borderWidth: 1, borderColor: "#3B3B3B", borderRadius: 14, padding: 16, alignItems: "center" },
  vehicleSelected: { backgroundColor: "#C9A34A", borderColor: "#E5C779" },
  vehicleEmoji: { fontSize: 30, marginBottom: 8 },
  vehicleName: { color: "#FFF", fontWeight: "900", fontSize: 14 },
  vehicleHint: { color: "#CCC", fontSize: 11, marginTop: 3 },
  darkText: { color: "#151515" },
  paymentRow: { flexDirection: "row", gap: 8 },
  payment: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#555", alignItems: "center" },
  paymentSelected: { backgroundColor: "#C9A34A", borderColor: "#E5C779" },
  paymentText: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  fareBox: { backgroundColor: "#242424", borderRadius: 15, borderWidth: 1, borderColor: "#80682F", padding: 18, marginTop: 24 },
  fareCaption: { color: "#D8B765", fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  fare: { color: "#FFF", fontSize: 32, fontWeight: "900", marginTop: 5 },
  fareDetail: { color: "#DDD", fontSize: 11, marginTop: 6 },
  disclaimer: { color: "#AFAFAF", fontSize: 10, marginTop: 10, lineHeight: 15 },
  primaryButton: { backgroundColor: "#C9A34A", borderRadius: 12, padding: 17, alignItems: "center", marginTop: 16 },
  primaryText: { color: "#111", fontWeight: "900", letterSpacing: 0.7 },
  driverPanel: { marginTop: 4 },
  availability: { flexDirection: "row", alignItems: "center", gap: 10, padding: 17, backgroundColor: "#292929", borderRadius: 12, marginVertical: 20, borderWidth: 1, borderColor: "#555" },
  available: { borderColor: "#3FA66B", backgroundColor: "#173326" },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#999" },
  dotOn: { backgroundColor: "#48D17A" },
  availabilityText: { color: "#FFF", fontWeight: "800", fontSize: 12 },
  infoBox: { padding: 16, backgroundColor: "#242424", borderRadius: 12, marginTop: 24 },
  infoTitle: { color: "#D8B765", fontWeight: "800", marginBottom: 8 },
  infoText: { color: "#DDD", lineHeight: 20, fontSize: 13 },
  footer: { color: "#777", textAlign: "center", fontSize: 10, marginTop: 32 },
});
