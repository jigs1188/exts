const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Directories
const SOURCE_DIR = __dirname;
const DIST_DIR = path.join(SOURCE_DIR, 'dist');
const DIST_CHROME = path.join(DIST_DIR, 'chrome');
const DIST_FIREFOX = path.join(DIST_DIR, 'firefox');

// Files and folders to include
const INCLUDE_FILES = [
  'background.js',
  'manifest.json', // Will be customized per browser
  'test.html'
];
const INCLUDE_FOLDERS = [
  'content',
  'icons',
  'ui',
  'utils'
];

// Clean and prepare dist directories
function prepareDirectories() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_CHROME, { recursive: true });
  fs.mkdirSync(DIST_FIREFOX, { recursive: true });
}

// Copy files to target directory
function copyFiles(targetDir, isFirefox) {
  // Copy specific files
  INCLUDE_FILES.forEach(file => {
    if (file === 'manifest.json') return; // Handled separately
    const srcPath = path.join(SOURCE_DIR, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(targetDir, file));
    }
  });

  // Copy folders
  INCLUDE_FOLDERS.forEach(folder => {
    const srcPath = path.join(SOURCE_DIR, folder);
    const destPath = path.join(targetDir, folder);
    if (fs.existsSync(srcPath)) {
      fs.cpSync(srcPath, destPath, { recursive: true });
    }
  });

  // Generate and copy manifest.json
  const manifestPath = path.join(SOURCE_DIR, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  if (isFirefox) {
    // Firefox uses scripts
    manifest.background = {
      scripts: ["background.js"]
    };
  } else {
    // Chrome uses service_worker
    manifest.background = {
      service_worker: "background.js"
    };
  }

  fs.writeFileSync(
    path.join(targetDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
}

// Zip a directory
function zipDirectory(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(archive.pointer() + ' total bytes'));
    archive.on('error', err => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function build() {
  console.log('Preparing build directories...');
  prepareDirectories();

  console.log('Copying files for Chrome...');
  copyFiles(DIST_CHROME, false);

  console.log('Copying files for Firefox...');
  copyFiles(DIST_FIREFOX, true);

  console.log('Zipping Chrome extension...');
  await zipDirectory(DIST_CHROME, path.join(DIST_DIR, 'metaprompt-chrome.zip'));

  console.log('Zipping Firefox extension...');
  await zipDirectory(DIST_FIREFOX, path.join(DIST_DIR, 'metaprompt-firefox.zip'));

  console.log('Build completed successfully! Check the "dist" folder.');
}

build().catch(console.error);
