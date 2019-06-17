import React from 'react';
import ReactDOM from 'react-dom';

import App from 'src/App';

require('./assets/fonts/Gotham/styles.css');
require('./assets/fonts/entity-demoGlyphs/styles.css');
require('./index.css');

const rootEl = document.getElementById('root');

ReactDOM.render(<App />, rootEl);