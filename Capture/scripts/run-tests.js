const { spawnSync } = require('child_process');

const result = spawnSync('npm', ['test'], { stdio: 'inherit' });

if (result.status !== 0) {
  console.error('Tests failed!');
  process.exit(result.status);
}
