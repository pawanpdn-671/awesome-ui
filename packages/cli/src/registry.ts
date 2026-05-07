/**
 * @module registry
 * @description Component registry that manages IR component definitions.
 * Components are bundled as JSON within the CLI package, requiring no network.
 *
 * @example
 * ```typescript
 * import { getComponent, listComponents } from './registry.js';
 *
 * const result = getComponent('button');
 * const all = listComponents();
 * ```
 */

import { validateComponentIR, isOk, ok, err, type Result, ValidationError, type IComponentIR } from '@awesomeui/core';

/** Metadata about a registered component (without the full IR) */
export interface IComponentMeta {
  name: string;
  version: string;
  description: string;
  category: string;
}

/**
 * Bundled component IR definitions.
 * In production, these would be loaded from a remote registry.
 * For now, they are defined inline.
 */
const COMPONENT_REGISTRY: Record<string, unknown> = {
  button: {
    name: 'button',
    version: '1.0.0',
    description: 'Versatile button component with variants, sizes, loading state, and icon support',
    category: 'primitive',
    props: {
      variant: {
        type: 'enum',
        values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
        default: 'primary',
        description: 'Visual style variant of the button',
      },
      size: {
        type: 'enum',
        values: ['sm', 'md', 'lg'],
        default: 'md',
        description: 'Size of the button',
      },
      disabled: { type: 'boolean', default: false, description: 'Whether the button is disabled' },
      loading: { type: 'boolean', default: false, description: 'Whether the button is in a loading state' },
      fullWidth: { type: 'boolean', default: false, description: 'Whether the button should take up the full width' },
    },
    slots: {
      default: { description: 'Button label content' },
      icon: { description: 'Optional icon to display before the label' },
      trailingIcon: { description: 'Optional icon to display after the label' },
    },
    events: {
      onClick: { description: 'Fired when the button is clicked' },
      onFocus: { description: 'Fired when the button receives focus' },
      onBlur: { description: 'Fired when the button loses focus' },
    },
    template: {
      tag: 'button',
      attributes: { type: 'button', disabled: '{{props.disabled || props.loading}}' },
      class: '{{styles.base}} {{styles.variant[props.variant]}} {{styles.size[props.size]}} {{props.fullWidth ? styles.fullWidth : \'\'}}',
      children: [
        { if: 'props.loading', then: { tag: 'span', class: '{{styles.spinner}}', attributes: { 'aria-hidden': 'true' } } },
        { slot: 'icon' },
        { tag: 'span', class: '{{styles.label}}', children: [{ slot: 'default', fallback: 'Button' }] },
        { slot: 'trailingIcon' },
      ],
    },
    styles: {
      base: 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variant: {
        primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:ring-gray-400',
        outline: 'border border-gray-300 bg-transparent text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:ring-gray-400',
        ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500',
      },
      size: { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base' },
      fullWidth: 'w-full',
      spinner: 'h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent',
      label: 'truncate',
    },
    accessibility: {
      role: 'button',
      ariaAttributes: { 'aria-disabled': '{{props.disabled}}', 'aria-busy': '{{props.loading}}' },
      keyboardInteractions: ['Enter: Activate the button', 'Space: Activate the button'],
    },
  },
  badge: {
    name: 'badge',
    version: '1.0.0',
    description: 'Small badge component for labels, counts, and status indicators',
    category: 'data-display',
    props: {
      variant: {
        type: 'enum',
        values: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'],
        default: 'default',
        description: 'Visual style variant',
      },
    },
    slots: { default: { description: 'Badge content' } },
    events: {},
    template: {
      tag: 'span',
      class: '{{styles.base}} {{styles.variant[props.variant]}}',
      children: [{ slot: 'default' }],
    },
    styles: {
      base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
      variant: {
        default: 'bg-blue-100 text-blue-800',
        secondary: 'bg-gray-100 text-gray-800',
        destructive: 'bg-red-100 text-red-800',
        outline: 'border border-gray-300 text-gray-700',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
      },
    },
  },
  input: {
    name: 'input',
    version: '1.0.0',
    description: 'Text input field with label, error state, and icon support',
    category: 'form',
    props: {
      type: { type: 'enum', values: ['text', 'email', 'password', 'number', 'tel', 'url'], default: 'text', description: 'Input type' },
      placeholder: { type: 'string', description: 'Placeholder text' },
      disabled: { type: 'boolean', default: false, description: 'Whether the input is disabled' },
      error: { type: 'boolean', default: false, description: 'Whether to show error state' },
      value: { type: 'string', description: 'Current input value' },
    },
    slots: {
      prefix: { description: 'Content before the input (e.g., icon)' },
      suffix: { description: 'Content after the input (e.g., icon)' },
    },
    events: {
      onInput: { description: 'Fired when the input value changes' },
      onFocus: { description: 'Fired when the input receives focus' },
      onBlur: { description: 'Fired when the input loses focus' },
    },
    template: {
      tag: 'div',
      class: '{{styles.wrapper}}',
      children: [
        { slot: 'prefix' },
        {
          tag: 'input',
          attributes: {
            type: '{{props.type}}',
            placeholder: '{{props.placeholder}}',
            disabled: '{{props.disabled}}',
            value: '{{props.value}}',
          },
          class: '{{styles.base}} {{props.error ? styles.error : styles.default}}',
        },
        { slot: 'suffix' },
      ],
    },
    styles: {
      wrapper: 'relative flex items-center',
      base: 'flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      default: 'border-gray-300 bg-white focus-visible:ring-blue-500',
      error: 'border-red-500 bg-white focus-visible:ring-red-500',
    },
    accessibility: {
      role: 'textbox',
      ariaAttributes: { 'aria-invalid': '{{props.error}}', 'aria-disabled': '{{props.disabled}}' },
    },
  },
  card: {
    name: 'card',
    version: '1.0.0',
    description: 'Container card component with header, body, and footer sections',
    category: 'layout',
    props: {
      padding: { type: 'enum', values: ['none', 'sm', 'md', 'lg'], default: 'md', description: 'Padding size for the card body' },
      variant: { type: 'enum', values: ['default', 'outlined', 'elevated', 'ghost'], default: 'default', description: 'Visual style variant of the card' },
    },
    slots: {
      header: { description: 'Card header content' },
      default: { description: 'Card body content' },
      footer: { description: 'Card footer content' },
      image: { description: 'Card image displayed at the top' },
    },
    template: {
      tag: 'div',
      class: '{{styles.base}} {{styles.variant[props.variant]}} {{styles.padding[props.padding]}}',
      children: [
        { slot: 'image' },
        { if: 'hasSlot(\'header\')', then: { tag: 'div', class: '{{styles.header}}', children: [{ slot: 'header' }] } },
        { tag: 'div', class: '{{styles.body}}', children: [{ slot: 'default' }] },
        { if: 'hasSlot(\'footer\')', then: { tag: 'div', class: '{{styles.footer}}', children: [{ slot: 'footer' }] } },
      ],
    },
    styles: {
      base: 'rounded-lg bg-white text-gray-900',
      variant: {
        default: 'border border-gray-200 shadow-sm',
        outlined: 'border-2 border-gray-200',
        elevated: 'border-0 shadow-md hover:shadow-lg transition-shadow',
        ghost: 'border-0',
      },
      padding: { none: '', sm: 'p-3', md: 'p-6', lg: 'p-8' },
      header: 'border-b border-gray-100 pb-4 mb-4',
      body: '',
      footer: 'border-t border-gray-100 pt-4 mt-4',
    },
    accessibility: { role: 'article' },
  },
  alert: {
    name: 'alert',
    version: '1.0.0',
    description: 'Alert banner for displaying feedback messages with variant styles and dismissible support',
    category: 'feedback',
    props: {
      variant: { type: 'enum', values: ['info', 'success', 'warning', 'error'], default: 'info', description: 'Visual style variant of the alert' },
      dismissible: { type: 'boolean', default: false, description: 'Whether the alert can be dismissed' },
      title: { type: 'string', description: 'Optional title text for the alert' },
    },
    slots: {
      default: { description: 'Alert message content' },
      icon: { description: 'Alert icon displayed before the content' },
      action: { description: 'Action element displayed after the content (e.g., button, link)' },
    },
    events: {
      onDismiss: { description: 'Fired when the dismiss button is clicked' },
    },
    template: {
      tag: 'div',
      class: '{{styles.base}} {{styles.variant[props.variant]}}',
      attributes: { role: 'alert' },
      children: [
        { slot: 'icon' },
        {
          tag: 'div', class: '{{styles.content}}', children: [
            { if: 'props.title', then: { tag: 'h5', class: '{{styles.title}}', children: [{ text: '{{props.title}}' }] } },
            { tag: 'div', class: '{{styles.message}}', children: [{ slot: 'default' }] },
          ],
        },
        { slot: 'action' },
        { if: 'props.dismissible', then: { tag: 'button', class: '{{styles.dismissButton}}', attributes: { type: 'button', 'aria-label': 'Dismiss' }, children: [{ text: '\u00d7' }] } },
      ],
    },
    styles: {
      base: 'relative flex w-full items-start gap-3 rounded-lg border p-4 text-sm',
      variant: {
        info: 'border-blue-200 bg-blue-50 text-blue-800',
        success: 'border-green-200 bg-green-50 text-green-800',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
        error: 'border-red-200 bg-red-50 text-red-800',
      },
      content: 'flex-1',
      title: 'mb-1 font-medium',
      message: '',
      dismissButton: '-mx-1 -my-1 ml-auto inline-flex h-6 w-6 items-center justify-center rounded-md text-current opacity-60 hover:opacity-100 transition-opacity',
    },
    accessibility: {
      role: 'alert',
      ariaAttributes: { 'aria-live': 'polite', 'aria-atomic': 'true' },
    },
  },
  avatar: {
    name: 'avatar',
    version: '1.0.0',
    description: 'Avatar component for displaying user profile images with fallback initials and status indicator',
    category: 'data-display',
    props: {
      src: { type: 'string', description: 'Image source URL' },
      alt: { type: 'string', default: '', description: 'Alt text for the avatar image' },
      fallback: { type: 'string', description: 'Fallback text (initials) shown when no image or image fails to load' },
      size: { type: 'enum', values: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md', description: 'Size of the avatar' },
      status: { type: 'enum', values: ['online', 'offline', 'away', 'busy'], description: 'Optional status indicator dot' },
      shape: { type: 'enum', values: ['circle', 'square', 'rounded'], default: 'circle', description: 'Shape of the avatar' },
    },
    template: {
      tag: 'div',
      class: '{{styles.base}} {{styles.size[props.size]}} {{styles.shape[props.shape]}}',
      children: [
        { if: 'props.src', then: { tag: 'img', class: '{{styles.image}} {{styles.shape[props.shape]}}', attributes: { src: '{{props.src}}', alt: '{{props.alt}}', onerror: "this.style.display='none';this.nextElementSibling.style.display='flex'" } } },
        { if: 'props.fallback', then: { tag: 'span', class: '{{styles.fallback}}', children: [{ text: '{{props.fallback}}' }] }, else: { tag: 'span', class: '{{styles.fallback}}', children: [{ text: '?' }] } },
        { if: 'props.status', then: { tag: 'span', class: '{{styles.status}} {{styles.statusDot[props.status]}} {{styles.statusSize[props.size]}}', attributes: { 'aria-label': '{{props.status}}' } } },
      ],
    },
    styles: {
      base: 'relative inline-flex items-center justify-center overflow-hidden bg-gray-100 text-gray-600 font-medium',
      size: { xs: 'h-6 w-6 text-xs', sm: 'h-8 w-8 text-sm', md: 'h-10 w-10 text-base', lg: 'h-12 w-12 text-lg', xl: 'h-16 w-16 text-xl' },
      shape: { circle: 'rounded-full', square: 'rounded-none', rounded: 'rounded-lg' },
      image: 'h-full w-full object-cover',
      fallback: 'flex items-center justify-center',
      status: 'absolute bottom-0 right-0 block rounded-full border-2 border-white',
      statusDot: { online: 'bg-green-500', offline: 'bg-gray-400', away: 'bg-yellow-500', busy: 'bg-red-500' },
      statusSize: { xs: 'h-1.5 w-1.5', sm: 'h-2 w-2', md: 'h-2.5 w-2.5', lg: 'h-3 w-3', xl: 'h-3.5 w-3.5' },
    },
    accessibility: { role: 'img', ariaAttributes: { 'aria-label': '{{props.alt}}' } },
  },
  checkbox: {
    name: 'checkbox',
    version: '1.0.0',
    description: 'Checkbox input component with label, indeterminate state, and error support',
    category: 'form',
    props: {
      checked: { type: 'boolean', default: false, description: 'Whether the checkbox is checked' },
      indeterminate: { type: 'boolean', default: false, description: 'Whether the checkbox is in an indeterminate state' },
      disabled: { type: 'boolean', default: false, description: 'Whether the checkbox is disabled' },
      error: { type: 'boolean', default: false, description: 'Whether to show the error state' },
      required: { type: 'boolean', default: false, description: 'Whether the checkbox is required' },
      name: { type: 'string', description: 'Name attribute for the checkbox input' },
      value: { type: 'string', description: 'Value attribute for the checkbox input' },
    },
    slots: { default: { description: 'Label content displayed next to the checkbox' } },
    events: {
      onChange: { description: 'Fired when the checkbox state changes' },
      onFocus: { description: 'Fired when the checkbox receives focus' },
      onBlur: { description: 'Fired when the checkbox loses focus' },
    },
    template: {
      tag: 'label',
      class: '{{styles.base}} {{props.disabled ? styles.disabled : \'\'}}',
      children: [
        { tag: 'input', attributes: { type: 'checkbox', checked: '{{props.checked}}', disabled: '{{props.disabled}}', required: '{{props.required}}', name: '{{props.name}}', value: '{{props.value}}', 'aria-checked': "{{props.indeterminate ? 'mixed' : props.checked}}" }, class: '{{styles.input}}' },
        {
          tag: 'span', class: '{{styles.checkmark}} {{props.error ? styles.errorState : \'\'}}', children: [
            { if: 'props.indeterminate', then: { tag: 'svg', class: '{{styles.icon}}', attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '3' }, children: [{ tag: 'line', attributes: { x1: '5', y1: '12', x2: '19', y2: '12' } }] }, else: { if: 'props.checked', then: { tag: 'svg', class: '{{styles.icon}}', attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '3' }, children: [{ tag: 'polyline', attributes: { points: '20 6 9 17 4 12' } }] } } },
          ]
        },
        { slot: 'default' },
      ],
    },
    styles: {
      base: 'inline-flex items-center gap-2 cursor-pointer',
      disabled: 'opacity-50 cursor-not-allowed',
      input: 'sr-only peer',
      checkmark: 'flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      icon: 'h-3 w-3 text-white',
      errorState: 'border-red-500',
    },
    accessibility: {
      role: 'checkbox',
      ariaAttributes: { 'aria-checked': "{{props.indeterminate ? 'mixed' : props.checked}}", 'aria-disabled': '{{props.disabled}}', 'aria-required': '{{props.required}}' },
      keyboardInteractions: ['Space: Toggle checkbox state'],
    },
  },
  select: {
    name: 'select',
    version: '1.0.0',
    description: 'Select dropdown component with label, placeholder, error state, and option groups',
    category: 'form',
    props: {
      placeholder: { type: 'string', default: 'Select an option', description: 'Placeholder text shown when no option is selected' },
      disabled: { type: 'boolean', default: false, description: 'Whether the select is disabled' },
      error: { type: 'boolean', default: false, description: 'Whether to show the error state' },
      required: { type: 'boolean', default: false, description: 'Whether the select is required' },
      label: { type: 'string', description: 'Label text displayed above the select' },
      value: { type: 'string', description: 'Current selected value' },
      name: { type: 'string', description: 'Name attribute for the select element' },
    },
    slots: {
      default: { description: 'Option and optgroup elements' },
      prefix: { description: 'Content displayed before the select text' },
    },
    events: {
      onChange: { description: 'Fired when the selected value changes' },
      onFocus: { description: 'Fired when the select receives focus' },
      onBlur: { description: 'Fired when the select loses focus' },
    },
    template: {
      tag: 'div',
      class: '{{styles.wrapper}}',
      children: [
        { if: 'props.label', then: { tag: 'label', class: '{{styles.label}}', children: [{ text: '{{props.label}}' }] } },
        {
          tag: 'div', class: '{{styles.container}}', children: [
            { slot: 'prefix' },
            { tag: 'select', class: '{{styles.base}} {{props.error ? styles.errorState : styles.defaultState}}', attributes: { disabled: '{{props.disabled}}', required: '{{props.required}}', name: '{{props.name}}', value: '{{props.value}}' }, children: [
              { if: 'props.placeholder', then: { tag: 'option', attributes: { value: '', disabled: '', selected: '{{!props.value}}' }, children: [{ text: '{{props.placeholder}}' }] } },
              { slot: 'default' },
            ] },
            { tag: 'svg', class: '{{styles.chevron}}', attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' }, children: [{ tag: 'polyline', attributes: { points: '6 9 12 15 18 9' } }] },
          ]
        },
        { if: 'props.error', then: { tag: 'p', class: '{{styles.errorText}}', children: [{ text: '{{props.errorMessage}}' }] } },
      ],
    },
    styles: {
      wrapper: 'w-full',
      label: 'mb-1.5 block text-sm font-medium text-gray-700',
      container: 'relative flex items-center',
      base: 'flex h-10 w-full appearance-none rounded-md border bg-white px-3 py-2 pr-8 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      defaultState: 'border-gray-300 text-gray-900 focus-visible:ring-blue-500',
      errorState: 'border-red-500 text-gray-900 focus-visible:ring-red-500',
      chevron: 'pointer-events-none absolute right-3 h-4 w-4 text-gray-500',
      errorText: 'mt-1.5 text-sm text-red-600',
    },
    accessibility: {
      role: 'combobox',
      ariaAttributes: { 'aria-disabled': '{{props.disabled}}', 'aria-required': '{{props.required}}', 'aria-invalid': '{{props.error}}' },
      keyboardInteractions: ['Arrow Up/Down: Navigate options', 'Enter: Select option'],
    },
  },
  switch: {
    name: 'switch',
    version: '1.0.0',
    description: 'Toggle switch component with label for binary settings',
    category: 'form',
    props: {
      checked: { type: 'boolean', default: false, description: 'Whether the switch is toggled on' },
      disabled: { type: 'boolean', default: false, description: 'Whether the switch is disabled' },
      required: { type: 'boolean', default: false, description: 'Whether the switch is required' },
      name: { type: 'string', description: 'Name attribute for the hidden input' },
      value: { type: 'string', description: 'Value attribute for the hidden input' },
      label: { type: 'string', description: 'Label displayed next to the switch' },
      labelPosition: { type: 'enum', values: ['left', 'right'], default: 'right', description: 'Position of the label relative to the switch' },
    },
    slots: { default: { description: 'Custom label content' } },
    events: {
      onChange: { description: 'Fired when the switch state changes' },
      onFocus: { description: 'Fired when the switch receives focus' },
      onBlur: { description: 'Fired when the switch loses focus' },
    },
    template: {
      tag: 'label',
      class: '{{styles.base}} {{props.disabled ? styles.disabled : \'\'}}',
      children: [
        { if: "props.label && props.labelPosition === 'left'", then: { tag: 'span', class: '{{styles.label}}', children: [{ text: '{{props.label}}' }] } },
        { slot: 'default' },
        {
          tag: 'div', class: '{{styles.track}} {{props.checked ? styles.trackChecked : styles.trackUnchecked}}', children: [
            { tag: 'input', class: 'sr-only', attributes: { type: 'checkbox', role: 'switch', checked: '{{props.checked}}', disabled: '{{props.disabled}}', required: '{{props.required}}', name: '{{props.name}}', value: '{{props.value}}', 'aria-checked': '{{props.checked}}' } },
            { tag: 'span', class: '{{styles.thumb}} {{props.checked ? styles.thumbChecked : styles.thumbUnchecked}}' },
          ]
        },
        { if: "props.label && props.labelPosition === 'right'", then: { tag: 'span', class: '{{styles.label}}', children: [{ text: '{{props.label}}' }] } },
      ],
    },
    styles: {
      base: 'inline-flex items-center gap-3 cursor-pointer',
      disabled: 'opacity-50 cursor-not-allowed',
      label: 'text-sm font-medium text-gray-700 select-none',
      track: 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
      trackChecked: 'bg-blue-600',
      trackUnchecked: 'bg-gray-200',
      thumb: 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
      thumbChecked: 'translate-x-5',
      thumbUnchecked: 'translate-x-0',
    },
    accessibility: {
      role: 'switch',
      ariaAttributes: { 'aria-checked': '{{props.checked}}', 'aria-disabled': '{{props.disabled}}' },
      keyboardInteractions: ['Space: Toggle switch state'],
    },
  },
  textarea: {
    name: 'textarea',
    version: '1.0.0',
    description: 'Multi-line text input component with label, error state, and character count',
    category: 'form',
    props: {
      placeholder: { type: 'string', description: 'Placeholder text displayed when textarea is empty' },
      disabled: { type: 'boolean', default: false, description: 'Whether the textarea is disabled' },
      error: { type: 'boolean', default: false, description: 'Whether to show the error state' },
      value: { type: 'string', description: 'Current value of the textarea' },
      label: { type: 'string', description: 'Label text displayed above the textarea' },
      required: { type: 'boolean', default: false, description: 'Whether the textarea is required' },
      rows: { type: 'number', default: 4, description: 'Number of visible rows' },
      maxLength: { type: 'number', description: 'Maximum character length' },
      resizable: { type: 'boolean', default: true, description: 'Whether the textarea can be resized by the user' },
    },
    events: {
      onInput: { description: 'Fired when the textarea value changes' },
      onFocus: { description: 'Fired when the textarea receives focus' },
      onBlur: { description: 'Fired when the textarea loses focus' },
    },
    template: {
      tag: 'div',
      class: '{{styles.wrapper}}',
      children: [
        { if: 'props.label', then: { tag: 'label', class: '{{styles.label}}', children: [{ text: '{{props.label}}' }] } },
        { tag: 'textarea', class: '{{styles.base}} {{props.resizable ? styles.resizable : styles.notResizable}} {{props.error ? styles.errorState : styles.defaultState}}', attributes: { placeholder: '{{props.placeholder}}', disabled: '{{props.disabled}}', required: '{{props.required}}', rows: '{{props.rows}}', maxlength: '{{props.maxLength}}', value: '{{props.value}}' } },
        { if: 'props.maxLength', then: { tag: 'div', class: '{{styles.charCount}}', children: [{ text: '{{charCount}} / {{props.maxLength}}' }] } },
        { if: 'props.error', then: { tag: 'p', class: '{{styles.errorText}}', children: [{ text: '{{props.errorMessage}}' }] } },
      ],
    },
    styles: {
      wrapper: 'w-full',
      label: 'mb-1.5 block text-sm font-medium text-gray-700',
      base: 'flex min-h-[60px] w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      defaultState: 'border-gray-300 text-gray-900 focus-visible:ring-blue-500',
      errorState: 'border-red-500 text-gray-900 focus-visible:ring-red-500',
      resizable: 'resize-y',
      notResizable: 'resize-none',
      charCount: 'mt-1.5 text-right text-xs text-gray-500',
      errorText: 'mt-1.5 text-sm text-red-600',
    },
    accessibility: {
      role: 'textbox',
      ariaAttributes: { 'aria-invalid': '{{props.error}}', 'aria-disabled': '{{props.disabled}}', 'aria-required': '{{props.required}}', 'aria-multiline': 'true' },
    },
  },
  skeleton: {
    name: 'skeleton',
    version: '1.0.0',
    description: 'Loading placeholder component that mimics content layout with animated shimmer effect',
    category: 'feedback',
    props: {
      variant: { type: 'enum', values: ['text', 'circular', 'rectangular', 'rounded'], default: 'text', description: 'Shape variant of the skeleton' },
      width: { type: 'string', description: 'Custom width (e.g., \'100%\', \'200px\')' },
      height: { type: 'string', description: 'Custom height (e.g., \'20px\', \'3rem\')' },
      count: { type: 'number', default: 1, description: 'Number of skeleton lines to render' },
      animated: { type: 'boolean', default: true, description: 'Whether to show the shimmer animation' },
      gap: { type: 'string', default: '0.5rem', description: 'Gap between multiple skeleton items' },
    },
    template: {
      tag: 'div',
      class: '{{styles.group}}',
      attributes: { style: "{{count > 1 ? 'display: flex; flex-direction: column; gap: ' + props.gap : ''}}" },
      children: [
        {
          each: 'range(props.count)',
          as: 'i',
          children: [
            { tag: 'div', class: '{{styles.base}} {{styles.variant[props.variant]}} {{props.animated ? styles.animated : \'\'}}', attributes: { style: "{{(props.width ? 'width: ' + props.width : '') + '; ' + (props.height ? 'height: ' + props.height : '')}}" } },
          ],
        },
      ],
    },
    styles: {
      base: 'bg-gray-200',
      variant: {
        text: 'h-4 w-full rounded',
        circular: 'h-10 w-10 rounded-full',
        rectangular: 'h-20 w-full rounded-none',
        rounded: 'h-20 w-full rounded-lg',
      },
      animated: 'animate-pulse',
      group: '',
    },
    accessibility: {
      role: 'status',
      ariaAttributes: { 'aria-label': 'Loading' },
    },
  },
  toast: {
    name: 'toast',
    version: '1.0.0',
    description: 'Toast notification component for showing brief, temporary messages with variant styles and dismissible support',
    category: 'feedback',
    props: {
      variant: { type: 'enum', values: ['default', 'success', 'error', 'warning', 'info'], default: 'default', description: 'Visual style variant' },
      position: { type: 'enum', values: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'], default: 'top-right', description: 'Position on screen' },
      duration: { type: 'number', default: 5000, description: 'Auto-dismiss duration in ms (0 to disable)' },
      dismissible: { type: 'boolean', default: true, description: 'Whether the toast shows a dismiss button' },
      title: { type: 'string', description: 'Optional bold title text' },
    },
    slots: {
      default: { description: 'Toast message content' },
      icon: { description: 'Toast icon displayed before the content' },
      action: { description: 'Action button displayed after the message (e.g., Undo, Retry)' },
    },
    events: {
      onDismiss: { description: 'Fired when the toast is dismissed' },
      onAction: { description: 'Fired when the action button is clicked' },
    },
    template: {
      tag: 'div',
      class: '{{styles.base}} {{styles.variant[props.variant]}} {{styles.position[props.position]}}',
      attributes: { role: 'alert', 'aria-live': 'assertive', 'aria-atomic': 'true' },
      children: [
        { slot: 'icon' },
        { tag: 'div', class: '{{styles.content}}', children: [
          { if: 'props.title', then: { tag: 'p', class: '{{styles.title}}', children: [{ text: '{{props.title}}' }] } },
          { tag: 'div', class: '{{styles.message}}', children: [{ slot: 'default' }] },
        ] },
        { slot: 'action' },
        { if: 'props.dismissible', then: { tag: 'button', class: '{{styles.dismiss}}', attributes: { type: 'button', 'aria-label': 'Dismiss notification' }, children: [{ tag: 'svg', class: 'h-4 w-4', attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, children: [{ tag: 'line', attributes: { x1: '18', y1: '6', x2: '6', y2: '18' } }, { tag: 'line', attributes: { x1: '6', y1: '6', x2: '18', y2: '18' } }] }] } },
      ],
    },
    styles: {
      base: 'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg',
      variant: {
        default: 'border-gray-200 bg-white text-gray-900',
        success: 'border-green-200 bg-green-50 text-green-900',
        error: 'border-red-200 bg-red-50 text-red-900',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
        info: 'border-blue-200 bg-blue-50 text-blue-900',
      },
      position: {
        'top-right': 'fixed top-4 right-4',
        'top-left': 'fixed top-4 left-4',
        'bottom-right': 'fixed bottom-4 right-4',
        'bottom-left': 'fixed bottom-4 left-4',
        'top-center': 'fixed top-4 left-1/2 -translate-x-1/2',
        'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2',
      },
      content: 'flex-1',
      title: 'text-sm font-semibold',
      message: 'text-sm opacity-90',
      dismiss: '-mx-1 -my-1 ml-auto inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md opacity-60 hover:opacity-100 transition-opacity',
    },
    accessibility: {
      role: 'alert',
      ariaAttributes: { 'aria-live': 'assertive', 'aria-atomic': 'true', 'aria-relevant': 'additions removals' },
      keyboardInteractions: ['Escape: Dismiss the toast'],
    },
  },
  table: {
    name: 'table',
    version: '1.0.0',
    description: 'Data table component with sortable columns, loading state, and empty state',
    category: 'data-display',
    props: {
      columns: { type: 'array', default: [], description: 'Column definitions with key, label, and optional sortable flag' },
      rows: { type: 'array', default: [], description: 'Row data array' },
      sortable: { type: 'boolean', default: false, description: 'Whether columns are sortable' },
      striped: { type: 'boolean', default: false, description: 'Whether to show alternating row colors' },
      hoverable: { type: 'boolean', default: true, description: 'Whether rows highlight on hover' },
      compact: { type: 'boolean', default: false, description: 'Whether to use compact padding' },
      loading: { type: 'boolean', default: false, description: 'Whether the table is in a loading state' },
      emptyText: { type: 'string', default: 'No data available', description: 'Text shown when there are no rows' },
    },
    slots: {
      header: { description: 'Custom content above the table (e.g., search, filter controls)' },
      empty: { description: 'Custom content shown when there are no rows' },
      loading: { description: 'Custom loading indicator' },
      footer: { description: 'Custom content below the table (e.g., pagination)' },
    },
    events: {
      onSort: { description: 'Fired when a sortable column header is clicked' },
      onRowClick: { description: 'Fired when a row is clicked' },
    },
    template: {
      tag: 'div',
      class: '{{styles.wrapper}}',
      children: [
        { slot: 'header' },
        { if: 'props.loading', then: { tag: 'div', class: '{{styles.loadingOverlay}}', children: [{ slot: 'loading' }, { tag: 'div', class: '{{styles.spinner}}' }] } },
        { tag: 'div', class: '{{styles.tableWrapper}}', children: [
          { tag: 'table', class: '{{styles.table}}', children: [
            { tag: 'thead', class: '{{styles.thead}}', children: [{ tag: 'tr', children: [
              { each: 'props.columns', as: 'col', key: 'col.key', children: [
                { tag: 'th', class: '{{styles.th}} {{props.sortable && col.sortable ? styles.sortable : \'\'}}', attributes: { scope: 'col', 'aria-sort': '{{col.sortDirection}}' }, children: [
                  { text: '{{col.label}}' },
                  { if: 'props.sortable && col.sortable', then: { tag: 'span', class: '{{styles.sortIcon}}', children: [{ text: "{{col.sortDirection === 'asc' ? ' \\u25B2' : col.sortDirection === 'desc' ? ' \\u25BC' : ' \\u25B4\\u25BE'}}" }] } },
                ] },
              ] },
            ] }] },
            { tag: 'tbody', class: '{{styles.tbody}}', children: [
              { if: 'props.rows.length === 0', then: { tag: 'tr', children: [{ tag: 'td', class: '{{styles.emptyCell}}', attributes: { colspan: '{{props.columns.length}}' }, children: [{ slot: 'empty' }, { text: '{{props.emptyText}}' }] }] } },
              { each: 'props.rows', as: 'row', key: 'row.id', children: [
                { tag: 'tr', class: '{{styles.row}} {{props.striped ? styles.striped : \'\'}} {{props.hoverable ? styles.hoverable : \'\'}}', children: [
                  { each: 'props.columns', as: 'col', key: 'col.key', children: [
                    { tag: 'td', class: '{{styles.td}} {{props.compact ? styles.compact : \'\'}}', children: [{ text: '{{row[col.key]}}' }] },
                  ] },
                ] },
              ] },
            ] },
          ] },
        ] },
        { slot: 'footer' },
      ],
    },
    styles: {
      wrapper: 'w-full',
      loadingOverlay: 'relative',
      spinner: 'absolute inset-0 flex items-center justify-center bg-white/60',
      tableWrapper: 'overflow-x-auto rounded-lg border border-gray-200',
      table: 'min-w-full divide-y divide-gray-200',
      thead: 'bg-gray-50',
      sortable: 'cursor-pointer select-none hover:text-gray-900',
      sortIcon: 'ml-1 text-gray-400',
      tbody: 'divide-y divide-gray-100 bg-white',
      row: '',
      striped: 'even:bg-gray-50',
      hoverable: 'hover:bg-gray-50 cursor-pointer transition-colors',
      th: 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600',
      td: 'whitespace-nowrap px-4 py-3 text-sm text-gray-700',
      compact: 'px-3 py-2',
      emptyCell: 'px-4 py-12 text-center text-sm text-gray-500',
    },
    accessibility: {
      role: 'table',
      ariaAttributes: { 'aria-busy': '{{props.loading}}', 'aria-rowcount': '{{props.rows.length}}', 'aria-colcount': '{{props.columns.length}}' },
      keyboardInteractions: ['Enter/Space: Sort column (when sortable)', 'Enter: Select/click row'],
    },
  },
  accordion: {
    name: 'accordion',
    version: '1.0.0',
    description: 'Accordion component for expandable/collapsible content sections',
    category: 'layout',
    props: {
      type: { type: 'enum', values: ['single', 'multiple'], default: 'single', description: 'Whether one or multiple items can be open at once' },
      defaultValue: { type: 'string', description: 'Value of the initially expanded item (for single mode)' },
      collapsible: { type: 'boolean', default: true, description: 'Whether all items can be collapsed (only in single mode)' },
      variant: { type: 'enum', values: ['default', 'bordered', 'ghost'], default: 'default', description: 'Visual style variant' },
    },
    slots: { default: { description: 'Accordion item components' } },
    events: { onValueChange: { description: 'Fired when the expanded item(s) change' } },
    template: {
      tag: 'div',
      class: '{{styles.base}} {{styles.variant[props.variant]}}',
      attributes: { 'data-orientation': 'vertical' },
      children: [{ slot: 'default' }],
    },
    styles: {
      base: 'w-full divide-y divide-gray-200',
      variant: { default: 'rounded-lg border border-gray-200', bordered: 'border border-gray-200', ghost: 'border-0' },
    },
    accessibility: { role: 'region', ariaAttributes: { 'aria-orientation': 'vertical' } },
  },
  'accordion-item': {
    name: 'accordion-item',
    version: '1.0.0',
    description: 'Individual accordion item with trigger and content sections',
    category: 'layout',
    props: {
      value: { type: 'string', required: true, description: 'Unique value identifying this accordion item' },
      title: { type: 'string', description: 'Trigger title text' },
      disabled: { type: 'boolean', default: false, description: 'Whether the accordion item is disabled' },
    },
    slots: {
      trigger: { description: 'Custom trigger content (replaces title text)' },
      default: { description: 'Collapsible content area' },
    },
    events: {},
    template: {
      tag: 'div',
      class: '{{styles.base}}',
      children: [
        { tag: 'button', class: '{{styles.trigger}} {{props.disabled ? styles.disabled : \'\'}}', attributes: { type: 'button', disabled: '{{props.disabled}}', 'aria-expanded': '{{isOpen}}', 'aria-controls': 'accordion-content-{{props.value}}' }, children: [
          { slot: 'trigger' },
          { if: "!hasSlot('trigger')", then: { tag: 'span', class: '{{styles.titleText}}', children: [{ text: '{{props.title}}' }] } },
          { tag: 'svg', class: '{{styles.chevron}} {{isOpen ? styles.chevronOpen : \'\'}}', attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' }, children: [{ tag: 'polyline', attributes: { points: '6 9 12 15 18 9' } }] },
        ] },
        { tag: 'div', class: '{{styles.content}}', attributes: { id: 'accordion-content-{{props.value}}', role: 'region', 'aria-labelledby': 'accordion-trigger-{{props.value}}' }, children: [
          { tag: 'div', class: '{{styles.contentInner}}', children: [{ slot: 'default' }] },
        ] },
      ],
    },
    styles: {
      base: '',
      trigger: 'flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-left text-gray-900 hover:bg-gray-50 transition-colors',
      disabled: 'opacity-50 cursor-not-allowed hover:bg-transparent',
      titleText: 'flex-1',
      chevron: 'h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200',
      chevronOpen: 'rotate-180',
      content: 'overflow-hidden',
      contentInner: 'px-4 pb-3 pt-0 text-sm text-gray-600',
    },
    accessibility: {
      role: 'region',
      ariaAttributes: { 'aria-labelledby': 'accordion-trigger-{{props.value}}' },
      keyboardInteractions: ['Enter/Space: Toggle accordion item', 'Tab: Move focus between accordion triggers'],
    },
  },
  sidebar: {
    name: 'sidebar',
    version: '1.0.0',
    description: 'Collapsible sidebar navigation component with menu items, icons, and nested submenus',
    category: 'navigation',
    props: {
      collapsed: { type: 'boolean', default: false, description: 'Whether the sidebar is collapsed to icon-only mode' },
      variant: { type: 'enum', values: ['default', 'floating', 'bordered'], default: 'default', description: 'Visual style variant' },
      position: { type: 'enum', values: ['left', 'right'], default: 'left', description: 'Which side the sidebar is on' },
      width: { type: 'string', default: '16rem', description: 'Width of the expanded sidebar' },
      collapsedWidth: { type: 'string', default: '4rem', description: 'Width of the collapsed sidebar' },
    },
    slots: {
      header: { description: 'Content at the top of the sidebar (e.g., logo, brand)' },
      default: { description: 'Navigation menu items' },
      footer: { description: 'Content at the bottom of the sidebar (e.g., user menu, settings)' },
      toggle: { description: 'Custom toggle button for collapsing/expanding' },
    },
    events: { onToggle: { description: 'Fired when the sidebar is toggled between collapsed and expanded' } },
    template: {
      tag: 'aside',
      class: '{{styles.base}} {{styles.variant[props.variant]}} {{styles.position[props.position]}}',
      attributes: { style: 'width: {{props.collapsed ? props.collapsedWidth : props.width}}' },
      children: [
        { slot: 'toggle' },
        { slot: 'header' },
        { tag: 'nav', class: '{{styles.nav}}', children: [{ slot: 'default' }] },
        { slot: 'footer' },
      ],
    },
    styles: {
      base: 'flex h-full flex-col overflow-y-auto bg-white transition-all duration-300',
      variant: { default: 'border-r border-gray-200 shadow-sm', floating: 'm-2 rounded-lg border border-gray-200 shadow-md', bordered: 'border-r border-gray-200' },
      position: { left: '', right: 'border-l border-r-0' },
      nav: 'flex-1 overflow-y-auto py-2',
    },
    accessibility: { role: 'complementary', ariaAttributes: { 'aria-label': 'Sidebar navigation' } },
  },
  loading: {
    name: 'loading',
    version: '1.0.0',
    description: 'Loading state component with spinner, progress bar, and overlay variants for async operations',
    category: 'feedback',
    props: {
      variant: { type: 'enum', values: ['spinner', 'dots', 'pulse', 'progress', 'ring'], default: 'spinner', description: 'Visual style of the loading indicator' },
      size: { type: 'enum', values: ['sm', 'md', 'lg'], default: 'md', description: 'Size of the loading indicator' },
      label: { type: 'string', description: 'Text label displayed below the loading indicator' },
      overlay: { type: 'boolean', default: false, description: 'Whether to show as a full-area overlay' },
      progress: { type: 'number', description: 'Progress value 0-100 (only for progress variant)' },
      color: { type: 'enum', values: ['primary', 'secondary', 'white'], default: 'primary', description: 'Color variant' },
    },
    slots: { default: { description: 'Custom content inside the loading area (replaces default indicator)' } },
    template: {
      tag: 'div',
      class: '{{styles.base}} {{props.overlay ? styles.overlay : \'\'}}',
      attributes: { role: 'status', 'aria-label': "{{props.label || 'Loading'}}" },
      children: [
        { if: 'props.overlay', then: { tag: 'div', class: '{{styles.backdrop}}' } },
        { tag: 'div', class: '{{styles.content}}', children: [
          { slot: 'default' },
          { if: "!hasSlot('default') && props.variant === 'spinner'", then: { tag: 'svg', class: '{{styles.spinner}} {{styles.size[props.size]}} {{styles.color[props.color]}}', attributes: { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, children: [{ tag: 'circle', attributes: { cx: '12', cy: '12', r: '10', stroke: 'currentColor', 'stroke-width': '4', opacity: '0.25' } }, { tag: 'path', attributes: { d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z', fill: 'currentColor', opacity: '0.75' } }] } },
          { if: "!hasSlot('default') && props.variant === 'dots'", then: { tag: 'div', class: '{{styles.dots}} {{styles.size[props.size]}}', children: [{ tag: 'span', class: '{{styles.dot}} {{styles.color[props.color]}}' }, { tag: 'span', class: '{{styles.dot}} {{styles.color[props.color]}}' }, { tag: 'span', class: '{{styles.dot}} {{styles.color[props.color]}}' }] } },
          { if: "!hasSlot('default') && props.variant === 'pulse'", then: { tag: 'div', class: '{{styles.pulse}} {{styles.size[props.size]}} {{styles.color[props.color]}}' } },
          { if: "!hasSlot('default') && props.variant === 'ring'", then: { tag: 'svg', class: '{{styles.ring}} {{styles.size[props.size]}} {{styles.color[props.color]}}', attributes: { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, children: [{ tag: 'circle', attributes: { cx: '12', cy: '12', r: '10', stroke: 'currentColor', 'stroke-width': '2', 'stroke-dasharray': '31.4 31.4', 'stroke-linecap': 'round' } }] } },
          { if: "!hasSlot('default') && props.variant === 'progress'", then: { tag: 'div', class: '{{styles.progressTrack}}', children: [{ tag: 'div', class: '{{styles.progressBar}} {{styles.color[props.color]}}', attributes: { style: 'width: {{props.progress || 0}}%' } }] } },
          { if: 'props.label', then: { tag: 'p', class: '{{styles.label}}', children: [{ text: '{{props.label}}' }] } },
        ] },
      ],
    },
    styles: {
      base: 'flex items-center justify-center',
      overlay: 'fixed inset-0 z-50',
      backdrop: 'absolute inset-0 bg-white/80 backdrop-blur-sm',
      content: 'relative flex flex-col items-center gap-3',
      size: { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' },
      color: { primary: 'text-blue-600', secondary: 'text-gray-500', white: 'text-white' },
      spinner: 'animate-spin',
      dots: 'flex items-center gap-1',
      dot: 'h-2 w-2 rounded-full animate-bounce [&:nth-child(2)]:delay-100 [&:nth-child(3)]:delay-200',
      pulse: 'rounded-full animate-pulse',
      ring: 'animate-spin',
      progressTrack: 'h-2 w-full min-w-[200px] overflow-hidden rounded-full bg-gray-200',
      progressBar: 'h-full rounded-full transition-all duration-500',
      label: 'text-sm text-gray-500',
    },
    accessibility: {
      role: 'status',
      ariaAttributes: { 'aria-live': 'polite', 'aria-busy': 'true', 'aria-label': "{{props.label || 'Loading'}}" },
    },
  },
  menubar: {
    name: 'menubar',
    version: '1.0.0',
    description: 'Horizontal menu bar component with dropdown items, icons, and keyboard navigation',
    category: 'navigation',
    props: {
      items: { type: 'array', default: [], description: 'Array of menu items with label, icon, children for submenus, and optional divider' },
      orientation: { type: 'enum', values: ['horizontal', 'vertical'], default: 'horizontal', description: 'Orientation of the menu bar' },
    },
    slots: {
      default: { description: 'Custom menu items (replaces items prop)' },
      start: { description: 'Content at the start of the menu bar (e.g., logo)' },
      end: { description: 'Content at the end of the menu bar (e.g., actions, profile)' },
    },
    events: { onSelect: { description: 'Fired when a menu item is selected' } },
    template: {
      tag: 'nav',
      class: '{{styles.base}} {{styles.orientation[props.orientation]}}',
      attributes: { role: 'menubar', 'aria-label': 'Menu bar' },
      children: [
        { slot: 'start' },
        { tag: 'div', class: '{{styles.menuList}}', children: [
          { slot: 'default' },
          { each: 'props.items', as: 'item', key: 'item.label', children: [
            { tag: 'div', class: '{{styles.menuItem}}', children: [
              { tag: 'button', class: '{{styles.trigger}}', attributes: { role: 'menuitem', type: 'button', 'aria-haspopup': "{{item.children ? 'true' : 'false'}}", 'aria-expanded': '{{item.open}}' }, children: [
                { text: '{{item.label}}' },
                { if: 'item.children', then: { tag: 'svg', class: '{{styles.chevron}}', attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' }, children: [{ tag: 'polyline', attributes: { points: '6 9 12 15 18 9' } }] } },
              ] },
            ] },
          ] },
        ] },
        { slot: 'end' },
      ],
    },
    styles: {
      base: 'flex items-center bg-white',
      orientation: { horizontal: 'flex-row border-b border-gray-200 px-2 py-1', vertical: 'flex-col border-r border-gray-200 px-1 py-2' },
      menuList: 'flex items-center gap-1',
      menuItem: 'relative',
      trigger: 'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors',
      chevron: 'h-3 w-3 text-gray-500',
    },
    accessibility: {
      role: 'menubar',
      ariaAttributes: { 'aria-label': 'Menu bar', 'aria-orientation': '{{props.orientation}}' },
      keyboardInteractions: ['Arrow Left/Right: Navigate between menu items', 'Arrow Up/Down: Open submenu or navigate submenu items', 'Enter/Space: Activate menu item', 'Escape: Close submenu'],
    },
  },
  dialog: {
    name: 'dialog',
    version: '1.0.0',
    description: 'Modal dialog component with backdrop, title, description, and action buttons',
    category: 'overlay',
    props: {
      open: { type: 'boolean', default: false, description: 'Whether the dialog is open' },
      title: { type: 'string', description: 'Dialog title text' },
      description: { type: 'string', description: 'Optional description text below the title' },
      size: { type: 'enum', values: ['sm', 'md', 'lg', 'xl', 'fullscreen'], default: 'md', description: 'Size of the dialog' },
      closable: { type: 'boolean', default: true, description: 'Whether the dialog can be closed by clicking backdrop or Escape' },
      showCloseButton: { type: 'boolean', default: true, description: 'Whether to show the X close button' },
      centered: { type: 'boolean', default: true, description: 'Whether the dialog is centered on screen' },
    },
    slots: {
      default: { description: 'Dialog body content' },
      header: { description: 'Custom header content (replaces title)' },
      footer: { description: 'Dialog footer with action buttons' },
      trigger: { description: 'Element that opens the dialog on click' },
    },
    events: {
      onOpenChange: { description: 'Fired when the dialog open state changes' },
      onClose: { description: 'Fired when the dialog is closed' },
    },
    template: {
      tag: 'div',
      class: '{{styles.base}}',
      children: [
        { slot: 'trigger' },
        { if: 'props.open', then: { tag: 'div', class: '{{styles.overlay}}', attributes: { role: 'presentation' }, children: [
          { tag: 'div', class: '{{styles.backdrop}}' },
          { tag: 'div', class: '{{styles.positioner}} {{props.centered ? styles.centered : \'\'}}', children: [
            { tag: 'div', class: '{{styles.dialog}} {{styles.size[props.size]}}', attributes: { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'dialog-title', 'aria-describedby': "{{props.description ? 'dialog-description' : undefined}}" }, children: [
              { tag: 'div', class: '{{styles.header}}', children: [
                { slot: 'header' },
                { if: "!hasSlot('header') && props.title", then: { tag: 'h2', class: '{{styles.title}}', attributes: { id: 'dialog-title' }, children: [{ text: '{{props.title}}' }] } },
                { if: "!hasSlot('header') && props.showCloseButton", then: { tag: 'button', class: '{{styles.closeButton}}', attributes: { type: 'button', 'aria-label': 'Close dialog' }, children: [{ tag: 'svg', class: 'h-4 w-4', attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, children: [{ tag: 'line', attributes: { x1: '18', y1: '6', x2: '6', y2: '18' } }, { tag: 'line', attributes: { x1: '6', y1: '6', x2: '18', y2: '18' } }] }] } },
              ] },
              { if: "!hasSlot('header') && props.description", then: { tag: 'div', class: '{{styles.description}}', children: [{ text: '{{props.description}}' }] } },
              { tag: 'div', class: '{{styles.body}}', children: [{ slot: 'default' }] },
              { if: "hasSlot('footer')", then: { tag: 'div', class: '{{styles.footer}}', children: [{ slot: 'footer' }] } },
            ] },
          ] },
        ] } },
      ],
    },
    styles: {
      base: '',
      overlay: 'fixed inset-0 z-50',
      backdrop: 'absolute inset-0 bg-black/50 backdrop-blur-sm',
      positioner: 'fixed inset-0 flex items-start justify-center',
      centered: 'items-center',
      dialog: 'relative z-10 flex flex-col rounded-lg bg-white shadow-xl max-h-[85vh]',
      size: { sm: 'w-full max-w-sm', md: 'w-full max-w-md', lg: 'w-full max-w-lg', xl: 'w-full max-w-xl', fullscreen: 'w-full max-w-full mx-4' },
      header: 'flex items-center justify-between border-b border-gray-100 px-6 py-4',
      title: 'text-lg font-semibold text-gray-900',
      closeButton: 'inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors',
      description: 'px-6 pt-2 text-sm text-gray-500',
      body: 'flex-1 overflow-y-auto px-6 py-4 text-sm text-gray-700',
      footer: 'flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4',
    },
    accessibility: {
      role: 'dialog',
      ariaAttributes: { 'aria-modal': 'true', 'aria-labelledby': 'dialog-title', 'aria-describedby': "{{props.description ? 'dialog-description' : undefined}}" },
      keyboardInteractions: ['Escape: Close the dialog', 'Tab: Move focus through dialog elements', 'Shift+Tab: Move focus backward'],
    },
  },
  tabs: {
    name: 'tabs',
    version: '1.0.0',
    description: 'Tabbed interface component with horizontal and vertical orientations',
    category: 'navigation',
    props: {
      defaultValue: { type: 'string', description: 'Value of the initially selected tab' },
      orientation: { type: 'enum', values: ['horizontal', 'vertical'], default: 'horizontal', description: 'Orientation of the tabs' },
      variant: { type: 'enum', values: ['underline', 'pills', 'enclosed', 'ghost'], default: 'underline', description: 'Visual style variant' },
      activationMode: { type: 'enum', values: ['auto', 'manual'], default: 'auto', description: 'Whether tab activates on focus or on click' },
    },
    slots: {
      default: { description: 'Tab list and tab panel components' },
      extra: { description: 'Extra content displayed alongside the tab list (e.g., actions button)' },
    },
    events: { onValueChange: { description: 'Fired when the selected tab changes' } },
    template: {
      tag: 'div',
      class: '{{styles.base}} {{styles.orientation[props.orientation]}}',
      children: [
        { tag: 'div', class: '{{styles.tabList}}', attributes: { role: 'tablist', 'aria-orientation': '{{props.orientation}}' }, children: [{ slot: 'default' }] },
        { slot: 'extra' },
      ],
    },
    styles: {
      base: 'w-full',
      orientation: { horizontal: '', vertical: 'flex gap-4' },
      tabList: 'flex',
    },
    accessibility: { role: 'region', ariaAttributes: { 'aria-label': 'Tabs' } },
  },
  tab: {
    name: 'tab',
    version: '1.0.0',
    description: 'Individual tab trigger and panel pair for the tabs component',
    category: 'navigation',
    props: {
      value: { type: 'string', required: true, description: 'Unique value identifying this tab' },
      label: { type: 'string', description: 'Display text for the tab trigger' },
      disabled: { type: 'boolean', default: false, description: 'Whether the tab is disabled' },
    },
    slots: {
      trigger: { description: 'Custom trigger content (replaces label)' },
      default: { description: 'Tab panel content' },
    },
    events: {},
    template: {
      tag: 'div',
      class: '{{styles.base}}',
      children: [
        { tag: 'button', class: '{{styles.trigger}} {{isActive ? styles.active : styles.inactive}} {{props.disabled ? styles.disabled : \'\'}}', attributes: { role: 'tab', type: 'button', 'aria-selected': '{{isActive}}', 'aria-controls': 'tabpanel-{{props.value}}', disabled: '{{props.disabled}}', tabindex: "{{isActive ? '0' : '-1'}}" }, children: [
          { slot: 'trigger' },
          { if: "!hasSlot('trigger')", then: { text: '{{props.label}}' } },
        ] },
        { if: 'isActive', then: { tag: 'div', class: '{{styles.panel}}', attributes: { id: 'tabpanel-{{props.value}}', role: 'tabpanel', 'aria-labelledby': 'tab-{{props.value}}', tabindex: '0' }, children: [{ slot: 'default' }] } },
      ],
    },
    styles: {
      base: '',
      trigger: 'inline-flex items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
      active: 'text-blue-600 border-b-2 border-blue-600',
      inactive: 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent',
      disabled: 'pointer-events-none opacity-50',
      panel: 'mt-2 rounded-lg p-4 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
    },
    accessibility: {
      role: 'tab',
      ariaAttributes: { 'aria-selected': '{{isActive}}', 'aria-controls': 'tabpanel-{{props.value}}' },
      keyboardInteractions: ['Arrow Left/Right: Navigate between tabs', 'Home: Go to first tab', 'End: Go to last tab', 'Enter/Space: Activate tab'],
    },
  },
  tooltip: {
    name: 'tooltip',
    version: '1.0.0',
    description: 'Tooltip component that shows contextual information on hover, focus, or click',
    category: 'overlay',
    props: {
      content: { type: 'string', description: 'Tooltip text content' },
      side: { type: 'enum', values: ['top', 'bottom', 'left', 'right'], default: 'top', description: 'Which side the tooltip appears on' },
      align: { type: 'enum', values: ['start', 'center', 'end'], default: 'center', description: 'Alignment of the tooltip relative to the trigger' },
      delay: { type: 'number', default: 300, description: 'Delay in ms before showing the tooltip' },
      closeDelay: { type: 'number', default: 100, description: 'Delay in ms before hiding the tooltip' },
      maxWidth: { type: 'string', default: '14rem', description: 'Maximum width of the tooltip' },
    },
    slots: {
      default: { description: 'Trigger element that the tooltip wraps around' },
      content: { description: 'Custom content inside the tooltip (replaces content prop)' },
    },
    events: { onOpenChange: { description: 'Fired when the tooltip visibility changes' } },
    template: {
      tag: 'div',
      class: '{{styles.base}}',
      attributes: { 'data-side': '{{props.side}}', 'data-align': '{{props.align}}' },
      children: [
        { tag: 'div', class: '{{styles.triggerWrapper}}', attributes: { 'aria-describedby': 'tooltip-content', tabindex: '0' }, children: [{ slot: 'default' }] },
        { tag: 'div', class: '{{styles.tooltip}} {{styles.side[props.side]}} {{styles.align[props.align]}}', attributes: { id: 'tooltip-content', role: 'tooltip', style: 'max-width: {{props.maxWidth}}' }, children: [
          { slot: 'content' },
          { if: "!hasSlot('content')", then: { text: '{{props.content}}' } },
          { tag: 'div', class: '{{styles.arrow}}' },
        ] },
      ],
    },
    styles: {
      base: 'relative inline-flex',
      triggerWrapper: 'inline-flex',
      tooltip: 'absolute z-50 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-sm',
      side: {
        top: 'bottom-full left-1/2 mb-2',
        bottom: 'top-full left-1/2 mt-2',
        left: 'right-full top-1/2 mr-2',
        right: 'left-full top-1/2 ml-2',
      },
      align: { start: '', center: '-translate-x-1/2', end: '' },
      arrow: 'absolute w-2 h-2 bg-gray-900 rotate-45',
    },
    accessibility: {
      role: 'tooltip',
      ariaAttributes: { 'aria-describedby': 'tooltip-content' },
      keyboardInteractions: ['Tab: Focus trigger element to show tooltip', 'Escape: Hide tooltip'],
    },
  },
  progress: {
    name: 'progress',
    version: '1.0.0',
    description: 'Progress bar component for tracking completion, loading, or step progress',
    category: 'feedback',
    props: {
      value: { type: 'number', default: 0, description: 'Current progress value' },
      max: { type: 'number', default: 100, description: 'Maximum progress value' },
      variant: { type: 'enum', values: ['bar', 'circle', 'steps'], default: 'bar', description: 'Visual style variant' },
      color: { type: 'enum', values: ['primary', 'success', 'warning', 'error', 'info'], default: 'primary', description: 'Color variant' },
      size: { type: 'enum', values: ['sm', 'md', 'lg'], default: 'md', description: 'Size/thickness of the progress bar' },
      showLabel: { type: 'boolean', default: true, description: 'Whether to show the percentage label' },
      animated: { type: 'boolean', default: true, description: 'Whether the bar has a smooth animation' },
      indeterminate: { type: 'boolean', default: false, description: 'Whether the progress is in indeterminate (unknown) state' },
      steps: { type: 'number', default: 3, description: 'Number of steps for the steps variant' },
      stepLabels: { type: 'array', default: [], description: 'Labels for each step in the steps variant' },
    },
    slots: { default: { description: 'Custom label content (replaces percentage text)' } },
    template: {
      tag: 'div',
      class: '{{styles.wrapper}}',
      children: [
        { if: "props.variant === 'bar'", then: { tag: 'div', class: '{{styles.base}} {{styles.size[props.size]}}', attributes: { role: 'progressbar', 'aria-valuenow': '{{props.indeterminate ? undefined : props.value}}', 'aria-valuemin': '0', 'aria-valuemax': '{{props.max}}' }, children: [
          { tag: 'div', class: '{{styles.bar}} {{styles.color[props.color]}} {{props.animated ? styles.animated : \'\'}} {{props.indeterminate ? styles.indeterminate : \'\'}}', attributes: { style: "{{props.indeterminate ? '100%' : (props.value / props.max * 100) + '%'}}" } },
        ] } },
        { if: "props.variant === 'circle'", then: { tag: 'div', class: '{{styles.circleWrapper}}', attributes: { role: 'progressbar', 'aria-valuenow': '{{props.value}}', 'aria-valuemin': '0', 'aria-valuemax': '{{props.max}}' }, children: [
          { tag: 'svg', class: '{{styles.circleSvg}} {{styles.size[props.size]}}', attributes: { viewBox: '0 0 36 36' }, children: [
            { tag: 'path', class: '{{styles.circleTrack}}', attributes: { d: 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831', fill: 'none', 'stroke-width': '3' } },
            { tag: 'path', class: '{{styles.circleBar}} {{styles.color[props.color]}}', attributes: { d: 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831', fill: 'none', 'stroke-width': '3', 'stroke-dasharray': '{{props.value / props.max * 100}}, 100' } },
          ] },
        ] } },
        { if: "props.variant === 'steps'", then: { tag: 'div', class: '{{styles.stepsWrapper}}', children: [
          { each: 'range(props.steps)', as: 'step', key: 'step', children: [
            { tag: 'div', class: '{{styles.step}} {{step < props.value / (props.max / props.steps) ? styles.stepActive : styles.stepInactive}}', children: [
              { tag: 'div', class: '{{styles.stepIndicator}} {{step < props.value / (props.max / props.steps) ? styles.stepIndicatorActive : \'\'}}', children: [{ text: '{{step + 1}}' }] },
              { if: 'props.stepLabels[step]', then: { tag: 'span', class: '{{styles.stepLabel}}', children: [{ text: '{{props.stepLabels[step]}}' }] } },
            ] },
            { if: 'step < props.steps - 1', then: { tag: 'div', class: '{{styles.stepConnector}} {{step < props.value / (props.max / props.steps) ? styles.stepConnectorActive : \'\'}}' } },
          ] },
        ] } },
        { if: 'props.showLabel && props.variant !== \'steps\'', then: { tag: 'span', class: '{{styles.label}}', children: [{ slot: 'default' }, { if: "!hasSlot('default')", then: { text: '{{Math.round(props.value / props.max * 100)}}%' } }] } },
      ],
    },
    styles: {
      wrapper: 'flex items-center gap-3',
      base: 'w-full overflow-hidden rounded-full bg-gray-200',
      size: { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' },
      bar: 'h-full rounded-full transition-all duration-500',
      color: { primary: 'bg-blue-600', success: 'bg-green-600', warning: 'bg-yellow-500', error: 'bg-red-600', info: 'bg-cyan-600' },
      animated: 'transition-all duration-500 ease-in-out',
      indeterminate: 'animate-pulse',
      label: 'text-sm font-medium text-gray-700',
      circleWrapper: 'inline-flex items-center justify-center',
      circleSvg: '',
      circleTrack: 'stroke-gray-200',
      circleBar: 'transition-all duration-500',
      stepsWrapper: 'flex items-center w-full',
      step: 'flex flex-col items-center',
      stepActive: '',
      stepInactive: '',
      stepIndicator: 'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium border-2',
      stepIndicatorActive: 'bg-blue-600 text-white border-blue-600',
      stepLabel: 'mt-1 text-xs text-gray-500',
      stepConnector: 'flex-1 h-0.5 mx-2 bg-gray-200',
      stepConnectorActive: 'bg-blue-600',
    },
    accessibility: {
      role: 'progressbar',
      ariaAttributes: { 'aria-valuenow': '{{props.value}}', 'aria-valuemin': '0', 'aria-valuemax': '{{props.max}}', 'aria-label': "{{props.label || 'Progress'}}" },
    },
  },
  pagination: {
    name: 'pagination',
    version: '1.0.0',
    description: 'Pagination component for navigating through pages with page numbers, next/previous, and ellipsis',
    category: 'navigation',
    props: {
      currentPage: { type: 'number', default: 1, description: 'Current active page number' },
      totalPages: { type: 'number', default: 1, description: 'Total number of pages' },
      siblingCount: { type: 'number', default: 1, description: 'Number of sibling pages to show on each side of the current page' },
      boundaryCount: { type: 'number', default: 1, description: 'Number of boundary pages to show at start and end' },
      size: { type: 'enum', values: ['sm', 'md', 'lg'], default: 'md', description: 'Size of pagination buttons' },
      variant: { type: 'enum', values: ['default', 'outlined', 'ghost'], default: 'default', description: 'Visual style variant' },
      showPrevNext: { type: 'boolean', default: true, description: 'Whether to show previous/next buttons' },
      showFirstLast: { type: 'boolean', default: false, description: 'Whether to show first/last page buttons' },
      prevLabel: { type: 'string', default: 'Previous', description: 'Label for the previous button' },
      nextLabel: { type: 'string', default: 'Next', description: 'Label for the next button' },
    },
    slots: { default: { description: 'Custom content between prev/next buttons (replaces page numbers)' } },
    events: { onPageChange: { description: 'Fired when a page is selected' } },
    template: {
      tag: 'nav',
      class: '{{styles.base}}',
      attributes: { role: 'navigation', 'aria-label': 'Pagination' },
      children: [
        { if: 'props.showFirstLast', then: { tag: 'button', class: '{{styles.button}} {{styles.size[props.size]}} {{styles.variant[props.variant]}}', attributes: { type: 'button', disabled: '{{props.currentPage === 1}}', 'aria-label': 'First page' }, children: [{ tag: 'svg', class: 'h-4 w-4', attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' }, children: [{ tag: 'polyline', attributes: { points: '11 17 6 12 11 7' } }, { tag: 'polyline', attributes: { points: '18 17 13 12 18 7' } }] }] } },
        { if: 'props.showPrevNext', then: { tag: 'button', class: '{{styles.button}} {{styles.size[props.size]}} {{styles.variant[props.variant]}}', attributes: { type: 'button', disabled: '{{props.currentPage === 1}}', 'aria-label': 'Go to previous page' }, children: [{ tag: 'svg', class: 'h-4 w-4', attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' }, children: [{ tag: 'polyline', attributes: { points: '15 18 9 12 15 6' } }] }, { text: '{{props.prevLabel}}' }] } },
        { slot: 'default' },
        { if: 'props.showPrevNext', then: { tag: 'button', class: '{{styles.button}} {{styles.size[props.size]}} {{styles.variant[props.variant]}}', attributes: { type: 'button', disabled: '{{props.currentPage === props.totalPages}}', 'aria-label': 'Go to next page' }, children: [{ text: '{{props.nextLabel}}' }, { tag: 'svg', class: 'h-4 w-4', attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' }, children: [{ tag: 'polyline', attributes: { points: '9 18 15 12 9 6' } }] }] } },
        { if: 'props.showFirstLast', then: { tag: 'button', class: '{{styles.button}} {{styles.size[props.size]}} {{styles.variant[props.variant]}}', attributes: { type: 'button', disabled: '{{props.currentPage === props.totalPages}}', 'aria-label': 'Last page' }, children: [{ tag: 'svg', class: 'h-4 w-4', attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' }, children: [{ tag: 'polyline', attributes: { points: '13 17 18 12 13 7' } }, { tag: 'polyline', attributes: { points: '6 17 11 12 6 7' } }] }] } },
      ],
    },
    styles: {
      base: 'flex items-center gap-1',
      button: 'inline-flex items-center gap-1 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      size: { sm: 'h-7 px-2 text-xs', md: 'h-9 px-3 text-sm', lg: 'h-11 px-4 text-base' },
      variant: { default: 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300', outlined: 'bg-transparent text-gray-700 hover:bg-gray-50 border border-gray-300', ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border-0' },
    },
    accessibility: {
      role: 'navigation',
      ariaAttributes: { 'aria-label': 'Pagination' },
      keyboardInteractions: ['Arrow Left: Go to previous page', 'Arrow Right: Go to next page', 'Home: Go to first page', 'End: Go to last page'],
    },
  },
  breadcrumb: {
    name: 'breadcrumb',
    version: '1.0.0',
    description: 'Breadcrumb navigation component showing page hierarchy with links and separators',
    category: 'navigation',
    props: {
      items: { type: 'array', default: [], description: 'Array of breadcrumb items with label, href, and optional icon' },
      separator: { type: 'enum', values: ['slash', 'chevron', 'dot', 'arrow'], default: 'chevron', description: 'Separator style between items' },
      size: { type: 'enum', values: ['sm', 'md', 'lg'], default: 'md', description: 'Size of the breadcrumb text' },
      maxItems: { type: 'number', description: 'Maximum items before collapsing with ellipsis' },
      collapsedLabel: { type: 'string', default: '...', description: 'Label for the collapsed indicator' },
    },
    slots: { default: { description: 'Custom breadcrumb items (replaces items prop)' } },
    events: { onClick: { description: 'Fired when a breadcrumb link is clicked' } },
    template: {
      tag: 'nav',
      class: '{{styles.base}}',
      attributes: { 'aria-label': 'Breadcrumb' },
      children: [
        { tag: 'ol', class: '{{styles.list}} {{styles.size[props.size]}}', children: [
          { slot: 'default' },
          { each: 'props.items', as: 'item', key: 'item.label', children: [
            { if: 'item.index > 0', then: { tag: 'li', class: '{{styles.separatorItem}}', attributes: { 'aria-hidden': 'true' }, children: [{ tag: 'svg', class: '{{styles.separatorIcon}}', attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' }, children: [
              { if: "props.separator === 'chevron' || props.separator === 'arrow'", then: { tag: 'polyline', attributes: { points: '9 18 15 12 9 6' } } },
              { if: "props.separator === 'slash'", then: { tag: 'line', attributes: { x1: '14', y1: '6', x2: '10', y2: '18' } } },
              { if: "props.separator === 'dot'", then: { tag: 'circle', attributes: { cx: '12', cy: '12', r: '2' } } },
            ] }] } },
            { tag: 'li', class: '{{styles.item}} {{item.index === props.items.length - 1 ? styles.current : \'\'}}', attributes: { 'aria-current': "{{item.index === props.items.length - 1 ? 'page' : undefined}}" }, children: [
              { if: 'item.index < props.items.length - 1', then: { tag: 'a', class: '{{styles.link}}', attributes: { href: '{{item.href}}' }, children: [{ text: '{{item.label}}' }] }, else: { tag: 'span', class: '{{styles.currentText}}', children: [{ text: '{{item.label}}' }] } },
            ] },
          ] },
        ] },
      ],
    },
    styles: {
      base: '',
      list: 'flex items-center flex-wrap',
      size: { sm: 'text-xs', md: 'text-sm', lg: 'text-base' },
      item: 'inline-flex items-center',
      separatorItem: 'inline-flex items-center mx-1.5',
      separatorIcon: 'h-3.5 w-3.5 text-gray-400',
      link: 'text-gray-600 hover:text-gray-900 underline-offset-2 hover:underline transition-colors',
      current: '',
      currentText: 'text-gray-900 font-medium',
    },
    accessibility: { role: 'navigation', ariaAttributes: { 'aria-label': 'Breadcrumb' } },
  },
  'dropdown-menu': {
    name: 'dropdown-menu',
    version: '1.0.0',
    description: 'Dropdown menu component with trigger, items, separators, and keyboard navigation',
    category: 'overlay',
    props: {
      label: { type: 'string', default: 'Menu', description: 'Accessible label for the menu' },
      align: { type: 'enum', values: ['start', 'center', 'end'], default: 'start', description: 'Alignment of the dropdown relative to the trigger' },
      side: { type: 'enum', values: ['bottom', 'top', 'left', 'right'], default: 'bottom', description: 'Which side the dropdown appears on' },
      items: { type: 'array', default: [], description: 'Array of menu items with label, icon, shortcut, disabled, and divider properties' },
    },
    slots: {
      trigger: { description: 'Element that opens the dropdown on click' },
      default: { description: 'Custom menu content (replaces items prop)' },
    },
    events: {
      onSelect: { description: 'Fired when a menu item is selected' },
      onOpenChange: { description: 'Fired when the dropdown opens or closes' },
    },
    template: {
      tag: 'div',
      class: '{{styles.base}}',
      children: [
        { tag: 'div', class: '{{styles.triggerWrapper}}', children: [{ slot: 'trigger' }] },
        { tag: 'div', class: '{{styles.menu}} {{styles.side[props.side]}} {{styles.align[props.align]}}', attributes: { role: 'menu', 'aria-label': '{{props.label}}' }, children: [
          { slot: 'default' },
          { each: 'props.items', as: 'item', key: 'item.label', children: [
            { if: 'item.divider', then: { tag: 'div', class: '{{styles.divider}}', attributes: { role: 'separator' } }, else: { tag: 'button', class: '{{styles.item}} {{item.disabled ? styles.disabled : \'\'}}', attributes: { role: 'menuitem', type: 'button', disabled: '{{item.disabled}}', 'aria-disabled': '{{item.disabled}}' }, children: [
              { if: 'item.icon', then: { tag: 'span', class: '{{styles.icon}}', children: [{ text: '{{item.icon}}' }] } },
              { tag: 'span', class: '{{styles.label}}', children: [{ text: '{{item.label}}' }] },
              { if: 'item.shortcut', then: { tag: 'kbd', class: '{{styles.shortcut}}', children: [{ text: '{{item.shortcut}}' }] } },
            ] } },
          ] },
        ] },
      ],
    },
    styles: {
      base: 'relative inline-block',
      triggerWrapper: '',
      menu: 'absolute z-50 min-w-[14rem] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg',
      side: { bottom: 'top-full mt-1', top: 'bottom-full mb-1', left: 'right-full mr-1', right: 'left-full ml-1' },
      align: { start: 'left-0', center: 'left-1/2 -translate-x-1/2', end: 'right-0' },
      item: 'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors',
      disabled: 'pointer-events-none opacity-50',
      icon: 'flex h-4 w-4 items-center justify-center text-gray-500',
      label: 'flex-1 text-left',
      shortcut: 'ml-auto text-xs text-gray-400',
      divider: 'my-1 h-px bg-gray-200',
    },
    accessibility: {
      role: 'menu',
      ariaAttributes: { 'aria-label': '{{props.label}}', 'aria-orientation': 'vertical' },
      keyboardInteractions: ['Arrow Up/Down: Navigate through menu items', 'Enter/Space: Select menu item', 'Escape: Close the menu', 'Tab: Close the menu and move focus'],
    },
  },
};

/**
 * Retrieves a component IR by name, validating it against the schema.
 *
 * @param name - Component name (e.g., "button")
 * @returns Result with the validated IComponentIR or an error
 *
 * @example
 * ```typescript
 * const result = getComponent('button');
 * if (isOk(result)) {
 *   console.log(result.data.name); // 'button'
 * }
 * ```
 */
export function getComponent(name: string): Result<IComponentIR, ValidationError> {
  const raw = COMPONENT_REGISTRY[name];

  if (!raw) {
    return err(
      new ValidationError(`Component "${name}" not found in registry`, [
        { path: 'name', message: `Unknown component: ${name}`, code: 'not_found' },
      ])
    );
  }

  const result = validateComponentIR(raw);
  if (isOk(result)) {
    return ok(result.data);
  }

  return result;
}

/**
 * Lists all available components with their metadata.
 *
 * @returns Array of component metadata
 *
 * @example
 * ```typescript
 * const components = listComponents();
 * // [{ name: 'button', version: '1.0.0', description: '...', category: 'primitive' }, ...]
 * ```
 */
export function listComponents(): IComponentMeta[] {
  return Object.values(COMPONENT_REGISTRY).map((raw) => {
    const data = raw as Record<string, unknown>;
    return {
      name: (data['name'] as string) ?? 'unknown',
      version: (data['version'] as string) ?? '0.0.0',
      description: (data['description'] as string) ?? '',
      category: (data['category'] as string) ?? 'utility',
    };
  });
}
