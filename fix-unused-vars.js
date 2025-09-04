const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const extensions = ['.ts', '.tsx', '.js', '.jsx'];

function renameUnusedVarsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Renommer les arguments 'request' et 'error' en '_request' et '_error' dans les définitions de fonctions (simple regex)
  content = content.replace(/function\s+(\w+)\s*\(([^)]*)\)/g, (match, fname, params) => {
    const newParams = params
      .split(',')
      .map(p => {
        p = p.trim();
        if (p === 'request') return '_request';
        if (p === 'error') return '_error';
        return p;
      })
      .join(', ');
    return `function ${fname}(${newParams})`;
  });

  // Modifier aussi les fonctions fléchées (ex: (request) => {...})
  content = content.replace(/\(([^)]*)\)\s*=>/g, (match, params) => {
    const newParams = params
      .split(',')
      .map(p => {
        p = p.trim();
        if (p === 'request') return '_request';
        if (p === 'error') return '_error';
        return p;
      })
      .join(', ');
    return `(${newParams}) =>`;
  });

  // Renommer les variables dans les blocs catch (catch(error) -> catch(_error))
  content = content.replace(/catch\s*\(\s*error\s*\)/g, 'catch (_error)');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fichier modifié : ${filePath}`);
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      traverseDir(fullPath);
    } else if (extensions.includes(path.extname(file))) {
      renameUnusedVarsInFile(fullPath);
    }
  }
}

traverseDir(srcDir);
console.log('Renommage des variables inutilisées terminé.');
