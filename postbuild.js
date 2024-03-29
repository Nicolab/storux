const {
  exec
} = require('child_process');
const path = require('path');
const pkg = require(path.join(path.resolve(), 'package.json'));

function getBanner() {
  let banner;

  banner = '/*! ' + pkg.name + ' v' + pkg.version + ' | ';

  if (typeof pkg.license === 'string') {
    banner += pkg.license;
  }
  // old package.json
  else if (typeof pkg.license === 'object') {
    banner += pkg.license.type;
  }
  // old package.json
  else if (pkg.licenses && pkg.licenses[0]) {
    banner += pkg.licenses[0].type;
  }

  banner += ' (c) ' + (new Date().getFullYear());

  if (pkg.author && pkg.author.name) {
    banner += ' ' + pkg.author.name;
  }

  if (pkg.homepage) {
    banner += ' - ' + pkg.homepage;
  }

  banner += ' */';

  return banner;
}

function writeBanner(file) {
  exec('echo "' + getBanner() + '\n$(cat ' + file + ')" > ' + file, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }

    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
  });

  exec('head -n 1 ' + file, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }

    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
  });
}

writeBanner('./dist/storux.es.js')
writeBanner('./dist/storux.umd.js')