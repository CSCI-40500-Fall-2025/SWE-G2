jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
  );
  
  // Mock Image Picker
  jest.mock('react-native-image-picker', () => ({
    launchImageLibrary: jest.fn(),
    launchCamera: jest.fn(),
  }));
  jest.mock('@sentry/react-native', () => ({
    init: jest.fn(),
    wrap: (Component) => Component, 
    captureException: jest.fn(),
    captureMessage: jest.fn(),
    mobileReplayIntegration: jest.fn(),
    nativeCrash: jest.fn(),
    setUser: jest.fn(),
    setTag: jest.fn(),
    setContext: jest.fn(),
    addBreadcrumb: jest.fn(),
  }));
  // Mock Navigation
  jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
      ...actualNav,
      useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
      }),
      useFocusEffect: jest.fn(),
    };
  });