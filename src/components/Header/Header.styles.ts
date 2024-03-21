import { StyleSheet } from 'react-native';

export default StyleSheet.create( {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 16
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    borderWidth: 1.5,
    borderColor: '#FFF',
    overflow: 'hidden',
  },
} );
