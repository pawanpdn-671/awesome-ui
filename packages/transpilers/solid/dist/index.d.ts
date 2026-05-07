import { IComponentIR } from '@awesomeui/core';
import { BaseTranspiler, ITranspileOptions } from '@awesomeui/transpiler-shared';

declare class SolidTranspiler extends BaseTranspiler {
    readonly framework = "solid";
    readonly fileExtension = ".tsx";
    readonly language = "typescript";
    protected generate(ir: IComponentIR, _options: Required<ITranspileOptions>): string;
    private generateImports;
    private generateStylesObject;
    private generatePropsInterface;
    private eventToSolid;
    private propToSolidType;
    private generateComponent;
    private generatePropsDestructure;
    private generateJSX;
    private generateElement;
    private generateText;
    private generateSlot;
    private generateConditional;
    private generateLoop;
    private generateComponentRef;
    private buildSolidAttributes;
    private buildSolidClassBinding;
    private attrToSolid;
    private convertExprToSolid;
}

export { SolidTranspiler };
