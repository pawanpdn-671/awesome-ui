import { IComponentIR } from '@awesomeui/core';
import { BaseTranspiler, ITranspileOptions } from '@awesomeui/transpiler-shared';

/**
 * @module vue-transpiler
 * @description Transpiles AwesomeUI IR to Vue 3 Single File Components (SFC).
 * Generates `<script setup lang="ts">` + `<template>` blocks with
 * defineProps, withDefaults, defineEmits, and Vue template directives.
 *
 * @example
 * ```typescript
 * import { VueTranspiler } from '@awesomeui/transpiler-vue';
 * import { isOk } from '@awesomeui/core';
 *
 * const transpiler = new VueTranspiler();
 * const result = transpiler.transpile(buttonIR);
 * if (isOk(result)) {
 *   fs.writeFileSync(result.data.filename, result.data.code);
 * }
 * ```
 */

/**
 * Vue 3 SFC transpiler that converts component IR to `.vue` files.
 *
 * **Generated output includes:**
 * - `<script setup lang="ts">` with defineProps/withDefaults/defineEmits
 * - `<template>` block with Vue directives (v-if, v-for, v-bind)
 * - Styles object for variant-based class composition
 *
 * @example
 * ```typescript
 * const transpiler = new VueTranspiler();
 * const result = transpiler.transpile(buttonIR);
 * ```
 */
declare class VueTranspiler extends BaseTranspiler {
    readonly framework = "vue";
    readonly fileExtension = ".vue";
    readonly language = "vue";
    /**
     * Generates the complete Vue SFC code from validated IR.
     */
    protected generate(ir: IComponentIR, _options: Required<ITranspileOptions>): string;
    /**
     * Generates the `<script setup lang="ts">` block.
     */
    private generateScript;
    /**
     * Generates TypeScript interface for props.
     */
    private generatePropsInterface;
    /**
     * Generates defineProps with withDefaults.
     */
    private generateDefineProps;
    /**
     * Generates defineEmits.
     */
    private generateDefineEmits;
    /**
     * Generates the styles constant object.
     */
    private generateStylesObject;
    /**
     * Generates the `<template>` block.
     */
    private generateTemplate;
    /**
     * Recursively generates Vue template HTML from IR nodes.
     */
    private generateNode;
    /**
     * Generates an HTML element with Vue bindings.
     */
    private generateElement;
    /**
     * Generates Vue text with {{ }} interpolation.
     */
    private generateText;
    /**
     * Generates a Vue slot element.
     */
    private generateSlot;
    /**
     * Generates Vue v-if/v-else conditional.
     */
    private generateConditional;
    /**
     * Generates a node with an additional Vue directive.
     */
    private generateNodeWithDirective;
    /**
     * Generates Vue v-for loop.
     */
    private generateLoop;
    /**
     * Generates a component reference in Vue template.
     */
    private generateComponentRef;
    /**
     * Builds Vue attribute string for an element node.
     */
    private buildVueAttributes;
    /**
     * Builds a Vue class binding from an IR class expression.
     */
    private buildVueClassBinding;
    /**
     * Converts IR expression to Vue-compatible JavaScript.
     * Keeps `props.` prefix since Vue uses `props.X` in templates.
     */
    private convertExprToVue;
    /**
     * Maps an IR prop type to TypeScript type.
     */
    private propToTSType;
}

export { VueTranspiler };
