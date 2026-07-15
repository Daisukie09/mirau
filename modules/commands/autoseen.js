this.config = {
  name: 'autoseen',
  version: '1.0.0',
  hasPermssion: 3,
  credits: 'NT-Khang',
  description: 'Toggle auto seen when new message arrives',
  commandCategory: 'Admin',
  usages: 'on/off',
  cooldowns: 5,
};

this.handleEvent = async o => {
    o.api.markAsReadAll();
};

this.run = async o=> {};
