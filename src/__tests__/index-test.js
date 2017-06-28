import fs from "fs";
import getSassVarsSync from "../index";
import path from "path";
import pify from "pify"; // eslint-disable-line node/no-unpublished-import
import test from "ava"; // eslint-disable-line node/no-unpublished-import

const fixturesDir = path.join(__dirname, "fixtures");

test("should create JSON object from Sass variables", async t => {
    const expectedFile = await pify(fs.readFile)(
        path.join(fixturesDir, "basic.expected.json")
    );
    const expectedVariables = JSON.parse(await expectedFile.toString());
    const source = await pify(fs.readFile)(
        path.join(fixturesDir, "index.scss")
    );
    const actualVariables = getSassVarsSync(source);

    t.deepEqual(actualVariables, expectedVariables);
});

test("should camelcase Sass variable names and use them as JSON object keys", async t => {
    const expectedFile = await pify(fs.readFile)(
        path.join(fixturesDir, "camelcase.expected.json")
    );
    const expectedVariables = JSON.parse(await expectedFile.toString());
    const source = await pify(fs.readFile)(
        path.join(fixturesDir, "index.scss")
    );
    const actualVariables = getSassVarsSync(source, {
        camelize: true
    });

    t.deepEqual(actualVariables, expectedVariables);
});

test("should use provided Sass options for Sass rendering", async t => {
    const expectedFile = await pify(fs.readFile)(
        path.join(fixturesDir, "sass-options.expected.json")
    );
    const expectedVariables = JSON.parse(await expectedFile.toString());
    const source = await pify(fs.readFile)(
        path.join(fixturesDir, "index.scss")
    );
    const actualVariables = getSassVarsSync(source, {
        sassOptions: {
            precision: 2
        }
    });

    t.deepEqual(actualVariables, expectedVariables);
});
