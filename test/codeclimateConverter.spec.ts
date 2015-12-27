'use strict';

const assert = require('power-assert');
import * as sinon from 'sinon';
import * as ts from "typescript";
import {RuleFailure,RuleFailurePosition} from "tslint/lib/language/rule/rule";

import {CodeClimateConverter} from '../src/codeclimateConverter';
import * as CodeClimate from '../src/codeclimateDefinitions';

describe('CodeClimateConverter', () => {
  it('.convert(failure: RuleFailure)', () => {
    let converter = new CodeClimateConverter();
    let sourceFile = sinon.mock({}) as any as ts.SourceFile;
    sourceFile.fileName = '/code/target-source-file.ts';
    sourceFile.getLineAndCharacterOfPosition = (pos: number) => pos === 1 ? { line: 2, character: 30 } : { line: 8, character: 24 };
    let failure = new RuleFailure(sourceFile, 1, 2, 'Style failed', 'style.failure');
    console.log(failure.getFileName);
    let actual = converter.convert(failure);
    assert(actual !== null && actual !== undefined);
    assert(actual.type === 'issue');
    assert(actual.categories.length === 1);
    assert(actual.categories[0] === 'Style');
    assert(actual.check_name === 'style.failure');
    assert(actual.description === 'Style failed');
    let location = actual.location as CodeClimate.PositionLocation;
    let begin = location.positions.begin as CodeClimate.LineColumnPosition ;
    let end = location.positions.end as CodeClimate.LineColumnPosition ;
    assert(location.path === 'target-source-file.ts');
    assert(begin.line === 2);
    assert(begin.column === 30);
    assert(end.line === 8);
    assert(end.column === 24);
  });
});
