import { IComponentIR } from '@awesomeui/core';
import { BaseTranspiler, ITranspileOptions } from '@awesomeui/transpiler-shared';

declare class ReactNativeTranspiler extends BaseTranspiler {
    readonly framework = "react-native";
    readonly fileExtension = ".tsx";
    readonly language = "typescript";
    protected generate(ir: IComponentIR, _options: Required<ITranspileOptions>): string;
    private generateImports;
    private generateStyleSheet;
    private flattenStyles;
    private tailwindToRN;
    private fontSizeMap;
    private parseSpacing;
    private parseColor;
    private generatePropsInterface;
    private eventToRN;
    private eventPayload;
    private propToRNType;
    private generateComponent;
    private isTextOnlyComponent;
    private generatePropsDestructure;
    private generateJSX;
    private generateElement;
    private childrenContainText;
    private generateText;
    private generateSlot;
    private generateConditional;
    private generateLoop;
    private generateComponentRef;
    private buildRNAttributes;
    private resolveStyleKeys;
    private classToStyleKey;
    private attrToRN;
    private convertExprToRN;
}

export { ReactNativeTranspiler };
