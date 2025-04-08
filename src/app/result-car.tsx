import { SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

// Definindo a interface para os dados esperados
interface ResultData {
  quantidade_entradas: number;
  quantidade_processadas: {
    acabamento: number;
    colagem: number;
    flamagem: number;
    injetora: number;
  };
  quantidade_saidas: number;
  tamanho_fila: {
    acabamento: number;
    colagem: number;
    flamagem: number;
  };
  tempo_espera_filas: {
    acabamento: number;
    colagem: number;
    flamagem: number;
  };
  tempo_medio_ciclo: number;
  tempo_util_ocioso: {
    injetora: {
      ocioso: number;
      util: number;
    };
    acabamento: {
      ocioso: number;
      util: number;
    };
    colagem: {
      ocioso: number;
      util: number;
    };
    flamagem: {
      ocioso: number;
      util: number;
    };
  };
}

export default function ResultCarPage() {
  const params = useLocalSearchParams();

  let parsedData: ResultData = {
    quantidade_entradas: 0,
    quantidade_processadas: {
      acabamento: 0,
      colagem: 0,
      flamagem: 0,
      injetora: 0,
    },
    quantidade_saidas: 0,
    tamanho_fila: {
      acabamento: 0,
      colagem: 0,
      flamagem: 0,
    },
    tempo_espera_filas: {
      acabamento: 0,
      colagem: 0,
      flamagem: 0,
    },
    tempo_medio_ciclo: 0,
    tempo_util_ocioso: {
      injetora: { ocioso: 0, util: 0 },
      acabamento: { ocioso: 0, util: 0 },
      colagem: { ocioso: 0, util: 0 },
      flamagem: { ocioso: 0, util: 0 },
    },
  };

  try {
    const resultado = Array.isArray(params.resultado) ? params.resultado[0] : params.resultado;

    if (resultado) {
      parsedData = JSON.parse(decodeURIComponent(resultado as string));
    }
  } catch (error) {
    console.error("Erro ao decodificar JSON:", error);
  }

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
            <Text style={styles.title}>Resultado da Simulação (Montadora)</Text>
          </View>

          {/* Exibindo os dados da simulação */}
          <View style={styles.resultContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quantidade de peças entraram no sistema:</Text>
              <Text style={styles.cardValue}>{String(parsedData.quantidade_entradas)} peças</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quantidade de peças que saíram do sistema:</Text>
              <Text style={styles.cardValue}>{String(parsedData.quantidade_saidas)} peças</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Lead Time:</Text>
              <Text style={styles.cardValue}>{formatNumber(parsedData.tempo_medio_ciclo)} min/un</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quantidade processada:</Text>
              <Text style={styles.cardValue}>Injetora: {String(parsedData.quantidade_processadas.injetora)} peças</Text>
              <Text style={styles.cardValue}>Acabamento: {String(parsedData.quantidade_processadas.acabamento)} peças</Text>
              <Text style={styles.cardValue}>Flamagem: {String(parsedData.quantidade_processadas.flamagem)} peças</Text>
              <Text style={styles.cardValue}>Colagem: {String(parsedData.quantidade_processadas.colagem)} peças</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tempo útil e ocioso por processo:</Text>
              <Text style={styles.cardValue}>
                Injetora: {formatNumber(parsedData.tempo_util_ocioso.injetora.util)} min úteis, {formatNumber(parsedData.tempo_util_ocioso.injetora.ocioso)} min ociosos
              </Text>
              <Text style={styles.cardValue}>
                Acabamento: {formatNumber(parsedData.tempo_util_ocioso.acabamento.util)} min úteis, {formatNumber(parsedData.tempo_util_ocioso.acabamento.ocioso)} min ociosos
              </Text>
              <Text style={styles.cardValue}>
                Flamagem: {formatNumber(parsedData.tempo_util_ocioso.flamagem.util)} min úteis, {formatNumber(parsedData.tempo_util_ocioso.flamagem.ocioso)} min ociosos
              </Text>
              <Text style={styles.cardValue}>
                Colagem: {formatNumber(parsedData.tempo_util_ocioso.colagem.util)} min úteis, {formatNumber(parsedData.tempo_util_ocioso.colagem.ocioso)} min ociosos
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tempo de espera nas filas:</Text>
              <Text style={styles.cardValue}>Acabamento: {formatNumber(parsedData.tempo_espera_filas.acabamento)} min</Text>
              <Text style={styles.cardValue}>Flamagem: {formatNumber(parsedData.tempo_espera_filas.flamagem)} min</Text>
              <Text style={styles.cardValue}>Colagem: {formatNumber(parsedData.tempo_espera_filas.colagem)} min</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tamanho das filas:</Text>
              <Text style={styles.cardValue}>Acabamento: {formatNumber(parsedData.tamanho_fila.acabamento)} peças</Text>
              <Text style={styles.cardValue}>Flamagem: {formatNumber(parsedData.tamanho_fila.flamagem)} peças</Text>
              <Text style={styles.cardValue}>Colagem: {formatNumber(parsedData.tamanho_fila.colagem)} peças</Text>
            </View>           
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
