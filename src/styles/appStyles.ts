import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { sizes } from '../theme/sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: sizes.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: sizes.h2,
    fontWeight: 'bold',
    marginBottom: sizes.base,
    marginTop: sizes.base * 4,
    color: colors.text,
  },
  headerContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: sizes.base,
    marginBottom: sizes.base,
    backgroundColor: colors.background,
  },
  fixedHeaderColumn: {
    width: 120,
    justifyContent: 'center',
    paddingHorizontal: sizes.base / 2,
  },
  scrollableHeaders: {
    flexDirection: 'row',
    marginLeft: 0,
  },
  headerRow: {
    flexDirection: 'row',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: sizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    width: 90,
    paddingHorizontal: sizes.base,
    paddingVertical: sizes.base,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: sizes.base * 1.5,
    minHeight: 60,
    alignItems: 'center',
  },
  row1: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: sizes.base * 1.5,
    minHeight: 60,
    alignItems: 'center',
  },
  fixedColumn: {
    justifyContent: 'center',
    paddingHorizontal: sizes.base,
  },
  tickerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollableColumns: {
    flex: 1,
    flexDirection: 'row',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
  },
  ticker: {
    fontSize: sizes.body,
    color: colors.text,
    fontWeight: '600',
  },
  clickableTicker: {
    textDecorationLine: 'underline',
  },
  dataCell: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    textAlign: 'right',
    width: 90,
    color: colors.text,
  },
  priceCell: {
    color: colors.text,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: sizes.base * 2.5,
    fontSize: sizes.h3,
    color: colors.textMuted,
  },
  flatListContent: {
    paddingBottom: sizes.base * 2.5,
  },
  // Details Page Styles
  detailsPage: {
    flex: 1,
    backgroundColor: colors.background,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: sizes.padding,
    paddingVertical: sizes.base * 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    padding: sizes.base,
    borderRadius: sizes.radius,
    backgroundColor: colors.border,
    minWidth: 80,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.text,
    fontSize: sizes.h3,
    fontWeight: '600',
  },
  detailsTitle: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: sizes.base,
  },
  spacer: {
    width: 80,
  },
  detailsContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
  detailsContentContainer: {
    padding: sizes.padding,
    paddingBottom: sizes.padding * 2,
  },
  detailsSection: {
    marginBottom: sizes.padding,
    backgroundColor: colors.surface,
    padding: sizes.padding,
    borderRadius: sizes.radius,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: sizes.base * 1.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: sizes.h1,
    fontWeight: 'bold',
    color: colors.text,
  },
  rsiValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  rsiDescription: {
    fontSize: sizes.body,
    color: colors.textMuted,
    marginTop: sizes.base,
    fontStyle: 'italic',
  },
  returnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sizes.base * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  returnLabel: {
    fontSize: sizes.h3,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  returnValue: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
  },
  volatilityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.warning,
  },
  symbolValue: {
    fontSize: sizes.h3,
    color: colors.text,
    fontFamily: 'monospace',
    backgroundColor: '#2C2C2C',
    padding: sizes.base * 1.25,
    borderRadius: sizes.radius,
  },
  // Price Range Bar Styles
  priceRangeContainer: {
    marginBottom: sizes.base * 2.5,
  },
  priceRangeTitle: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: sizes.base,
  },
  priceRangeBar: {
    height: 2,
    backgroundColor: '#ccc',
    borderRadius: 1,
  },
  priceRangeIndicator: {
    position: 'absolute',
    width: 4,
    height: 16,
    backgroundColor: 'black',
    transform: [{ translateX: -2 }],
    top: -7,
  },
  priceRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: sizes.base * 2,
  },
  priceRangeLabel: {
    fontSize: sizes.caption,
    color: colors.textMuted,
  },
});