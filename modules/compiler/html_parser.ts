import { InterpolationConfig, DEFAULT_INTERPOLATION_CONFIG } from './angular_compiler/interpolation';
import { getHtmlTagDefinition } from './angular_compiler/html_tags';
import { tokenize } from './angular_compiler/lexer';
import { TemplateBuilder } from './template_builder/template_builder';

export class HTMLParser {
    constructor() { }

    parse(source: string, urlOrName: string): void {
        const tokensAndErrors = tokenize(source, urlOrName, getHtmlTagDefinition, false, DEFAULT_INTERPOLATION_CONFIG);

        // let builder = new TemplateBuilder(tokensAndErrors.tokens);
        // console.log(builder.build());
    }
}