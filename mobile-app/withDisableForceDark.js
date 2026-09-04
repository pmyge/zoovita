const { withAndroidStyles } = require('@expo/config-plugins');

module.exports = function withDisableForceDark(config) {
  return withAndroidStyles(config, (config) => {
    const styles = config.modResults;
    const appTheme = styles.resources.style.find((style) => style.$.name === 'AppTheme');
    if (appTheme) {
      // Remove any existing forceDarkAllowed item
      appTheme.item = appTheme.item.filter(item => item.$.name !== 'android:forceDarkAllowed');
      // Add forceDarkAllowed = false
      appTheme.item.push({
        _: 'false',
        $: { name: 'android:forceDarkAllowed' },
      });
    }
    return config;
  });
};
