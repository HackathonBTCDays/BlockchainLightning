interface CertificateData {
/**
 * const certificateData = {
  id: '#A1B2C3D4E5F6',
  issuedDate: '15 mars 2024, 10:30',
  hash: '1234...7890',
  txid: '0xabcdef...123456',
  qrValue: 'https://example.com/verify/A1B2C3D4E5F6',
};
 */
  id: string;
  userId: string;
  documentHash: string;
  certificateType: string;
  createdAt: string;
  updatedAt: string;
  qrValue: string;
  certificateId: string;
  blockchainAnchor: {
    blockNumber: number;
    transactionIndex: number;
    transactionHash: string;
    txId: string;
    network: string;
    timestamp: string;
    };

}
export default CertificateData;