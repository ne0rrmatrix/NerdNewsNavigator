module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'James Crutchley',
        description: 'Watch Twit TV Podcasts',
      },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
