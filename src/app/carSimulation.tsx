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
  "estoque_seg_flamagem": number;
  "tempo_simulacao": number;
  "media_injetora": number;
  "std_injetora": number;
  "tempo_setup_injetora": number;
  "media_flamagem": number;
  "std_flamagem": number;
  "tempo_setup_flamagem": number;
  "media_colagem": number;
  "std_colagem": number;
  "tempo_setup_colagem": number;
  "media_acabamento": number;
};

export default function CarScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [machineModalVisible, setMachineModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalType, setModalType] = useState<keyof SimulationParams | undefined>(undefined);

  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    estoque_inicial: 100,
    estoque_seg_flamagem: 50,
    tempo_simulacao: 28800,
    media_injetora: 44.08,
    std_injetora: 0.87,
    tempo_setup_injetora: 2.4,
    media_flamagem: 34.8,
    std_flamagem: 0.97,
    tempo_setup_flamagem: 3.84,
    media_colagem: 82.3,
    std_colagem: 1.1,
    tempo_setup_colagem: 3.06,
    media_acabamento: 50,
  });
 
  // Gerenciando todos os valores de input em um único estado
  const [inputValues, setInputValues] = useState({
    media_injetora: simulationParams.media_injetora.toString(),
    std_injetora: simulationParams.std_injetora.toString(),
    tempo_setup_injetora: simulationParams.tempo_setup_injetora.toString(),
    estoque_inicial: simulationParams.estoque_inicial.toString(),
    estoque_seg_flamagem: simulationParams.estoque_seg_flamagem.toString(),
    media_flamagem: simulationParams.media_flamagem.toString(),
    std_flamagem: simulationParams.std_flamagem.toString(),
    tempo_setup_flamagem: simulationParams.tempo_setup_flamagem.toString(),
    media_colagem: simulationParams.media_colagem.toString(),
    std_colagem: simulationParams.std_colagem.toString(),
    tempo_setup_colagem: simulationParams.tempo_setup_colagem.toString(),
    media_acabamento: simulationParams.media_acabamento.toString(),
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
          layout: "car",
          parametros: simulationParams,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao iniciar simulação");
      }

      const data = await response.json();
      console.log(data);

      router.push({
        pathname: "/result-car",
        params: { resultado: encodeURIComponent(JSON.stringify(data)) },
      });

    } catch (error) {
      setError("Erro ao iniciar simulação");
      console.error("Erro ao iniciar simulação:", error);
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = modalType === "media_acabamento" ? `${modalType} / seg` : `${modalType} / und`;
  const modalMachineTitle = modalType === "tempo_setup_injetora" 
    ? "injetora" 
    : modalType === "tempo_setup_flamagem" 
    ? "flamagem" 
    : "colagem";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Montadora</Text>
        <Pressable onPress={() => setInfoModalVisible(true)}>
          <Ionicons name="information-circle" size={28} color="blue" />
        </Pressable>
      </View>

      <View style={{ alignItems: "center" }}>
        {/* Linha 1 */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
          {/* Estoque inicial */}
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Estoque Inicial</Text>
            <Text style={{ fontSize: 12 }}>{simulationParams["estoque_inicial"]} unid</Text>
            <Pressable onPress={() => openModal("estoque_inicial")}>
              <Image source={require("../../assets/estoque.png")} style={styles.stock} />
            </Pressable>
          </View>

          {/* Esteira horizontal */}
          <Image source={require("../../assets/esteira.png")} style={styles.conveyorHorizontal} />

          {/* Máquina de injetora */}
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Injetora</Text>
            <Text style={{ fontSize: 12 }}>Process: {simulationParams.media_injetora} s</Text>
            <Text style={{ fontSize: 12 }}>std: {simulationParams.std_injetora} s
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 12 }}>Setup: </Text>
              <Text style={{ fontSize: 12 }}>{simulationParams["tempo_setup_injetora"]} s</Text>
            </View>
            <Pressable onPress={() => openMachineModal("tempo_setup_injetora")}>
              <Image source={require("../../assets/injetora.png")} style={styles.machine} />
            </Pressable>
          </View>

          {/* Esteira da direita para a esquerda */}
          <Image source={require("../../assets/esteira.png")} style={styles.conveyorHorizontal} />

          {/* Acabamento */}
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 10 }}>Acabamento</Text>
            <Text style={{ fontSize: 12 }}>{simulationParams["media_acabamento"]} s</Text>
            <Pressable onPress={() => openModal("media_acabamento")}>
              <Image source={require("../../assets/operador.png")} style={styles.operator} />
            </Pressable>
          </View>
        </View>

        {/* Esteira vertical */}
        <Image source={require("../../assets/esteira.png")} style={styles.conveyorVertical} />
        
        {/* Linha 2 */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
          {/* Máquina de colagem */}
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Pressable onPress={() => openMachineModal("tempo_setup_colagem")}>
              <Image source={require("../../assets/colagem.png")} style={styles.machine} />
            </Pressable>
            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Colagem</Text>
            <Text style={{ fontSize: 12 }}>Process: {simulationParams.media_colagem} s</Text>
            <Text style={{ fontSize: 12 }}>std: {simulationParams.std_colagem} s</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 12 }}>Setup: </Text>
              <Text style={{ fontSize: 12 }}>{simulationParams["tempo_setup_colagem"]} s</Text>
            </View>
          </View>

          {/* Esteira horizontal */}
          <Image source={require("../../assets/esteira.png")} style={styles.conveyorTwoHorizontal} />

          {/* Máquina de flamagem */}
          <View style={{ alignItems: "center" }}>
            <Pressable onPress={() => openMachineModal("tempo_setup_flamagem")}>
              <Image source={require("../../assets/flamagem.png")} style={styles.machine} />
            </Pressable>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Flamagem</Text>
              <Text style={{ fontSize: 12 }}>Process: {simulationParams.media_flamagem} s</Text>
              <Text style={{ fontSize: 12 }}>std: {simulationParams.std_flamagem} s</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 12 }}>Setup: </Text>
                <Text style={{ fontSize: 12 }}>{simulationParams["tempo_setup_flamagem"]} s</Text>
              </View>
            </View>
          </View>

          {/* Esteira horizontal */}
          <Image source={require("../../assets/esteira.png")} style={styles.conveyorTwoHorizontal} />

          {/* Estoque inferior direito */}
          <View style={{ alignItems: "center" }}>
            <Pressable onPress={() => openModal("estoque_seg_flamagem")}>
              <Image source={require("../../assets/estoque.png")} style={styles.stock} />
            </Pressable>
            <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 10 }}>Est. Flamagem</Text>
            <Text style={{ fontSize: 12 }}>{simulationParams["estoque_seg_flamagem"]} unid</Text>
          </View>
        </View>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o valor"
              keyboardType="numeric"
              value={inputValues[modalType as keyof typeof inputValues] || ''}
              onChangeText={(value) => setInputValues((prev) => ({
                ...prev,
                [modalType || '']: value
              }))}
              editable={modalType !== "estoque_inicial"}
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
            <Text style={styles.machineModalTitle}>Configuração {modalMachineTitle} / seg</Text>

            {/* Linha com os inputs */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Tempo de Processamento: </Text>
              <TextInput
                style={styles.inputMachine}
                placeholder="Média"
                keyboardType="numeric"
                value={inputValues[modalMachineTitle === "injetora" ? "media_injetora" : (modalMachineTitle === "flamagem" ? "media_flamagem" : "media_colagem")]}
                onChangeText={(value) => setInputValues((prev) => ({
                  ...prev,
                  [modalMachineTitle === "injetora" ? "media_injetora" : (modalMachineTitle === "flamagem" ? "media_flamagem" : "media_colagem")]: value
                }))}
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>Desvio Padrão: </Text>
              <TextInput
                style={styles.inputMachine}
                placeholder="std"
                keyboardType="numeric"
                value={inputValues[modalMachineTitle === "injetora" ? "std_injetora" : (modalMachineTitle === "flamagem" ? "std_flamagem" : "std_colagem")]}
                onChangeText={(value) => setInputValues((prev) => ({
                  ...prev,
                  [modalMachineTitle === "injetora" ? "std_injetora" : (modalMachineTitle === "flamagem" ? "std_flamagem" : "std_colagem")]: value
                }))}
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>Tempo de Setup: </Text>
              <TextInput
                style={styles.inputMachine}
                placeholder="Setup"
                keyboardType="numeric"
                value={inputValues[modalMachineTitle === "injetora" ? "tempo_setup_injetora" : (modalMachineTitle === "flamagem" ? "tempo_setup_flamagem" : "tempo_setup_colagem")]}
                onChangeText={(value) => setInputValues((prev) => ({
                  ...prev,
                  [modalMachineTitle === "injetora" ? "tempo_setup_injetora" : (modalMachineTitle === "flamagem" ? "tempo_setup_flamagem" : "tempo_setup_colagem")]: value
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
              Injeção: 1 máquina.{"\n"}
              Flamagem: 1 máquina.{"\n"}
              Colagem: 1 máquina.{"\n\n"}

              <Text style={{ fontWeight: 'bold' }}>Operadores:</Text>{"\n"}
              Acabamento e pesagem: 2 operadores.{"\n\n"}

              <Text style={{ fontWeight: 'bold' }}>Estoques mínimo:</Text>{"\n"}
                Flamagem: 50 peças.{"\n\n"}

              <Text style={{ fontWeight: 'bold' }}>Tempo de Processamento:</Text>{"\n"}
              Ajustável.{"\n\n"}

              <Text style={{ fontWeight: 'bold' }}>Tempo de Setup (Preparo):</Text>{"\n"}
              Ajustável.{"\n\n"}

              <Text style={{ fontWeight: 'bold' }}>Parâmetros de Entrada:</Text>{"\n"}
              Estoque inicial, fixo, de 100 unidades.{"\n\n"}

              <Text style={{ fontWeight: 'bold' }}>Características do Processo:</Text>{"\n\n"}

              <Text style={{ fontWeight: 'bold' }}>Injeção:</Text> Peças chegam no sistema, são processadas  e seguem para o acabamento.{"\n"}

              <Text style={{ fontWeight: 'bold' }}>Acabamento:</Text> Feito por operadores.{"\n"}

              <Text style={{ fontWeight: 'bold' }}>Flamagem:</Text> Após o acabamento e é realizado por uma máquina.{"\n"}

              <Text style={{ fontWeight: 'bold' }}>Colagem:</Text> Feito por uma máquina, com pesagem antes e após, e resulta na peça final pronta. {"\n"}
            </Text>
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

      <View style={styles.warningContainer}>
        <Text style={styles.warningText}>*O tempo da simulação é de 8 horas.</Text>
        <Text style={styles.warningText}>* Para alterar a configuração, pressione no elemento desejado.</Text>
        <Text style={styles.warningText}>* A quantidade de estoque inicial é fixa.</Text>
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
    width: 50,
    height: 50,
    marginTop: 10,
  },
  machine: {
    width: 60,
    height: 60,
  },
  operator: {
    width: 60,
    height: 60,
  },
  conveyorHorizontal: {
    width: "5%",
    height: 20,
    marginHorizontal: "2%",
    marginTop: 40,
  },
  conveyorTwoHorizontal: {
    width: "5%",
    height: 20,
    marginHorizontal: "2%",
    marginTop: -30,
  },
  conveyorVertical: {
    width: 80,
    height: 20,
    marginVertical: 40,
    alignSelf: "flex-end",
    transform: [{ rotate: "90deg" }],
  },
  conveyorSecondVertical: {
    width: 30,
    height: 20,
    marginTop: 15,
    marginHorizontal: 30,
    alignSelf: "flex-start",
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
    marginTop: 5,
    marginBottom: 50, 
  },
  title: {
    fontSize: 24,
    marginRight: 20,
  },
  warningContainer: {
    alignItems: "flex-start", 
    marginLeft: 10,
    marginTop: 20,
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
});
