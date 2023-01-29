#!/usr/bin/env ts-node

import {test} from '../src/Commands';
import {init} from '../src/utils/config';

console.log('cwd::', process.cwd());
init();

//test();
