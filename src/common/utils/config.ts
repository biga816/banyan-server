export const CONFIG = {
  'MOISTURE': {
    'BORDER': {
      'WARNING': 20,
      'ALERT': 5,
      'WARTERD': 10
    },
    'MAX': 950
  },
  'PATH': {
    'MOISTURE_DATA': './data/moisture-data.json',
    'BANYAN_STATUS': './data/banyan-status.json'
  },
  'BANYAN_STATUS': {
    'NOTHING': 0,
    'WARNED': 10,
    'ALERTED': 20,
  },
  'MAIL': {
    'SUBJECT': {
      '10': 'ガジュマル水減少中...',
      '20': 'お水が減ってきたなぁ',
      'WATERED': 'ガジュマル水ゲット！'
    },
    'TEXT': {
      '10': 'お水が減ってきたなぁ',
      '20': 'お水がほしーよー',
      'WATERED': 'お水いっぱい夢いっぱい！！'
    }
  }
};