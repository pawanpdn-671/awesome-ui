import { IComponentIR } from '@awesomeui/core';
import { BaseTranspiler, ITranspileOptions } from '@awesomeui/transpiler-shared';

declare class AngularJSTranspiler extends BaseTranspiler {
    readonly framework = "angularjs";
    readonly fileExtension = ".js";
    readonly language = "javascript";
    protected generate(ir: IComponentIR, _options: Required<ITranspileOptions>): string;
    private generateBindings;
    private getBindingType;
    private generateTemplateString;
    private generateNode;
    private generateElement;
    private generateText;
    private generateSlot;
    private generateConditional;
    private generateLoop;
    private generateComponentRef;
    private buildAngularAttributes;
    private buildAngularClassBinding;
    private generateController;
    private convertExpr;
}

export { AngularJSTranspiler };
