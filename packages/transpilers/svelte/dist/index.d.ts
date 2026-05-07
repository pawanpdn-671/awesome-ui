import { IComponentIR } from '@awesomeui/core';
import { BaseTranspiler, ITranspileOptions } from '@awesomeui/transpiler-shared';

declare class SvelteTranspiler extends BaseTranspiler {
    readonly framework = "svelte";
    readonly fileExtension = ".svelte";
    readonly language = "svelte";
    protected generate(ir: IComponentIR, _options: Required<ITranspileOptions>): string;
    private generateScript;
    private eventToHandler;
    private generateStylesObject;
    private generateTemplate;
    private generateNode;
    private generateElement;
    private generateText;
    private generateSlot;
    private generateConditional;
    private generateLoop;
    private generateComponentRef;
    private buildSvelteAttributes;
    private buildSvelteClassBinding;
    private convertExprToSvelte;
}

export { SvelteTranspiler };
