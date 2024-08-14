// utils/styles.ts
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 40,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    height: 50,
  },
  tagButton: {
    borderRadius: 20,
    marginHorizontal: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagButtonText: {
    fontSize: 16,
  },
  tagButtonLogo: {
    width: 40,
    height: 40,
    position: 'absolute',
    borderRadius: 20,
  },
  selectedTagButton: {
    backgroundColor: '#007bff',
  },
  selectedTagButtonText: {
    color: '#fff',
  },
  jobContainer: {
    paddingBottom: 40,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
  },
  listContent: {
    fontSize: 12,
    marginBottom: 4,
    marginTop: 4,
    paddingBottom: 16,
  },
  companyLogo: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 20,
    right: 16,
    borderRadius: 20,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
  },
  scrollContainer: {
    padding: 16,
  },
  resultsContainer: {
    marginTop: 16,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noResultsContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    marginTop: 40,
    fontSize: 16,
    color: 'grey',
  },
  starButton: {
    position: 'absolute',
    bottom: 16,
    left: 12,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  listContainer: {
    marginTop: 20,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  logInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
  },
  logInLogo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
