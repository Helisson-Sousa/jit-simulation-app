import { SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

// Definindo a interface para os dados esperados
interface ResultData {
  entradas: number;
  saidas: number;
  tempo_medio_sistema: number;
  estoque_final: {
    cortado: number;
  };
  processadas: {
    corte: number;
    costura: number;
  };
  tempo_medio_fila: {
    corte: number;
    costura: number;
  };
  tamanho_medio_fila: {
    corte: number;
    costura: number;
  };
  tempo_ocioso: {
    corte: number;
    costura: number;
  };
  tempo_util: {
    corte: number;
    costura: number;
  };
}

export default function ResultShoePage() {
  const params = useLocalSearchParams();

  let parsedData: ResultData = {
    entradas: 0,
    saidas: 0,
    tempo_medio_sistema: 0,
    estoque_final: { cortado: 0 },
    processadas: { corte: 0, costura: 0 },
    tempo_medio_fila: { corte: 0, costura: 0 },
    tamanho_medio_fila: { corte: 0, costura: 0 },
    tempo_ocioso: { corte: 0, costura: 0 },
    tempo_util: { corte: 0, costura: 0 },
  };

  try {
    const resultado = Array.isArray(params.resultado) ? params.resultado[0] : params.resultado;

    if (resultado) {
      parsedData = JSON.parse(decodeURIComponent(resultado as string));
    }
  } catch (error) {
    console.error("Erro ao decodificar JSON:", error);
  }

  const formatKey = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Função para formatar os dados em uma forma legível
  const formatNumber = (value: number) => value.toFixed(2);

  const handleExportCSV = async () => {
    try {
      const csvHeader = Object.keys(parsedData).join(",");
      const csvValues = Object.values(parsedData)
        .map((value) => {
          if (typeof value === "object" && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return `"${String(value)}"`;
        })
        .join(",");
      const csvContent = `${csvHeader}\n${csvValues}`;

      // Cria um arquivo temporário
      const fileUri = `${FileSystem.documentDirectory}simulacao_${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent);

      // Compartilha o arquivo
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Exportar Resultados",
        UTI: "public.comma-separated-values-text",
      });

      // Remove o arquivo temporário após o uso
      await FileSystem.deleteAsync(fileUri);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View>
            <Text style={styles.title}>Resultado da Simulação (Calçados)</Text>
          </View>

          {/* Exibindo os dados da simulação */}
          <View style={styles.resultContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quantidade de peças entraram no sistema:</Text>
              <Text style={styles.cardValue}>{String(parsedData.entradas)} peças</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quantidade de peças que saíram do sistema:</Text>
              <Text style={styles.cardValue}>{String(parsedData.saidas)} peças</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Lead Time:</Text>
              <Text style={styles.cardValue}>{formatNumber(parsedData.tempo_medio_sistema)} min/un</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quantidade de peças processadas:</Text>
              <Text style={styles.cardValue}>Corte: {String(parsedData.processadas.corte)} peças</Text>
              <Text style={styles.cardValue}>Costura: {String(parsedData.processadas.costura)} peças</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tempo útil e ocioso por processo:</Text>
              <Text style={styles.cardValue}>
                Corte: {formatNumber(parsedData.tempo_util.corte)} min úteis, {formatNumber(parsedData.tempo_ocioso.corte)} min ociosos
              </Text>
              <Text style={styles.cardValue}>
                Costura: {formatNumber(parsedData.tempo_util.costura)} min úteis, {formatNumber(parsedData.tempo_ocioso.costura)} min ociosos
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tempo médio de espera nas filas:</Text>
              <Text style={styles.cardValue}>Corte: {formatNumber(parsedData.tempo_medio_fila.corte)} min</Text>
              <Text style={styles.cardValue}>Costura: {formatNumber(parsedData.tempo_medio_fila.costura)} min</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tamanho médio das filas:</Text>
              <Text style={styles.cardValue}>Corte: {formatNumber(parsedData.tamanho_medio_fila.corte)} peças</Text>
              <Text style={styles.cardValue}>Costura: {formatNumber(parsedData.tamanho_medio_fila.costura)} peças</Text>
            </View>

            {/* <View style={styles.card}>
              <Text style={styles.cardTitle}>Estoque final de peças cortadas:</Text>
              <Text style={styles.cardValue}>{parsedData.estoque_final.cortado} peças</Text>
            </View> */}
          </View>
          <View style={styles.buttonGroup}>
            <Pressable
               style={({ pressed }) => [styles.button, { opacity: pressed ? 0.8 : 1 }]}
               onPress={() => router.push("/")}
            >
              <Text style={styles.buttonText}>Voltar ao Início</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                 styles.button,
                 styles.exportButton,
                { opacity: pressed ? 0.8 : 1 },
              ]}
               onPress={handleExportCSV}
            >
              <Text style={styles.buttonText}>Exportar CSV</Text>
            </Pressable>
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 0,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  exportButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  resultContainer: {
    marginTop: 14,
    marginBottom: 20,
  },
  card: {
    marginBottom: 5,
    padding: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 14,
    color: "#666",
  },
});
