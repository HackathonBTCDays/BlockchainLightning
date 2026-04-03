import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export interface CertificateData {
  id: string;
  name: string;
  issuer: string;
  ownerName?: string;
  birthDate?: string;
  issueDate?: string;
}

interface SelectiveShareModalProps {
  visible: boolean;
  certificate: CertificateData | null;
  onClose: () => void;
}

export const SelectiveShareModal: React.FC<SelectiveShareModalProps> = ({ visible, certificate, onClose }) => {
  const [selectedFields, setSelectedFields] = useState<Set<keyof CertificateData>>(new Set(['id', 'name', 'issuer']));
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (visible && certificate) {
      setShowQR(false);
      // Sélectionner tout par défaut avec Typescript-safe keys
      const allFields = Object.keys(certificate) as Array<keyof CertificateData>;
      setSelectedFields(new Set(allFields));
    }
  }, [visible, certificate]);

  const toggleField = (field: keyof CertificateData) => {
    // Les champs obligatoires cryptographiquement (ID et Nom du diplome) ne peuvent pas être décochés
    if (field === 'id' || field === 'name') return;

    const newSelected = new Set(selectedFields);
    if (newSelected.has(field)) {
      newSelected.delete(field);
    } else {
      newSelected.add(field);
    }
    setSelectedFields(newSelected);
  };

  const getQRData = () => {
    if (!certificate) return '';
    const filteredData: Partial<CertificateData> = {};
    Array.from(selectedFields).forEach(field => {
      filteredData[field] = certificate[field] as any;
    });
    // Payload généré pour e-Signet ou le Verifieur (ZKP simulé)
    return JSON.stringify({ 
        ...filteredData, 
        _proof: "zkp-signature-ok" 
    });
  };

  if (!certificate) return null;

  const fieldsToDisplay: Array<{key: keyof CertificateData, label: string}> = [
    { key: 'name', label: 'Type de document' },
    { key: 'issuer', label: 'Institution' },
    { key: 'ownerName', label: 'Nom du titulaire' },
    { key: 'birthDate', label: 'Date de naissance' },
    { key: 'issueDate', label: 'Date d\'obtention' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Divulgation Sélective</Text>
            <Text style={styles.subtitle}>Décochez les informations à masquer au recruteur.</Text>
          </View>

          {!showQR ? (
            <>
              <ScrollView style={styles.fieldList}>
                {fieldsToDisplay.map((field) => {
                  if (!certificate[field.key]) return null;
                  const isSelected = selectedFields.has(field.key);
                  const isRequired = field.key === 'id' || field.key === 'name';

                  return (
                    <TouchableOpacity 
                      key={field.key} 
                      style={[styles.fieldRow, isRequired && styles.fieldRowDisabled]} 
                      onPress={() => toggleField(field.key)}
                      activeOpacity={isRequired ? 1 : 0.7}
                    >
                      <View style={[styles.checkbox, isSelected && styles.checkboxActive, isRequired && styles.checkboxRequired]}>
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <View>
                        <Text style={styles.fieldLabel}>{field.label}</Text>
                        <Text style={styles.fieldValue}>
                          {isSelected ? certificate[field.key] : '••••••••••••'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              
              <View style={styles.buttonRow}>
                 <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.cancelText}>Fermer</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.validateBtn} onPress={() => setShowQR(true)}>
                    <Text style={styles.validateText}>Générer QR Code</Text>
                 </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.qrContainer}>
               <QRCode 
                 value={getQRData()}
                 size={220}
               />
               <Text style={styles.qrExplanation}>
                 Ce QR Code ne contient QUE les champs cochés. L'intégrité de la blockchain valide le document partiel.
               </Text>
               <TouchableOpacity style={[styles.validateBtn, { width: '100%', marginTop: 20 }]} onPress={onClose}>
                  <Text style={styles.validateText}>Terminer le partage</Text>
               </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: '60%',
    maxHeight: '90%',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  fieldList: {
    flex: 1,
    marginBottom: 20,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fieldRowDisabled: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  checkboxRequired: {
    backgroundColor: '#999',
    borderColor: '#999',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  validateBtn: {
    flex: 1.5,
    paddingVertical: 16,
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  validateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  qrExplanation: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  }
});
