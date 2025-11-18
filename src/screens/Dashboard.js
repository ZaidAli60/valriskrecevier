import React from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Card, Text, Button, useTheme } from "react-native-paper";

export default function Dashboard() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.secondary }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* ---------- RECEIVER HEADER ---------- */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text style={[styles.title, { color: colors.text }]}>Receiver Receiver</Text>

          <Text style={[styles.label, { marginTop: 4, color: colors.subtext }]}>
            Linked Device:
          </Text>
          <Text style={[styles.value, { color: colors.primary }]}>84HJDJ32</Text>

          <View style={styles.row}>
            <Button
              mode="contained"
              style={[styles.btnPrimary, { backgroundColor: colors.primary }]}
              labelStyle={{ color: colors.secondary }}
            >
              Start Recording
            </Button>

            <Button
              mode="outlined"
              style={[styles.btn, { borderColor: colors.text }]}
              labelStyle={{ color: colors.text }}
            >
              Stop
            </Button>

            <Button
              mode="outlined"
              style={[styles.btn, { borderColor: colors.text }]}
              labelStyle={{ color: colors.text }}
            >
              Recording
            </Button>

            <Button
              mode="outlined"
              style={[styles.btn, { borderColor: colors.text }]}
              labelStyle={{ color: colors.text }}
            >
              Duration ⌄
            </Button>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.grid}>
        {/* ---------- LIVE LOCATION ---------- */}
        <Card style={[styles.card, { backgroundColor: colors.surface, flex: 1 }]}>
          <Card.Content>
            <Text style={[styles.title, { color: colors.text }]}>Live Location</Text>

            <View style={styles.mapBox}>
              <Image
                source={{
                  uri: "https://via.placeholder.com/300x200.png?text=Map+Preview",
                }}
                style={styles.mapImage}
              />
            </View>
          </Card.Content>
        </Card>

        {/* ---------- CLIP LIST ---------- */}
        <Card style={[styles.card, { backgroundColor: colors.surface, flex: 1 }]}>
          <Card.Content>
            <Text style={[styles.title, { color: colors.text }]}>Clip List</Text>

            {/* Filters */}
            <View style={styles.filterRow}>
              <Button
                mode="outlined"
                style={styles.filterBtn}
                labelStyle={{ color: colors.text }}
              >
                Date ⌄
              </Button>

              <Button
                mode="outlined"
                style={styles.filterBtn}
                labelStyle={{ color: colors.text }}
              >
                Camera ⌄
              </Button>
            </View>

            <View style={styles.filterRow}>
              <Button
                mode="outlined"
                style={[styles.filterBtn, { flex: 0.7 }]}
                labelStyle={{ color: colors.text }}
              >
                5 min
              </Button>

              <Button
                mode="outlined"
                style={[styles.filterBtn, { flex: 1 }]}
                labelStyle={{ color: colors.text }}
              >
                framepz
              </Button>

              <Button
                mode="outlined"
                style={[styles.filterBtn, { flex: 0.8 }]}
                labelStyle={{ color: colors.text }}
              >
                SHA-1
              </Button>
            </View>

            {/* Fake Clip List */}
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.clipItem, { color: colors.text }]}>
                rear_2024_11_12_001.mp4{"\n"}
                <Text style={{ color: colors.subtext }}>5 min • 1050p</Text>
              </Text>

              <Text style={[styles.clipItem, { color: colors.text }]}>
                front_2024_11_12_001.mp4{"\n"}
                <Text style={{ color: colors.subtext }}>5 min • 750p</Text>
              </Text>

              <Text style={[styles.clipItem, { color: colors.text }]}>
                rear_2024_11_12_002.mp4{"\n"}
                <Text style={{ color: colors.subtext }}>Uploading…</Text>
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },

  btnPrimary: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  btn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },

  mapBox: {
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
  },

  mapImage: {
    width: "100%",
    height: "100%",
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  filterBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },

  clipItem: {
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 18,
  },
});
