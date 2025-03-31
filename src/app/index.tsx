import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ShoeScreen from "./shoeSimulation";
import CarScreen from "./carSimulation";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export default function Index() {
  const [selectedItem, setSelectedItem] = useState("Shoe Factory");
  const pathname = usePathname();

  const handleImageClick = (imageName: string) => {
    setSelectedItem(imageName);
  };

  const isResultPage = pathname === "/result";

  return (
    <SafeAreaProvider style={styles.container}>
      <QueryClientProvider client={queryClient}>

        {selectedItem === "Shoe Factory" ? <ShoeScreen /> : <CarScreen />} 

        {/* Esconder a seleção se estivermos na ResultPage */}
        {!isResultPage && (
          <>
            <View style={[styles.textContainer, isResultPage && { marginVertical: 5 }]}>
              <Text style={styles.title}>Escolha o Sistema Produtivo para simulação:</Text>
            </View>

            <View style={styles.bottomMenu}>
              {/* Sapato - Seleção dinâmica */}
              <TouchableOpacity
                onPress={() => handleImageClick("Shoe Factory")}
                style={[
                  styles.itemContainer,
                  selectedItem === "Shoe Factory" && styles.selectedItem,
                ]}
              >
                <Image source={require("../../assets/shoe-factory.png")} style={styles.image} />
              </TouchableOpacity>

              {/* Carro - Seleção dinâmica */}
              <TouchableOpacity
                onPress={() => handleImageClick("Car Factory")}
                style={[
                  styles.itemContainer,
                  selectedItem === "Car Factory" && styles.selectedItem,
                ]}
              >
                <Image source={require("../../assets/car-factory.png")} style={styles.image} />
              </TouchableOpacity>
            </View>
          </>
        )} 
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#e0e0e0",
    marginBottom: 100,
  },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e0e0e0",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  selectedItem: {
    backgroundColor: "#A3C1DA",
  },
  textContainer: {
    alignItems: "center",
    marginVertical: 100,
    backgroundColor: "#1F3A93",
    padding: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4A90E2",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  robot: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

