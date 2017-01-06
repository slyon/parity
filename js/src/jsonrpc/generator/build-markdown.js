// Copyright 2015, 2016 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import interfaces from '../';

const ROOT_DIR = path.join(__dirname, '../docs');

if (!fs.existsSync(ROOT_DIR)) {
  fs.mkdirSync(ROOT_DIR);
}

// Logging helpers
function info (log) { console.log(chalk.blue(`INFO:\t${log}`)); }
function warn (log) { console.warn(chalk.yellow(`WARN:\t${log}`)); }
function error (log) { console.error(chalk.red(`ERROR:\t${log}`)); }

// "$DUMMY$" pattern to be replaced with { ... } in the markdown docs
const DUMMY = /"\$DUMMY\$"/g;

function formatDescription (obj, prefix = '', indent = '') {
  const optional = obj.optional ? '(optional) ' : '';
  const defaults = obj.default ? `(default: \`${obj.default})\` ` : '';

  return `${indent}- ${prefix}\`${obj.type.name}\` - ${optional}${defaults}${obj.desc}`;
}

function formatType (obj) {
  if (obj.type === Object && obj.details) {
    const sub = Object.keys(obj.details).sort().map((key) => {
      return formatDescription(obj.details[key], `\`${key}\`/`, '    ');
    }).join('\n');

    return `${formatDescription(obj)}\n${sub}`;
  } else if (obj.type && obj.type.name) {
    return formatDescription(obj);
  }

  return obj;
}

const rpcReqTemplate = {
  jsonrpc: '2.0',
  method: 'web3_clientVersion',
  params: [],
  id: 1
};

// Checks if a field definition has an example, or describes an object
// with fields that recursively have examples of their own.
function hasExample ({ example, details }) {
  if (example !== undefined) {
    return true;
  }

  if (details !== undefined) {
    const values = Object.keys(details).map((key) => details[key]);

    return values.every(hasExample);
  }

  return false;
}

// Grabs JSON compatible
function getExample (obj) {
  if (Array.isArray(obj)) {
    return obj.map(getExample);
  }

  const { example, details } = obj;

  if (example === undefined && details !== undefined) {
    const nested = {};

    Object.keys(details).forEach((key) => {
      example[key] = getExample(details[key]);
    });

    return nested;
  }

  return example;
}

function stringifyExample (example, dent = '') {
  const indent = `${dent}  `;

  if (example == null) {
    return JSON.stringify(example);
  }

  if (example.constructor === Array) {
    const last = example.length - 1;
    const elements = example.map((value, index) => {
      const comma = index !== last ? ',' : '';
      const comment = value._comment ? ` # ${value._comment}` : '';

      return `${stringifyExample(value, indent)}${comma}${comment}`;
    });

    return `[\n${indent}${elements.join(`\n${indent}`)}\n${dent}]`;
  }

  if (example.constructor === Object) {
    const keys = Object.keys(example);
    const last = keys.length - 1;
    const elements = keys.map((key, index) => {
      const value = example[key];
      const comma = index !== last ? ',' : '';
      const comment = example[key]._comment ? ` # ${example[key]._comment}` : '';

      return `${JSON.stringify(key)}: ${stringifyExample(value, indent)}${comma}${comment}`;
    });

    return `{\n${indent}${elements.join(`\n${indent}`)}\n${dent}}`;
  }

  return JSON.stringify(example);
}

function buildExample (name, method) {
  // deprecated, don't care
  if (method.deprecated) {
    return '';
  }

  const hasReqExample = method.params.every(hasExample);
  const hasResExample = hasExample(method.returns);

  if (!hasReqExample && !hasResExample) {
    error(`${name} has no examples`);

    return '';
  }

  const examples = [];

  if (hasReqExample) {
    const params = getExample(method.params);
    const req = JSON.stringify(Object.assign({}, rpcReqTemplate, { method: name, params })).replace(DUMMY, '{ ... }');

    examples.push(`# Request\ncurl --data '${req}' -H "Content-Type: application/json" -X POST localhost:8545`);
  } else {
    warn(`${name} has a response example but not a request example`);
  }

  if (hasResExample) {
    const res = stringifyExample(getExample(method.returns), '  ').replace(DUMMY, '{ ... }');
    examples.push(`# Response\n{\n  "id": 1,\n  "jsonrpc": "2.0",\n  "result": ${res}\n}`);
  } else {
    warn(`${name} has a request example but not a response example`);
  }

  return `\n\n#### example\n\n\`\`\`bash\n${examples.join('\n\n')}\n\`\`\``;
}

Object.keys(interfaces).sort().forEach((group) => {
  let preamble = `# The \`${group}\` Module`;
  let markdown = `## JSON RPC methods\n`;

  const spec = interfaces[group];

  if (spec._preamble) {
    preamble = `${preamble}\n\n${spec._preamble}`;
  }

  const content = [];

  Object.keys(spec).sort().forEach((iname) => {
    const method = spec[iname];
    const name = `${group}_${iname}`;

    if (method.nodoc || method.deprecated) {
      info(`Skipping ${name}: ${method.nodoc || 'Deprecated'}`);

      return;
    }

    const desc = method.desc;
    const params = method.params.map(formatType).join('\n');
    const returns = formatType(method.returns);
    const example = buildExample(name, method);

    markdown = `${markdown}\n- [${name}](#${name.toLowerCase()})`;
    content.push(`### ${name}\n\n${desc}\n\n#### parameters\n\n${params || 'none'}\n\n#### returns\n\n${returns || 'none'}${example}`);
  });

  markdown = `${markdown}\n\n## JSON RPC API Reference\n\n${content.join('\n\n***\n\n')}\n\n`;

  const mdFile = path.join(ROOT_DIR, `${group}.md`);

  fs.writeFileSync(mdFile, `${preamble}\n\n${markdown}`, 'utf8');
});
