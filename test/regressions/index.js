import vrtest from 'vrtest/client';
import { render } from 'lit-html';

// Get all the tests specifically written for preventing regressions.
const requireSuite = require.context('./tests', true, /js$/);
const tests = requireSuite.keys().reduce((res, path) => {
  const [suite, name] = path
    .replace('./', '')
    .replace('.js', '')
    .split('/');
  res.push({
    path,
    suite: `regression-${suite}`,
    name,
    case: requireSuite(path).default
  });
  return res;
}, []);

const rootEl = document.createElement('div');
rootEl.style.display = 'inline-block';

vrtest.before(() => {
  if (document && document.body) {
    document.body.appendChild(rootEl);
  }
});

let suite;

tests.forEach(test => {
  if (!suite || suite.name !== test.suite) {
    suite = vrtest.createSuite(test.suite);
  }

  suite.createTest(test.name, () => {
    render(test.case, rootEl);
  });
});
