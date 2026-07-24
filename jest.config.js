module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!.*(react-native|@react-native|@react-native-community|@react-navigation|lucide-react-native|@supabase|immer|react-redux))'
  ],
};
