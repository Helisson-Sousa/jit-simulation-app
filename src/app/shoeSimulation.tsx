import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Modal,
  Image,
  ActivityIndicator
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type SimulationParams = {
  "estoque_inicial": number;
  "estoque_seg_costura": number;
  "tempo_simulacao": number;
  "media_corte": number;
  "std_corte": number;
  "tempo_setup_corte": number;
  "media_costura": number;
  "std_costura": number;
  "tempo_setup_costura": number;
};

export default function ShoeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [machineModalVisible, setMachineModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalType, setModalType] = useState<keyof SimulationParams | undefined>(undefined);

  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    estoque_inicial: 95,
    estoque_seg_costura: 50,
    tempo_simulacao: 480,
    media_corte: 4.4,
    std_corte: 0.2,
    tempo_setup_corte: 0.3,
    media_costura: 4.5,
    std_costura: 0.3,
    tempo_setup_costura: 0.2,
  });
  
  // Gerenciando todos os valores de input em um único estado
  const [inputValues, setInputValues] = useState({
    media_corte: simulationParams.media_corte.toString(),
    std_corte: simulationParams.std_corte.toString(),
    tempo_setup_corte: simulationParams.tempo_setup_corte.toString(),
    estoque_inicial: simulationParams.estoque_inicial.toString(),
    estoque_seg_costura: simulationParams.estoque_seg_costura.toString(),
    media_costura: simulationParams.media_costura.toString(),
    std_costura: simulationParams.std_costura.toString(),
    tempo_setup_costura: simulationParams.tempo_setup_costura.toString(),
    tempo_simulacao: simulationParams.tempo_simulacao.toString(),
  });

  const openModal = (type: keyof SimulationParams) => {
    setModalType(type);
    setInputValues((prev) => ({
      ...prev,
      [type]: simulationParams[type].toString(),
    }));
    setModalVisible(true);
  };

  const openMachineModal = (type: keyof SimulationParams) => {
    setModalType(type);
    setInputValues((prev) => ({
      ...prev,
      [type]: simulationParams[type].toString(),
    }));
    setMachineModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeMachineModal = () => {
    setMachineModalVisible(false);
  };

  const handleSave = () => {
    if (modalType !== undefined) {
      const newSimulationParams = Object.entries(inputValues).reduce((acc, [key, value]) => {
        acc[key as keyof SimulationParams] = parseFloat(value);
        return acc;
      }, {} as SimulationParams);
      setSimulationParams(newSimulationParams);
    }
    closeModal();
    closeMachineModal();
  }

  const router = useRouter();

  const handleStartSimulation = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/simular`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          layout: "shoe",
          parametros: simulationParams,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao iniciar simulação");
      }

      const data = await response.json();

      router.push({
        pathname: "/result-shoe",
        params: { resultado: encodeURIComponent(JSON.stringify(data)) },
      });

    } catch (error) {
      setError("Erro ao iniciar simulação");
      console.error("Erro ao iniciar simulação:", error);
    } finally {
      setLoading(false);
    }
  };

  const modalMachineTitle = modalType === "tempo_setup_corte" ? "Corte" : "Costura";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fábrica de Calçados</Text>
        <Pressable onPress={() => setInfoModalVisible(true)}>
          <Ionicons name="information-circle" size={28} color="blue" />
        </Pressable>
      </View>

      <View style={{ alignItems: "center" }}>
        {/* Linha 1 */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
          {/* Estoque inicial */}
          <View style={{ alignItems: "center" }}>
            <Pressable onPress={() => openModal("estoque_inicial")}>
              <Image source={require("../../assets/estoque.png")} style={styles.stock} />
            </Pressable>
            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Estoque Inicial</Text>
            <Text style={{ fontSize: 12 }}>{simulationParams["estoque_inicial"]} unid</Text>
          </View>

          {/* Esteira horizontal */}
          <Image source={require("../../assets/esteira.png")} style={styles.conveyorHorizontal} />

          {/* Máquina de corte */}
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Máquina de Corte</Text>
            <Text style={{ fontSize: 12 }}>Process: {simulationParams.media_corte} ± {simulationParams.std_corte} min</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 12 }}>Setup: </Text>
              <Text style={{ fontSize: 12 }}>{simulationParams["tempo_setup_corte"]} min</Text>
            </View>
            <Pressable onPress={() => openMachineModal("tempo_setup_corte")}>
              <Image source={require("../../assets/maquina-corte.png")} style={styles.machine} />
            </Pressable>
          </View>
        </View>

        {/* Esteira vertical */}
        <Image source={require("../../assets/esteira.png")} style={styles.conveyorVertical} />

        {/* Linha 2 */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
          {/* Máquina de costura */}
          <View style={{ alignItems: "center" }}>
            <Pressable onPress={() => openMachineModal("tempo_setup_costura")}>
              <Image source={require("../../assets/maquina-costura.png")} style={styles.machine} />
            </Pressable>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Máquina de Costura</Text>
              <Text style={{ fontSize: 12 }}>Process: {simulationParams.media_costura} ± {simulationParams.std_costura} min</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 12 }}>Setup: </Text>
                <Text style={{ fontSize: 12 }}>{simulationParams["tempo_setup_costura"]} min</Text>
              </View>
            </View>
          </View>

          {/* Esteira da direita para a esquerda */}
          <Image source={require("../../assets/esteira.png")} style={styles.conveyorHorizontal} />

          {/* Estoque inferior direito */}
          <View style={{ alignItems: "center" }}>
            <Pressable onPress={() => openModal("estoque_seg_costura")}>
              <Image source={require("../../assets/estoque.png")} style={styles.stock} />
            </Pressable>
            <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 10 }}>Estoque Seg. Costura</Text>
            <Text style={{ fontSize: 12 }}>{simulationParams["estoque_seg_costura"]} unid</Text>
          </View>
        </View>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalType} / und</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o valor"
              keyboardType="numeric"
              value={inputValues[modalType as keyof typeof inputValues] || ''}
              onChangeText={(value) => setInputValues((prev) => ({
                ...prev,
                [modalType || '']: value
              }))}
            />
            <View style={styles.modalButtonContainer}>
              <Pressable style={styles.modalButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={machineModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.machineModalTitle}>Configuração {modalMachineTitle} / min</Text>

            {/* Linha com os inputs */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Tempo de Processamento: </Text>
              <TextInput
                style={styles.inputMachine}
                placeholder="Média"
                keyboardType="numeric"
                value={inputValues[modalMachineTitle === "Corte" ? "media_corte" : "media_costura"]}
                onChangeText={(value) => setInputValues((prev) => ({
                  ...prev,
                  [modalMachineTitle === "Corte" ? "media_corte" : "media_costura"]: value
                }))}
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>Desvio Padrão: </Text>
              <TextInput
                style={styles.inputMachine}
                placeholder="std"
                keyboardType="numeric"
                value={inputValues[modalMachineTitle === "Corte" ? "std_corte" : "std_costura"]}
                onChangeText={(value) => setInputValues((prev) => ({
                  ...prev,
                  [modalMachineTitle === "Corte" ? "std_corte" : "std_costura"]: value
                }))}
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>Tempo de Setup: </Text>
              <TextInput
                style={styles.inputMachine}
                placeholder="Setup"
                keyboardType="numeric"
                value={inputValues[modalMachineTitle === "Corte" ? "tempo_setup_corte" : "tempo_setup_costura"]}
                onChangeText={(value) => setInputValues((prev) => ({
                  ...prev,
                  [modalMachineTitle === "Corte" ? "tempo_setup_corte" : "tempo_setup_costura"]: value
                }))}
              />
            </View>

            <View style={styles.modalButtonContainer}>
              <Pressable style={styles.modalButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={closeMachineModal}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={infoModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Informações</Text>
            <Text>
            <Text style={{ fontWeight: 'bold' }}>Componentes Principais</Text>{"\n\n"}
      
            <Text style={{ fontWeight: 'bold' }}>Máquinas:</Text>{"\n"}
            Corte: 1 máquina.{"\n"}
            Costura: 1 máquina.{"\n\n"}

            <Text style={{ fontWeight: 'bold' }}>Estoques de Segurança:</Text>{"\n"}
            Ajustável.{"\n\n"}

            <Text style={{ fontWeight: 'bold' }}>Tempo de processamento:</Text>{"\n"}
            Ajustável.{"\n\n"}

            <Text style={{ fontWeight: 'bold' }}>Tempo de Setup (Preparo):</Text>{"\n"}
            Ajustável.{"\n\n"}

            <Text style={{ fontWeight: 'bold' }}>Parâmetros de Entrada:</Text>{"\n"}
            Estoque inicial de 95 unidados de couro.{"\n\n"}

            <Text style={{ fontWeight: 'bold' }}>Características do Processo:</Text>{"\n\n"}

            <Text style={{ fontWeight: 'bold' }}>Corte:</Text> O processo começa no início do turno de trabalho. A máquina de corte processa o couro e, após o processamento, segue para a máquina de costura.{"\n\n"}

            <Text style={{ fontWeight: 'bold' }}>Costura:</Text> A máquina de costura realiza o processamento da peça resultando no produto pronto.
            </Text>  {/* Coloque o conteúdo relevante aqui */}
            <Pressable style={styles.modalButton} onPress={() => setInfoModalVisible(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Botão para iniciar a simulação */}
      <Pressable style={styles.startButton} onPress={handleStartSimulation} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Simulação</Text>
        )}
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.warningContainer}>
        <Text style={styles.warningText}>*O tempo da simulação é de 8 horas.</Text>
        <Text style={styles.warningText}>* Para alterar a configuração, pressione no elemento desejado.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  stock: {
    width: 80,
    height: 80,
  },
  machine: {
    width: 120,
    height: 120,
  },
  conveyorHorizontal: {
    width: 90,
    height: 30,
    marginHorizontal: "3%",
  },
  conveyorVertical: {
    width: 80,
    height: 30,
    marginVertical: "3%",
    marginHorizontal: 0,
    alignSelf: "flex-end",
    transform: [{ rotate: "90deg" }],
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  machineModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "100%",
    marginBottom: 10,
    borderRadius: 5,
  },
  inputMachine: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "30%",
    marginBottom: 10,
    borderRadius: 5,
  },
  modalButtonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 50,
    width: "50%",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
    marginBottom: 30, 
  },
  title: {
    fontSize: 24,
    marginRight: 20,
  },
  warningContainer: {
    alignItems: "flex-start", 
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 30,
  },
  warningText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",  
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
  },
});
