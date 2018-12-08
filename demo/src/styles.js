/* @flow */
/* eslint-disable react/prop-types */
import { Platform, StyleSheet } from 'react-native';

const cWhite = '#f9f9f9';
const cLightBlue = '#5bc0de';
const cGreen = '#5cb85c';
const cBlue = '#428bca';

export default StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    flex: 1,
    backgroundColor: cWhite,
  },
  tabs: { flexDirection: 'row' },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cLightBlue,
    borderColor: cBlue,
    borderWidth: 2,
    paddingVertical: 8,
  },
  tabButtonActive: { backgroundColor: cBlue },
  pdfView: { flex: 1 },
  noContent: { flex: 1, alignItems: 'center', backgroundColor: cGreen },
  noContentText: {
    fontSize: 22,
    lineHeight: 36,
    fontWeight: 'bold',
    marginTop: 60,
    textAlign: 'center',
  },
  noContentSubText: {
    fontSize: 16,
    color: cBlue,
    marginTop: 20,
    textAlign: 'center',
  },
  spinnerTextStyle: { color: cWhite },
  floatButtons: {
    position: 'absolute',
    top: 70,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reloadButton: {
    marginVertical: 2,
    padding: 8,
    backgroundColor: cLightBlue,
  },
  horizontalLine: { height: 5, backgroundColor: cBlue }
});
