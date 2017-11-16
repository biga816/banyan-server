export const CONFIG = {
  'MOISTURE': {
    'BORDER': {
      'WARNING': 20,
      'ALERT': 5
    },
    'MAX': 950
  },
  'PATH': {
    'MOISTURE_DATA': './data/moisture-data.json',
    'BANYAN_STATUS': './data/banyan-status.json'
  },
  'BANYAN_STATUS': {
    'NOTHING': 0,
    'WATERED': 10,
    'WARNED': 20,
    'ALERTED': 30,
  },
  'MAIL': {
    'SUBJECT': {
      '10': 'ガジュマル水ゲット！',
      '20': 'ガジュマル水減少中...',
      '30': 'お水が減ってきたなぁ'
    },
    'TEXT': {
      '10': 'お水いっぱい夢いっぱい！！',
      '20': 'お水が減ってきたなぁ',
      '30': 'お水がほしーよー'
    }
  }
};