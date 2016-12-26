import _ from 'lodash';
import camelcaseKeys from 'camelcase-keys';
import jsonFns from 'node-sass-functions-json';
import postcss from 'postcss';
import sass from 'node-sass';
import stripOuter from 'strip-outer';
import syntax from 'postcss-scss';

function prepareSassInput(input) {
    const result = postcss().process(
        input,
        {
            syntax
        }
    )
        .sync();
    const root = result.root;
    const node = postcss.rule({
        selector: '.__sassVars__'
    });

    root.walkDecls(/^\$/, (decl) => {
        if (decl.parent === root) {
            node.append({
                prop: 'content',

                // decl.prop as property is wrapped inside quotes so it doesn’t get transformed with Sass
                // decl.prop as value will be transformed with Sass
                value: `"${decl.prop}" ":" json-encode(${decl.prop})`
            });
        }
    });

    root.append(node);

    return root.toString();
}

function sassRender(input, options) {
    const result = sass.renderSync(
        Object.assign(
            {},
            {
                data: input,
                functions: Object.assign({}, jsonFns)
            },
            options.sassOptions
        )
    );

    return result.css.toString();
}

function exportVariables(input, options) {
    const result = postcss().process(input).sync();
    const root = result.root;
    const data = {};

    root.walkRules('.__sassVars__', (rule) => {
        rule.walkDecls('content', (decl) => {
            const val = decl.value.split(' ":" ');

            data[stripOuter(val[0], '"')] = JSON.parse(stripOuter(val[1], '\''));
        });
    });

    if (options.camelize) {
        return camelcaseKeys(
            _.mapKeys(data, (val, key) => stripOuter(key, '$')),
            {
                recurse: true
            }
        );
    }

    return data;
}

export default function (inputCssStr, options = {}) {
    const prepareString = prepareSassInput(inputCssStr);
    const cssString = sassRender(prepareString, options);

    return exportVariables(cssString, options);
}
