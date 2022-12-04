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
      name: '@electron-forge/maker-dmg',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
      config: {},
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-dmg',
  config: {
    format: 'ULFO'
  }
    }
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'ne0rrmatrix',
          name: 'twit-tv-player',
        },
        authToken: process.env.GITHUB_TOKEN,
        draft: process.env.PUBLISHER_GITHUB_DRAFT,
        prerelease: process.env.PUBLISHER_GITHUB_PRERELEASE,
      },
    },
  ],
};
