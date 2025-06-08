import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 10,
    // marginBottom: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#00C853',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    paddingBottom: 10,
    marginBottom: 5,
    backgroundColor: '#121212',
  },
  fixedHeaderColumn: {
    width: 100,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  scrollableHeaders: {
    flexDirection: 'row',
    marginLeft:30
  },
  headerRow: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 70,
    // alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1E1E1E',
    paddingVertical: 14,
    minHeight: 60,
    alignItems: 'center'
  },
  row1: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1E1E1E',
    paddingVertical: 14,
    minHeight: 60,
    alignItems: 'center'
  },
  fixedColumn: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tickerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollableColumns: {
    flex: 1,
    flexDirection: 'row'
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
  },
  ticker: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  clickableTicker: {
    textDecorationLine: 'underline',
  },
  dataCell: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
    width: 70,
    color: '#FFFFFF',
  },
  priceCell: {
    color: '#FFFFFF',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    width: screenWidth * 0.85,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#444',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#2C2C2C',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  inputHelp: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: '#2E2E2E',
    borderWidth: 1,
    borderColor: '#555',
  },
  buttonAdd: {
    backgroundColor: '#00C853',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonAddText: {
    color: '#FFFFFF',
  },
  // Details Page Styles
  detailsPage: {
    flex: 1,
    backgroundColor: '#121212',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1E1E1E',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#333',
    minWidth: 80,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  spacer: {
    width: 80,
  },
  detailsContent: {
    flex: 1,
    backgroundColor: '#121212',
  },
  detailsContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  detailsSection: {
    marginBottom: 30,
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCCCCC',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rsiValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  rsiDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 8,
    fontStyle: 'italic',
  },
  returnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  returnLabel: {
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  returnValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  volatilityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA726',
  },
  symbolValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    backgroundColor: '#2C2C2C',
    padding: 10,
    borderRadius: 6,
  },
  // Price Range Bar Styles
  priceRangeContainer: {
    marginBottom: 20,
  },
  priceRangeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CCCCCC',
    marginBottom: 8,
  },
  priceRangeBar: {
    height: 8,
    backgroundColor: '#444',
    borderRadius: 4,
    justifyContent: 'center',
  },
  priceRangeFill: {
    height: '100%',
    backgroundColor: '#00C853',
    borderRadius: 4,
  },
  priceRangeIndicator: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#00C853',
    transform: [{ translateX: -8 }],
  },
  priceRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceRangeLabel: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  priceRangeCurrent: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: 'bold',
  },
});