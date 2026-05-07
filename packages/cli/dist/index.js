#!/usr/bin/env node
import { Command } from 'commander';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { resolve, join } from 'path';
import { execSync } from 'child_process';
import chalk3 from 'chalk';
import ora from 'ora';
import { isOk, ok, err, ValidationError, validateComponentIR } from '@awesomeui/core';
import { ReactTranspiler } from '@awesomeui/transpiler-react';
import { VueTranspiler } from '@awesomeui/transpiler-vue';
import { AngularJSTranspiler } from '@awesomeui/transpiler-angularjs';
import { ReactNativeTranspiler } from '@awesomeui/transpiler-react-native';
import { SvelteTranspiler } from '@awesomeui/transpiler-svelte';
import { SolidTranspiler } from '@awesomeui/transpiler-solid';

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var COMPONENT_REGISTRY = {
  button: {
    name: "button",
    version: "1.0.0",
    description: "Versatile button component with variants, sizes, loading state, and icon support",
    category: "primitive",
    props: {
      variant: {
        type: "enum",
        values: ["primary", "secondary", "outline", "ghost", "destructive"],
        default: "primary",
        description: "Visual style variant of the button"
      },
      size: {
        type: "enum",
        values: ["sm", "md", "lg"],
        default: "md",
        description: "Size of the button"
      },
      disabled: { type: "boolean", default: false, description: "Whether the button is disabled" },
      loading: { type: "boolean", default: false, description: "Whether the button is in a loading state" },
      fullWidth: { type: "boolean", default: false, description: "Whether the button should take up the full width" }
    },
    slots: {
      default: { description: "Button label content" },
      icon: { description: "Optional icon to display before the label" },
      trailingIcon: { description: "Optional icon to display after the label" }
    },
    events: {
      onClick: { description: "Fired when the button is clicked" },
      onFocus: { description: "Fired when the button receives focus" },
      onBlur: { description: "Fired when the button loses focus" }
    },
    template: {
      tag: "button",
      attributes: { type: "button", disabled: "{{props.disabled || props.loading}}" },
      class: "{{styles.base}} {{styles.variant[props.variant]}} {{styles.size[props.size]}} {{props.fullWidth ? styles.fullWidth : ''}}",
      children: [
        { if: "props.loading", then: { tag: "span", class: "{{styles.spinner}}", attributes: { "aria-hidden": "true" } } },
        { slot: "icon" },
        { tag: "span", class: "{{styles.label}}", children: [{ slot: "default", fallback: "Button" }] },
        { slot: "trailingIcon" }
      ]
    },
    styles: {
      base: "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variant: {
        primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-500",
        secondary: "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:ring-gray-400",
        outline: "border border-gray-300 bg-transparent text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:ring-gray-400",
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500"
      },
      size: { sm: "h-8 px-3 text-sm", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" },
      fullWidth: "w-full",
      spinner: "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
      label: "truncate"
    },
    accessibility: {
      role: "button",
      ariaAttributes: { "aria-disabled": "{{props.disabled}}", "aria-busy": "{{props.loading}}" },
      keyboardInteractions: ["Enter: Activate the button", "Space: Activate the button"]
    }
  },
  badge: {
    name: "badge",
    version: "1.0.0",
    description: "Small badge component for labels, counts, and status indicators",
    category: "data-display",
    props: {
      variant: {
        type: "enum",
        values: ["default", "secondary", "destructive", "outline", "success", "warning"],
        default: "default",
        description: "Visual style variant"
      }
    },
    slots: { default: { description: "Badge content" } },
    events: {},
    template: {
      tag: "span",
      class: "{{styles.base}} {{styles.variant[props.variant]}}",
      children: [{ slot: "default" }]
    },
    styles: {
      base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
      variant: {
        default: "bg-blue-100 text-blue-800",
        secondary: "bg-gray-100 text-gray-800",
        destructive: "bg-red-100 text-red-800",
        outline: "border border-gray-300 text-gray-700",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800"
      }
    }
  },
  input: {
    name: "input",
    version: "1.0.0",
    description: "Text input field with label, error state, and icon support",
    category: "form",
    props: {
      type: { type: "enum", values: ["text", "email", "password", "number", "tel", "url"], default: "text", description: "Input type" },
      placeholder: { type: "string", description: "Placeholder text" },
      disabled: { type: "boolean", default: false, description: "Whether the input is disabled" },
      error: { type: "boolean", default: false, description: "Whether to show error state" },
      value: { type: "string", description: "Current input value" }
    },
    slots: {
      prefix: { description: "Content before the input (e.g., icon)" },
      suffix: { description: "Content after the input (e.g., icon)" }
    },
    events: {
      onInput: { description: "Fired when the input value changes" },
      onFocus: { description: "Fired when the input receives focus" },
      onBlur: { description: "Fired when the input loses focus" }
    },
    template: {
      tag: "div",
      class: "{{styles.wrapper}}",
      children: [
        { slot: "prefix" },
        {
          tag: "input",
          attributes: {
            type: "{{props.type}}",
            placeholder: "{{props.placeholder}}",
            disabled: "{{props.disabled}}",
            value: "{{props.value}}"
          },
          class: "{{styles.base}} {{props.error ? styles.error : styles.default}}"
        },
        { slot: "suffix" }
      ]
    },
    styles: {
      wrapper: "relative flex items-center",
      base: "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      default: "border-gray-300 bg-white focus-visible:ring-blue-500",
      error: "border-red-500 bg-white focus-visible:ring-red-500"
    },
    accessibility: {
      role: "textbox",
      ariaAttributes: { "aria-invalid": "{{props.error}}", "aria-disabled": "{{props.disabled}}" }
    }
  },
  card: {
    name: "card",
    version: "1.0.0",
    description: "Container card component with header, body, and footer sections",
    category: "layout",
    props: {
      padding: { type: "enum", values: ["none", "sm", "md", "lg"], default: "md", description: "Padding size for the card body" },
      variant: { type: "enum", values: ["default", "outlined", "elevated", "ghost"], default: "default", description: "Visual style variant of the card" }
    },
    slots: {
      header: { description: "Card header content" },
      default: { description: "Card body content" },
      footer: { description: "Card footer content" },
      image: { description: "Card image displayed at the top" }
    },
    template: {
      tag: "div",
      class: "{{styles.base}} {{styles.variant[props.variant]}} {{styles.padding[props.padding]}}",
      children: [
        { slot: "image" },
        { if: "hasSlot('header')", then: { tag: "div", class: "{{styles.header}}", children: [{ slot: "header" }] } },
        { tag: "div", class: "{{styles.body}}", children: [{ slot: "default" }] },
        { if: "hasSlot('footer')", then: { tag: "div", class: "{{styles.footer}}", children: [{ slot: "footer" }] } }
      ]
    },
    styles: {
      base: "rounded-lg bg-white text-gray-900",
      variant: {
        default: "border border-gray-200 shadow-sm",
        outlined: "border-2 border-gray-200",
        elevated: "border-0 shadow-md hover:shadow-lg transition-shadow",
        ghost: "border-0"
      },
      padding: { none: "", sm: "p-3", md: "p-6", lg: "p-8" },
      header: "border-b border-gray-100 pb-4 mb-4",
      body: "",
      footer: "border-t border-gray-100 pt-4 mt-4"
    },
    accessibility: { role: "article" }
  },
  alert: {
    name: "alert",
    version: "1.0.0",
    description: "Alert banner for displaying feedback messages with variant styles and dismissible support",
    category: "feedback",
    props: {
      variant: { type: "enum", values: ["info", "success", "warning", "error"], default: "info", description: "Visual style variant of the alert" },
      dismissible: { type: "boolean", default: false, description: "Whether the alert can be dismissed" },
      title: { type: "string", description: "Optional title text for the alert" }
    },
    slots: {
      default: { description: "Alert message content" },
      icon: { description: "Alert icon displayed before the content" },
      action: { description: "Action element displayed after the content (e.g., button, link)" }
    },
    events: {
      onDismiss: { description: "Fired when the dismiss button is clicked" }
    },
    template: {
      tag: "div",
      class: "{{styles.base}} {{styles.variant[props.variant]}}",
      attributes: { role: "alert" },
      children: [
        { slot: "icon" },
        {
          tag: "div",
          class: "{{styles.content}}",
          children: [
            { if: "props.title", then: { tag: "h5", class: "{{styles.title}}", children: [{ text: "{{props.title}}" }] } },
            { tag: "div", class: "{{styles.message}}", children: [{ slot: "default" }] }
          ]
        },
        { slot: "action" },
        { if: "props.dismissible", then: { tag: "button", class: "{{styles.dismissButton}}", attributes: { type: "button", "aria-label": "Dismiss" }, children: [{ text: "\xD7" }] } }
      ]
    },
    styles: {
      base: "relative flex w-full items-start gap-3 rounded-lg border p-4 text-sm",
      variant: {
        info: "border-blue-200 bg-blue-50 text-blue-800",
        success: "border-green-200 bg-green-50 text-green-800",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
        error: "border-red-200 bg-red-50 text-red-800"
      },
      content: "flex-1",
      title: "mb-1 font-medium",
      message: "",
      dismissButton: "-mx-1 -my-1 ml-auto inline-flex h-6 w-6 items-center justify-center rounded-md text-current opacity-60 hover:opacity-100 transition-opacity"
    },
    accessibility: {
      role: "alert",
      ariaAttributes: { "aria-live": "polite", "aria-atomic": "true" }
    }
  },
  avatar: {
    name: "avatar",
    version: "1.0.0",
    description: "Avatar component for displaying user profile images with fallback initials and status indicator",
    category: "data-display",
    props: {
      src: { type: "string", description: "Image source URL" },
      alt: { type: "string", default: "", description: "Alt text for the avatar image" },
      fallback: { type: "string", description: "Fallback text (initials) shown when no image or image fails to load" },
      size: { type: "enum", values: ["xs", "sm", "md", "lg", "xl"], default: "md", description: "Size of the avatar" },
      status: { type: "enum", values: ["online", "offline", "away", "busy"], description: "Optional status indicator dot" },
      shape: { type: "enum", values: ["circle", "square", "rounded"], default: "circle", description: "Shape of the avatar" }
    },
    template: {
      tag: "div",
      class: "{{styles.base}} {{styles.size[props.size]}} {{styles.shape[props.shape]}}",
      children: [
        { if: "props.src", then: { tag: "img", class: "{{styles.image}} {{styles.shape[props.shape]}}", attributes: { src: "{{props.src}}", alt: "{{props.alt}}", onerror: "this.style.display='none';this.nextElementSibling.style.display='flex'" } } },
        { if: "props.fallback", then: { tag: "span", class: "{{styles.fallback}}", children: [{ text: "{{props.fallback}}" }] }, else: { tag: "span", class: "{{styles.fallback}}", children: [{ text: "?" }] } },
        { if: "props.status", then: { tag: "span", class: "{{styles.status}} {{styles.statusDot[props.status]}} {{styles.statusSize[props.size]}}", attributes: { "aria-label": "{{props.status}}" } } }
      ]
    },
    styles: {
      base: "relative inline-flex items-center justify-center overflow-hidden bg-gray-100 text-gray-600 font-medium",
      size: { xs: "h-6 w-6 text-xs", sm: "h-8 w-8 text-sm", md: "h-10 w-10 text-base", lg: "h-12 w-12 text-lg", xl: "h-16 w-16 text-xl" },
      shape: { circle: "rounded-full", square: "rounded-none", rounded: "rounded-lg" },
      image: "h-full w-full object-cover",
      fallback: "flex items-center justify-center",
      status: "absolute bottom-0 right-0 block rounded-full border-2 border-white",
      statusDot: { online: "bg-green-500", offline: "bg-gray-400", away: "bg-yellow-500", busy: "bg-red-500" },
      statusSize: { xs: "h-1.5 w-1.5", sm: "h-2 w-2", md: "h-2.5 w-2.5", lg: "h-3 w-3", xl: "h-3.5 w-3.5" }
    },
    accessibility: { role: "img", ariaAttributes: { "aria-label": "{{props.alt}}" } }
  },
  checkbox: {
    name: "checkbox",
    version: "1.0.0",
    description: "Checkbox input component with label, indeterminate state, and error support",
    category: "form",
    props: {
      checked: { type: "boolean", default: false, description: "Whether the checkbox is checked" },
      indeterminate: { type: "boolean", default: false, description: "Whether the checkbox is in an indeterminate state" },
      disabled: { type: "boolean", default: false, description: "Whether the checkbox is disabled" },
      error: { type: "boolean", default: false, description: "Whether to show the error state" },
      required: { type: "boolean", default: false, description: "Whether the checkbox is required" },
      name: { type: "string", description: "Name attribute for the checkbox input" },
      value: { type: "string", description: "Value attribute for the checkbox input" }
    },
    slots: { default: { description: "Label content displayed next to the checkbox" } },
    events: {
      onChange: { description: "Fired when the checkbox state changes" },
      onFocus: { description: "Fired when the checkbox receives focus" },
      onBlur: { description: "Fired when the checkbox loses focus" }
    },
    template: {
      tag: "label",
      class: "{{styles.base}} {{props.disabled ? styles.disabled : ''}}",
      children: [
        { tag: "input", attributes: { type: "checkbox", checked: "{{props.checked}}", disabled: "{{props.disabled}}", required: "{{props.required}}", name: "{{props.name}}", value: "{{props.value}}", "aria-checked": "{{props.indeterminate ? 'mixed' : props.checked}}" }, class: "{{styles.input}}" },
        {
          tag: "span",
          class: "{{styles.checkmark}} {{props.error ? styles.errorState : ''}}",
          children: [
            { if: "props.indeterminate", then: { tag: "svg", class: "{{styles.icon}}", attributes: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "3" }, children: [{ tag: "line", attributes: { x1: "5", y1: "12", x2: "19", y2: "12" } }] }, else: { if: "props.checked", then: { tag: "svg", class: "{{styles.icon}}", attributes: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "3" }, children: [{ tag: "polyline", attributes: { points: "20 6 9 17 4 12" } }] } } }
          ]
        },
        { slot: "default" }
      ]
    },
    styles: {
      base: "inline-flex items-center gap-2 cursor-pointer",
      disabled: "opacity-50 cursor-not-allowed",
      input: "sr-only peer",
      checkmark: "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      icon: "h-3 w-3 text-white",
      errorState: "border-red-500"
    },
    accessibility: {
      role: "checkbox",
      ariaAttributes: { "aria-checked": "{{props.indeterminate ? 'mixed' : props.checked}}", "aria-disabled": "{{props.disabled}}", "aria-required": "{{props.required}}" },
      keyboardInteractions: ["Space: Toggle checkbox state"]
    }
  },
  select: {
    name: "select",
    version: "1.0.0",
    description: "Select dropdown component with label, placeholder, error state, and option groups",
    category: "form",
    props: {
      placeholder: { type: "string", default: "Select an option", description: "Placeholder text shown when no option is selected" },
      disabled: { type: "boolean", default: false, description: "Whether the select is disabled" },
      error: { type: "boolean", default: false, description: "Whether to show the error state" },
      required: { type: "boolean", default: false, description: "Whether the select is required" },
      label: { type: "string", description: "Label text displayed above the select" },
      value: { type: "string", description: "Current selected value" },
      name: { type: "string", description: "Name attribute for the select element" }
    },
    slots: {
      default: { description: "Option and optgroup elements" },
      prefix: { description: "Content displayed before the select text" }
    },
    events: {
      onChange: { description: "Fired when the selected value changes" },
      onFocus: { description: "Fired when the select receives focus" },
      onBlur: { description: "Fired when the select loses focus" }
    },
    template: {
      tag: "div",
      class: "{{styles.wrapper}}",
      children: [
        { if: "props.label", then: { tag: "label", class: "{{styles.label}}", children: [{ text: "{{props.label}}" }] } },
        {
          tag: "div",
          class: "{{styles.container}}",
          children: [
            { slot: "prefix" },
            { tag: "select", class: "{{styles.base}} {{props.error ? styles.errorState : styles.defaultState}}", attributes: { disabled: "{{props.disabled}}", required: "{{props.required}}", name: "{{props.name}}", value: "{{props.value}}" }, children: [
              { if: "props.placeholder", then: { tag: "option", attributes: { value: "", disabled: "", selected: "{{!props.value}}" }, children: [{ text: "{{props.placeholder}}" }] } },
              { slot: "default" }
            ] },
            { tag: "svg", class: "{{styles.chevron}}", attributes: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "aria-hidden": "true" }, children: [{ tag: "polyline", attributes: { points: "6 9 12 15 18 9" } }] }
          ]
        },
        { if: "props.error", then: { tag: "p", class: "{{styles.errorText}}", children: [{ text: "{{props.errorMessage}}" }] } }
      ]
    },
    styles: {
      wrapper: "w-full",
      label: "mb-1.5 block text-sm font-medium text-gray-700",
      container: "relative flex items-center",
      base: "flex h-10 w-full appearance-none rounded-md border bg-white px-3 py-2 pr-8 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      defaultState: "border-gray-300 text-gray-900 focus-visible:ring-blue-500",
      errorState: "border-red-500 text-gray-900 focus-visible:ring-red-500",
      chevron: "pointer-events-none absolute right-3 h-4 w-4 text-gray-500",
      errorText: "mt-1.5 text-sm text-red-600"
    },
    accessibility: {
      role: "combobox",
      ariaAttributes: { "aria-disabled": "{{props.disabled}}", "aria-required": "{{props.required}}", "aria-invalid": "{{props.error}}" },
      keyboardInteractions: ["Arrow Up/Down: Navigate options", "Enter: Select option"]
    }
  },
  switch: {
    name: "switch",
    version: "1.0.0",
    description: "Toggle switch component with label for binary settings",
    category: "form",
    props: {
      checked: { type: "boolean", default: false, description: "Whether the switch is toggled on" },
      disabled: { type: "boolean", default: false, description: "Whether the switch is disabled" },
      required: { type: "boolean", default: false, description: "Whether the switch is required" },
      name: { type: "string", description: "Name attribute for the hidden input" },
      value: { type: "string", description: "Value attribute for the hidden input" },
      label: { type: "string", description: "Label displayed next to the switch" },
      labelPosition: { type: "enum", values: ["left", "right"], default: "right", description: "Position of the label relative to the switch" }
    },
    slots: { default: { description: "Custom label content" } },
    events: {
      onChange: { description: "Fired when the switch state changes" },
      onFocus: { description: "Fired when the switch receives focus" },
      onBlur: { description: "Fired when the switch loses focus" }
    },
    template: {
      tag: "label",
      class: "{{styles.base}} {{props.disabled ? styles.disabled : ''}}",
      children: [
        { if: "props.label && props.labelPosition === 'left'", then: { tag: "span", class: "{{styles.label}}", children: [{ text: "{{props.label}}" }] } },
        { slot: "default" },
        {
          tag: "div",
          class: "{{styles.track}} {{props.checked ? styles.trackChecked : styles.trackUnchecked}}",
          children: [
            { tag: "input", class: "sr-only", attributes: { type: "checkbox", role: "switch", checked: "{{props.checked}}", disabled: "{{props.disabled}}", required: "{{props.required}}", name: "{{props.name}}", value: "{{props.value}}", "aria-checked": "{{props.checked}}" } },
            { tag: "span", class: "{{styles.thumb}} {{props.checked ? styles.thumbChecked : styles.thumbUnchecked}}" }
          ]
        },
        { if: "props.label && props.labelPosition === 'right'", then: { tag: "span", class: "{{styles.label}}", children: [{ text: "{{props.label}}" }] } }
      ]
    },
    styles: {
      base: "inline-flex items-center gap-3 cursor-pointer",
      disabled: "opacity-50 cursor-not-allowed",
      label: "text-sm font-medium text-gray-700 select-none",
      track: "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      trackChecked: "bg-blue-600",
      trackUnchecked: "bg-gray-200",
      thumb: "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
      thumbChecked: "translate-x-5",
      thumbUnchecked: "translate-x-0"
    },
    accessibility: {
      role: "switch",
      ariaAttributes: { "aria-checked": "{{props.checked}}", "aria-disabled": "{{props.disabled}}" },
      keyboardInteractions: ["Space: Toggle switch state"]
    }
  },
  textarea: {
    name: "textarea",
    version: "1.0.0",
    description: "Multi-line text input component with label, error state, and character count",
    category: "form",
    props: {
      placeholder: { type: "string", description: "Placeholder text displayed when textarea is empty" },
      disabled: { type: "boolean", default: false, description: "Whether the textarea is disabled" },
      error: { type: "boolean", default: false, description: "Whether to show the error state" },
      value: { type: "string", description: "Current value of the textarea" },
      label: { type: "string", description: "Label text displayed above the textarea" },
      required: { type: "boolean", default: false, description: "Whether the textarea is required" },
      rows: { type: "number", default: 4, description: "Number of visible rows" },
      maxLength: { type: "number", description: "Maximum character length" },
      resizable: { type: "boolean", default: true, description: "Whether the textarea can be resized by the user" }
    },
    events: {
      onInput: { description: "Fired when the textarea value changes" },
      onFocus: { description: "Fired when the textarea receives focus" },
      onBlur: { description: "Fired when the textarea loses focus" }
    },
    template: {
      tag: "div",
      class: "{{styles.wrapper}}",
      children: [
        { if: "props.label", then: { tag: "label", class: "{{styles.label}}", children: [{ text: "{{props.label}}" }] } },
        { tag: "textarea", class: "{{styles.base}} {{props.resizable ? styles.resizable : styles.notResizable}} {{props.error ? styles.errorState : styles.defaultState}}", attributes: { placeholder: "{{props.placeholder}}", disabled: "{{props.disabled}}", required: "{{props.required}}", rows: "{{props.rows}}", maxlength: "{{props.maxLength}}", value: "{{props.value}}" } },
        { if: "props.maxLength", then: { tag: "div", class: "{{styles.charCount}}", children: [{ text: "{{charCount}} / {{props.maxLength}}" }] } },
        { if: "props.error", then: { tag: "p", class: "{{styles.errorText}}", children: [{ text: "{{props.errorMessage}}" }] } }
      ]
    },
    styles: {
      wrapper: "w-full",
      label: "mb-1.5 block text-sm font-medium text-gray-700",
      base: "flex min-h-[60px] w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      defaultState: "border-gray-300 text-gray-900 focus-visible:ring-blue-500",
      errorState: "border-red-500 text-gray-900 focus-visible:ring-red-500",
      resizable: "resize-y",
      notResizable: "resize-none",
      charCount: "mt-1.5 text-right text-xs text-gray-500",
      errorText: "mt-1.5 text-sm text-red-600"
    },
    accessibility: {
      role: "textbox",
      ariaAttributes: { "aria-invalid": "{{props.error}}", "aria-disabled": "{{props.disabled}}", "aria-required": "{{props.required}}", "aria-multiline": "true" }
    }
  },
  skeleton: {
    name: "skeleton",
    version: "1.0.0",
    description: "Loading placeholder component that mimics content layout with animated shimmer effect",
    category: "feedback",
    props: {
      variant: { type: "enum", values: ["text", "circular", "rectangular", "rounded"], default: "text", description: "Shape variant of the skeleton" },
      width: { type: "string", description: "Custom width (e.g., '100%', '200px')" },
      height: { type: "string", description: "Custom height (e.g., '20px', '3rem')" },
      count: { type: "number", default: 1, description: "Number of skeleton lines to render" },
      animated: { type: "boolean", default: true, description: "Whether to show the shimmer animation" },
      gap: { type: "string", default: "0.5rem", description: "Gap between multiple skeleton items" }
    },
    template: {
      tag: "div",
      class: "{{styles.group}}",
      attributes: { style: "{{count > 1 ? 'display: flex; flex-direction: column; gap: ' + props.gap : ''}}" },
      children: [
        {
          each: "range(props.count)",
          as: "i",
          children: [
            { tag: "div", class: "{{styles.base}} {{styles.variant[props.variant]}} {{props.animated ? styles.animated : ''}}", attributes: { style: "{{(props.width ? 'width: ' + props.width : '') + '; ' + (props.height ? 'height: ' + props.height : '')}}" } }
          ]
        }
      ]
    },
    styles: {
      base: "bg-gray-200",
      variant: {
        text: "h-4 w-full rounded",
        circular: "h-10 w-10 rounded-full",
        rectangular: "h-20 w-full rounded-none",
        rounded: "h-20 w-full rounded-lg"
      },
      animated: "animate-pulse",
      group: ""
    },
    accessibility: {
      role: "status",
      ariaAttributes: { "aria-label": "Loading" }
    }
  },
  toast: {
    name: "toast",
    version: "1.0.0",
    description: "Toast notification component for showing brief, temporary messages with variant styles and dismissible support",
    category: "feedback",
    props: {
      variant: { type: "enum", values: ["default", "success", "error", "warning", "info"], default: "default", description: "Visual style variant" },
      position: { type: "enum", values: ["top-right", "top-left", "bottom-right", "bottom-left", "top-center", "bottom-center"], default: "top-right", description: "Position on screen" },
      duration: { type: "number", default: 5e3, description: "Auto-dismiss duration in ms (0 to disable)" },
      dismissible: { type: "boolean", default: true, description: "Whether the toast shows a dismiss button" },
      title: { type: "string", description: "Optional bold title text" }
    },
    slots: {
      default: { description: "Toast message content" },
      icon: { description: "Toast icon displayed before the content" },
      action: { description: "Action button displayed after the message (e.g., Undo, Retry)" }
    },
    events: {
      onDismiss: { description: "Fired when the toast is dismissed" },
      onAction: { description: "Fired when the action button is clicked" }
    },
    template: {
      tag: "div",
      class: "{{styles.base}} {{styles.variant[props.variant]}} {{styles.position[props.position]}}",
      attributes: { role: "alert", "aria-live": "assertive", "aria-atomic": "true" },
      children: [
        { slot: "icon" },
        { tag: "div", class: "{{styles.content}}", children: [
          { if: "props.title", then: { tag: "p", class: "{{styles.title}}", children: [{ text: "{{props.title}}" }] } },
          { tag: "div", class: "{{styles.message}}", children: [{ slot: "default" }] }
        ] },
        { slot: "action" },
        { if: "props.dismissible", then: { tag: "button", class: "{{styles.dismiss}}", attributes: { type: "button", "aria-label": "Dismiss notification" }, children: [{ tag: "svg", class: "h-4 w-4", attributes: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2" }, children: [{ tag: "line", attributes: { x1: "18", y1: "6", x2: "6", y2: "18" } }, { tag: "line", attributes: { x1: "6", y1: "6", x2: "18", y2: "18" } }] }] } }
      ]
    },
    styles: {
      base: "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg",
      variant: {
        default: "border-gray-200 bg-white text-gray-900",
        success: "border-green-200 bg-green-50 text-green-900",
        error: "border-red-200 bg-red-50 text-red-900",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
        info: "border-blue-200 bg-blue-50 text-blue-900"
      },
      position: {
        "top-right": "fixed top-4 right-4",
        "top-left": "fixed top-4 left-4",
        "bottom-right": "fixed bottom-4 right-4",
        "bottom-left": "fixed bottom-4 left-4",
        "top-center": "fixed top-4 left-1/2 -translate-x-1/2",
        "bottom-center": "fixed bottom-4 left-1/2 -translate-x-1/2"
      },
      content: "flex-1",
      title: "text-sm font-semibold",
      message: "text-sm opacity-90",
      dismiss: "-mx-1 -my-1 ml-auto inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md opacity-60 hover:opacity-100 transition-opacity"
    },
    accessibility: {
      role: "alert",
      ariaAttributes: { "aria-live": "assertive", "aria-atomic": "true", "aria-relevant": "additions removals" },
      keyboardInteractions: ["Escape: Dismiss the toast"]
    }
  },
  table: {
    name: "table",
    version: "1.0.0",
    description: "Data table component with sortable columns, loading state, and empty state",
    category: "data-display",
    props: {
      columns: { type: "array", default: [], description: "Column definitions with key, label, and optional sortable flag" },
      rows: { type: "array", default: [], description: "Row data array" },
      sortable: { type: "boolean", default: false, description: "Whether columns are sortable" },
      striped: { type: "boolean", default: false, description: "Whether to show alternating row colors" },
      hoverable: { type: "boolean", default: true, description: "Whether rows highlight on hover" },
      compact: { type: "boolean", default: false, description: "Whether to use compact padding" },
      loading: { type: "boolean", default: false, description: "Whether the table is in a loading state" },
      emptyText: { type: "string", default: "No data available", description: "Text shown when there are no rows" }
    },
    slots: {
      header: { description: "Custom content above the table (e.g., search, filter controls)" },
      empty: { description: "Custom content shown when there are no rows" },
      loading: { description: "Custom loading indicator" },
      footer: { description: "Custom content below the table (e.g., pagination)" }
    },
    events: {
      onSort: { description: "Fired when a sortable column header is clicked" },
      onRowClick: { description: "Fired when a row is clicked" }
    },
    template: {
      tag: "div",
      class: "{{styles.wrapper}}",
      children: [
        { slot: "header" },
        { if: "props.loading", then: { tag: "div", class: "{{styles.loadingOverlay}}", children: [{ slot: "loading" }, { tag: "div", class: "{{styles.spinner}}" }] } },
        { tag: "div", class: "{{styles.tableWrapper}}", children: [
          { tag: "table", class: "{{styles.table}}", children: [
            { tag: "thead", class: "{{styles.thead}}", children: [{ tag: "tr", children: [
              { each: "props.columns", as: "col", key: "col.key", children: [
                { tag: "th", class: "{{styles.th}} {{props.sortable && col.sortable ? styles.sortable : ''}}", attributes: { scope: "col", "aria-sort": "{{col.sortDirection}}" }, children: [
                  { text: "{{col.label}}" },
                  { if: "props.sortable && col.sortable", then: { tag: "span", class: "{{styles.sortIcon}}", children: [{ text: "{{col.sortDirection === 'asc' ? ' \\u25B2' : col.sortDirection === 'desc' ? ' \\u25BC' : ' \\u25B4\\u25BE'}}" }] } }
                ] }
              ] }
            ] }] },
            { tag: "tbody", class: "{{styles.tbody}}", children: [
              { if: "props.rows.length === 0", then: { tag: "tr", children: [{ tag: "td", class: "{{styles.emptyCell}}", attributes: { colspan: "{{props.columns.length}}" }, children: [{ slot: "empty" }, { text: "{{props.emptyText}}" }] }] } },
              { each: "props.rows", as: "row", key: "row.id", children: [
                { tag: "tr", class: "{{styles.row}} {{props.striped ? styles.striped : ''}} {{props.hoverable ? styles.hoverable : ''}}", children: [
                  { each: "props.columns", as: "col", key: "col.key", children: [
                    { tag: "td", class: "{{styles.td}} {{props.compact ? styles.compact : ''}}", children: [{ text: "{{row[col.key]}}" }] }
                  ] }
                ] }
              ] }
            ] }
          ] }
        ] },
        { slot: "footer" }
      ]
    },
    styles: {
      wrapper: "w-full",
      loadingOverlay: "relative",
      spinner: "absolute inset-0 flex items-center justify-center bg-white/60",
      tableWrapper: "overflow-x-auto rounded-lg border border-gray-200",
      table: "min-w-full divide-y divide-gray-200",
      thead: "bg-gray-50",
      sortable: "cursor-pointer select-none hover:text-gray-900",
      sortIcon: "ml-1 text-gray-400",
      tbody: "divide-y divide-gray-100 bg-white",
      row: "",
      striped: "even:bg-gray-50",
      hoverable: "hover:bg-gray-50 cursor-pointer transition-colors",
      th: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600",
      td: "whitespace-nowrap px-4 py-3 text-sm text-gray-700",
      compact: "px-3 py-2",
      emptyCell: "px-4 py-12 text-center text-sm text-gray-500"
    },
    accessibility: {
      role: "table",
      ariaAttributes: { "aria-busy": "{{props.loading}}", "aria-rowcount": "{{props.rows.length}}", "aria-colcount": "{{props.columns.length}}" },
      keyboardInteractions: ["Enter/Space: Sort column (when sortable)", "Enter: Select/click row"]
    }
  },
  accordion: {
    name: "accordion",
    version: "1.0.0",
    description: "Accordion component for expandable/collapsible content sections",
    category: "layout",
    props: {
      type: { type: "enum", values: ["single", "multiple"], default: "single", description: "Whether one or multiple items can be open at once" },
      defaultValue: { type: "string", description: "Value of the initially expanded item (for single mode)" },
      collapsible: { type: "boolean", default: true, description: "Whether all items can be collapsed (only in single mode)" },
      variant: { type: "enum", values: ["default", "bordered", "ghost"], default: "default", description: "Visual style variant" }
    },
    slots: { default: { description: "Accordion item components" } },
    events: { onValueChange: { description: "Fired when the expanded item(s) change" } },
    template: {
      tag: "div",
      class: "{{styles.base}} {{styles.variant[props.variant]}}",
      attributes: { "data-orientation": "vertical" },
      children: [{ slot: "default" }]
    },
    styles: {
      base: "w-full divide-y divide-gray-200",
      variant: { default: "rounded-lg border border-gray-200", bordered: "border border-gray-200", ghost: "border-0" }
    },
    accessibility: { role: "region", ariaAttributes: { "aria-orientation": "vertical" } }
  },
  "accordion-item": {
    name: "accordion-item",
    version: "1.0.0",
    description: "Individual accordion item with trigger and content sections",
    category: "layout",
    props: {
      value: { type: "string", required: true, description: "Unique value identifying this accordion item" },
      title: { type: "string", description: "Trigger title text" },
      disabled: { type: "boolean", default: false, description: "Whether the accordion item is disabled" }
    },
    slots: {
      trigger: { description: "Custom trigger content (replaces title text)" },
      default: { description: "Collapsible content area" }
    },
    events: {},
    template: {
      tag: "div",
      class: "{{styles.base}}",
      children: [
        { tag: "button", class: "{{styles.trigger}} {{props.disabled ? styles.disabled : ''}}", attributes: { type: "button", disabled: "{{props.disabled}}", "aria-expanded": "{{isOpen}}", "aria-controls": "accordion-content-{{props.value}}" }, children: [
          { slot: "trigger" },
          { if: "!hasSlot('trigger')", then: { tag: "span", class: "{{styles.titleText}}", children: [{ text: "{{props.title}}" }] } },
          { tag: "svg", class: "{{styles.chevron}} {{isOpen ? styles.chevronOpen : ''}}", attributes: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "aria-hidden": "true" }, children: [{ tag: "polyline", attributes: { points: "6 9 12 15 18 9" } }] }
        ] },
        { tag: "div", class: "{{styles.content}}", attributes: { id: "accordion-content-{{props.value}}", role: "region", "aria-labelledby": "accordion-trigger-{{props.value}}" }, children: [
          { tag: "div", class: "{{styles.contentInner}}", children: [{ slot: "default" }] }
        ] }
      ]
    },
    styles: {
      base: "",
      trigger: "flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-left text-gray-900 hover:bg-gray-50 transition-colors",
      disabled: "opacity-50 cursor-not-allowed hover:bg-transparent",
      titleText: "flex-1",
      chevron: "h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200",
      chevronOpen: "rotate-180",
      content: "overflow-hidden",
      contentInner: "px-4 pb-3 pt-0 text-sm text-gray-600"
    },
    accessibility: {
      role: "region",
      ariaAttributes: { "aria-labelledby": "accordion-trigger-{{props.value}}" },
      keyboardInteractions: ["Enter/Space: Toggle accordion item", "Tab: Move focus between accordion triggers"]
    }
  },
  sidebar: {
    name: "sidebar",
    version: "1.0.0",
    description: "Collapsible sidebar navigation component with menu items, icons, and nested submenus",
    category: "navigation",
    props: {
      collapsed: { type: "boolean", default: false, description: "Whether the sidebar is collapsed to icon-only mode" },
      variant: { type: "enum", values: ["default", "floating", "bordered"], default: "default", description: "Visual style variant" },
      position: { type: "enum", values: ["left", "right"], default: "left", description: "Which side the sidebar is on" },
      width: { type: "string", default: "16rem", description: "Width of the expanded sidebar" },
      collapsedWidth: { type: "string", default: "4rem", description: "Width of the collapsed sidebar" }
    },
    slots: {
      header: { description: "Content at the top of the sidebar (e.g., logo, brand)" },
      default: { description: "Navigation menu items" },
      footer: { description: "Content at the bottom of the sidebar (e.g., user menu, settings)" },
      toggle: { description: "Custom toggle button for collapsing/expanding" }
    },
    events: { onToggle: { description: "Fired when the sidebar is toggled between collapsed and expanded" } },
    template: {
      tag: "aside",
      class: "{{styles.base}} {{styles.variant[props.variant]}} {{styles.position[props.position]}}",
      attributes: { style: "width: {{props.collapsed ? props.collapsedWidth : props.width}}" },
      children: [
        { slot: "toggle" },
        { slot: "header" },
        { tag: "nav", class: "{{styles.nav}}", children: [{ slot: "default" }] },
        { slot: "footer" }
      ]
    },
    styles: {
      base: "flex h-full flex-col overflow-y-auto bg-white transition-all duration-300",
      variant: { default: "border-r border-gray-200 shadow-sm", floating: "m-2 rounded-lg border border-gray-200 shadow-md", bordered: "border-r border-gray-200" },
      position: { left: "", right: "border-l border-r-0" },
      nav: "flex-1 overflow-y-auto py-2"
    },
    accessibility: { role: "complementary", ariaAttributes: { "aria-label": "Sidebar navigation" } }
  },
  loading: {
    name: "loading",
    version: "1.0.0",
    description: "Loading state component with spinner, progress bar, and overlay variants for async operations",
    category: "feedback",
    props: {
      variant: { type: "enum", values: ["spinner", "dots", "pulse", "progress", "ring"], default: "spinner", description: "Visual style of the loading indicator" },
      size: { type: "enum", values: ["sm", "md", "lg"], default: "md", description: "Size of the loading indicator" },
      label: { type: "string", description: "Text label displayed below the loading indicator" },
      overlay: { type: "boolean", default: false, description: "Whether to show as a full-area overlay" },
      progress: { type: "number", description: "Progress value 0-100 (only for progress variant)" },
      color: { type: "enum", values: ["primary", "secondary", "white"], default: "primary", description: "Color variant" }
    },
    slots: { default: { description: "Custom content inside the loading area (replaces default indicator)" } },
    template: {
      tag: "div",
      class: "{{styles.base}} {{props.overlay ? styles.overlay : ''}}",
      attributes: { role: "status", "aria-label": "{{props.label || 'Loading'}}" },
      children: [
        { if: "props.overlay", then: { tag: "div", class: "{{styles.backdrop}}" } },
        { tag: "div", class: "{{styles.content}}", children: [
          { slot: "default" },
          { if: "!hasSlot('default') && props.variant === 'spinner'", then: { tag: "svg", class: "{{styles.spinner}} {{styles.size[props.size]}} {{styles.color[props.color]}}", attributes: { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, children: [{ tag: "circle", attributes: { cx: "12", cy: "12", r: "10", stroke: "currentColor", "stroke-width": "4", opacity: "0.25" } }, { tag: "path", attributes: { d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z", fill: "currentColor", opacity: "0.75" } }] } },
          { if: "!hasSlot('default') && props.variant === 'dots'", then: { tag: "div", class: "{{styles.dots}} {{styles.size[props.size]}}", children: [{ tag: "span", class: "{{styles.dot}} {{styles.color[props.color]}}" }, { tag: "span", class: "{{styles.dot}} {{styles.color[props.color]}}" }, { tag: "span", class: "{{styles.dot}} {{styles.color[props.color]}}" }] } },
          { if: "!hasSlot('default') && props.variant === 'pulse'", then: { tag: "div", class: "{{styles.pulse}} {{styles.size[props.size]}} {{styles.color[props.color]}}" } },
          { if: "!hasSlot('default') && props.variant === 'ring'", then: { tag: "svg", class: "{{styles.ring}} {{styles.size[props.size]}} {{styles.color[props.color]}}", attributes: { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, children: [{ tag: "circle", attributes: { cx: "12", cy: "12", r: "10", stroke: "currentColor", "stroke-width": "2", "stroke-dasharray": "31.4 31.4", "stroke-linecap": "round" } }] } },
          { if: "!hasSlot('default') && props.variant === 'progress'", then: { tag: "div", class: "{{styles.progressTrack}}", children: [{ tag: "div", class: "{{styles.progressBar}} {{styles.color[props.color]}}", attributes: { style: "width: {{props.progress || 0}}%" } }] } },
          { if: "props.label", then: { tag: "p", class: "{{styles.label}}", children: [{ text: "{{props.label}}" }] } }
        ] }
      ]
    },
    styles: {
      base: "flex items-center justify-center",
      overlay: "fixed inset-0 z-50",
      backdrop: "absolute inset-0 bg-white/80 backdrop-blur-sm",
      content: "relative flex flex-col items-center gap-3",
      size: { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" },
      color: { primary: "text-blue-600", secondary: "text-gray-500", white: "text-white" },
      spinner: "animate-spin",
      dots: "flex items-center gap-1",
      dot: "h-2 w-2 rounded-full animate-bounce [&:nth-child(2)]:delay-100 [&:nth-child(3)]:delay-200",
      pulse: "rounded-full animate-pulse",
      ring: "animate-spin",
      progressTrack: "h-2 w-full min-w-[200px] overflow-hidden rounded-full bg-gray-200",
      progressBar: "h-full rounded-full transition-all duration-500",
      label: "text-sm text-gray-500"
    },
    accessibility: {
      role: "status",
      ariaAttributes: { "aria-live": "polite", "aria-busy": "true", "aria-label": "{{props.label || 'Loading'}}" }
    }
  },
  menubar: {
    name: "menubar",
    version: "1.0.0",
    description: "Horizontal menu bar component with dropdown items, icons, and keyboard navigation",
    category: "navigation",
    props: {
      items: { type: "array", default: [], description: "Array of menu items with label, icon, children for submenus, and optional divider" },
      orientation: { type: "enum", values: ["horizontal", "vertical"], default: "horizontal", description: "Orientation of the menu bar" }
    },
    slots: {
      default: { description: "Custom menu items (replaces items prop)" },
      start: { description: "Content at the start of the menu bar (e.g., logo)" },
      end: { description: "Content at the end of the menu bar (e.g., actions, profile)" }
    },
    events: { onSelect: { description: "Fired when a menu item is selected" } },
    template: {
      tag: "nav",
      class: "{{styles.base}} {{styles.orientation[props.orientation]}}",
      attributes: { role: "menubar", "aria-label": "Menu bar" },
      children: [
        { slot: "start" },
        { tag: "div", class: "{{styles.menuList}}", children: [
          { slot: "default" },
          { each: "props.items", as: "item", key: "item.label", children: [
            { tag: "div", class: "{{styles.menuItem}}", children: [
              { tag: "button", class: "{{styles.trigger}}", attributes: { role: "menuitem", type: "button", "aria-haspopup": "{{item.children ? 'true' : 'false'}}", "aria-expanded": "{{item.open}}" }, children: [
                { text: "{{item.label}}" },
                { if: "item.children", then: { tag: "svg", class: "{{styles.chevron}}", attributes: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "aria-hidden": "true" }, children: [{ tag: "polyline", attributes: { points: "6 9 12 15 18 9" } }] } }
              ] }
            ] }
          ] }
        ] },
        { slot: "end" }
      ]
    },
    styles: {
      base: "flex items-center bg-white",
      orientation: { horizontal: "flex-row border-b border-gray-200 px-2 py-1", vertical: "flex-col border-r border-gray-200 px-1 py-2" },
      menuList: "flex items-center gap-1",
      menuItem: "relative",
      trigger: "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors",
      chevron: "h-3 w-3 text-gray-500"
    },
    accessibility: {
      role: "menubar",
      ariaAttributes: { "aria-label": "Menu bar", "aria-orientation": "{{props.orientation}}" },
      keyboardInteractions: ["Arrow Left/Right: Navigate between menu items", "Arrow Up/Down: Open submenu or navigate submenu items", "Enter/Space: Activate menu item", "Escape: Close submenu"]
    }
  },
  dialog: {
    name: "dialog",
    version: "1.0.0",
    description: "Modal dialog component with backdrop, title, description, and action buttons",
    category: "overlay",
    props: {
      open: { type: "boolean", default: false, description: "Whether the dialog is open" },
      title: { type: "string", description: "Dialog title text" },
      description: { type: "string", description: "Optional description text below the title" },
      size: { type: "enum", values: ["sm", "md", "lg", "xl", "fullscreen"], default: "md", description: "Size of the dialog" },
      closable: { type: "boolean", default: true, description: "Whether the dialog can be closed by clicking backdrop or Escape" },
      showCloseButton: { type: "boolean", default: true, description: "Whether to show the X close button" },
      centered: { type: "boolean", default: true, description: "Whether the dialog is centered on screen" }
    },
    slots: {
      default: { description: "Dialog body content" },
      header: { description: "Custom header content (replaces title)" },
      footer: { description: "Dialog footer with action buttons" },
      trigger: { description: "Element that opens the dialog on click" }
    },
    events: {
      onOpenChange: { description: "Fired when the dialog open state changes" },
      onClose: { description: "Fired when the dialog is closed" }
    },
    template: {
      tag: "div",
      class: "{{styles.base}}",
      children: [
        { slot: "trigger" },
        { if: "props.open", then: { tag: "div", class: "{{styles.overlay}}", attributes: { role: "presentation" }, children: [
          { tag: "div", class: "{{styles.backdrop}}" },
          { tag: "div", class: "{{styles.positioner}} {{props.centered ? styles.centered : ''}}", children: [
            { tag: "div", class: "{{styles.dialog}} {{styles.size[props.size]}}", attributes: { role: "dialog", "aria-modal": "true", "aria-labelledby": "dialog-title", "aria-describedby": "{{props.description ? 'dialog-description' : undefined}}" }, children: [
              { tag: "div", class: "{{styles.header}}", children: [
                { slot: "header" },
                { if: "!hasSlot('header') && props.title", then: { tag: "h2", class: "{{styles.title}}", attributes: { id: "dialog-title" }, children: [{ text: "{{props.title}}" }] } },
                { if: "!hasSlot('header') && props.showCloseButton", then: { tag: "button", class: "{{styles.closeButton}}", attributes: { type: "button", "aria-label": "Close dialog" }, children: [{ tag: "svg", class: "h-4 w-4", attributes: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2" }, children: [{ tag: "line", attributes: { x1: "18", y1: "6", x2: "6", y2: "18" } }, { tag: "line", attributes: { x1: "6", y1: "6", x2: "18", y2: "18" } }] }] } }
              ] },
              { if: "!hasSlot('header') && props.description", then: { tag: "div", class: "{{styles.description}}", children: [{ text: "{{props.description}}" }] } },
              { tag: "div", class: "{{styles.body}}", children: [{ slot: "default" }] },
              { if: "hasSlot('footer')", then: { tag: "div", class: "{{styles.footer}}", children: [{ slot: "footer" }] } }
            ] }
          ] }
        ] } }
      ]
    },
    styles: {
      base: "",
      overlay: "fixed inset-0 z-50",
      backdrop: "absolute inset-0 bg-black/50 backdrop-blur-sm",
      positioner: "fixed inset-0 flex items-start justify-center",
      centered: "items-center",
      dialog: "relative z-10 flex flex-col rounded-lg bg-white shadow-xl max-h-[85vh]",
      size: { sm: "w-full max-w-sm", md: "w-full max-w-md", lg: "w-full max-w-lg", xl: "w-full max-w-xl", fullscreen: "w-full max-w-full mx-4" },
      header: "flex items-center justify-between border-b border-gray-100 px-6 py-4",
      title: "text-lg font-semibold text-gray-900",
      closeButton: "inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors",
      description: "px-6 pt-2 text-sm text-gray-500",
      body: "flex-1 overflow-y-auto px-6 py-4 text-sm text-gray-700",
      footer: "flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4"
    },
    accessibility: {
      role: "dialog",
      ariaAttributes: { "aria-modal": "true", "aria-labelledby": "dialog-title", "aria-describedby": "{{props.description ? 'dialog-description' : undefined}}" },
      keyboardInteractions: ["Escape: Close the dialog", "Tab: Move focus through dialog elements", "Shift+Tab: Move focus backward"]
    }
  },
  tabs: {
    name: "tabs",
    version: "1.0.0",
    description: "Tabbed interface component with horizontal and vertical orientations",
    category: "navigation",
    props: {
      defaultValue: { type: "string", description: "Value of the initially selected tab" },
      orientation: { type: "enum", values: ["horizontal", "vertical"], default: "horizontal", description: "Orientation of the tabs" },
      variant: { type: "enum", values: ["underline", "pills", "enclosed", "ghost"], default: "underline", description: "Visual style variant" },
      activationMode: { type: "enum", values: ["auto", "manual"], default: "auto", description: "Whether tab activates on focus or on click" }
    },
    slots: {
      default: { description: "Tab list and tab panel components" },
      extra: { description: "Extra content displayed alongside the tab list (e.g., actions button)" }
    },
    events: { onValueChange: { description: "Fired when the selected tab changes" } },
    template: {
      tag: "div",
      class: "{{styles.base}} {{styles.orientation[props.orientation]}}",
      children: [
        { tag: "div", class: "{{styles.tabList}}", attributes: { role: "tablist", "aria-orientation": "{{props.orientation}}" }, children: [{ slot: "default" }] },
        { slot: "extra" }
      ]
    },
    styles: {
      base: "w-full",
      orientation: { horizontal: "", vertical: "flex gap-4" },
      tabList: "flex"
    },
    accessibility: { role: "region", ariaAttributes: { "aria-label": "Tabs" } }
  },
  tab: {
    name: "tab",
    version: "1.0.0",
    description: "Individual tab trigger and panel pair for the tabs component",
    category: "navigation",
    props: {
      value: { type: "string", required: true, description: "Unique value identifying this tab" },
      label: { type: "string", description: "Display text for the tab trigger" },
      disabled: { type: "boolean", default: false, description: "Whether the tab is disabled" }
    },
    slots: {
      trigger: { description: "Custom trigger content (replaces label)" },
      default: { description: "Tab panel content" }
    },
    events: {},
    template: {
      tag: "div",
      class: "{{styles.base}}",
      children: [
        { tag: "button", class: "{{styles.trigger}} {{isActive ? styles.active : styles.inactive}} {{props.disabled ? styles.disabled : ''}}", attributes: { role: "tab", type: "button", "aria-selected": "{{isActive}}", "aria-controls": "tabpanel-{{props.value}}", disabled: "{{props.disabled}}", tabindex: "{{isActive ? '0' : '-1'}}" }, children: [
          { slot: "trigger" },
          { if: "!hasSlot('trigger')", then: { text: "{{props.label}}" } }
        ] },
        { if: "isActive", then: { tag: "div", class: "{{styles.panel}}", attributes: { id: "tabpanel-{{props.value}}", role: "tabpanel", "aria-labelledby": "tab-{{props.value}}", tabindex: "0" }, children: [{ slot: "default" }] } }
      ]
    },
    styles: {
      base: "",
      trigger: "inline-flex items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      active: "text-blue-600 border-b-2 border-blue-600",
      inactive: "text-gray-500 hover:text-gray-700 border-b-2 border-transparent",
      disabled: "pointer-events-none opacity-50",
      panel: "mt-2 rounded-lg p-4 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    },
    accessibility: {
      role: "tab",
      ariaAttributes: { "aria-selected": "{{isActive}}", "aria-controls": "tabpanel-{{props.value}}" },
      keyboardInteractions: ["Arrow Left/Right: Navigate between tabs", "Home: Go to first tab", "End: Go to last tab", "Enter/Space: Activate tab"]
    }
  },
  tooltip: {
    name: "tooltip",
    version: "1.0.0",
    description: "Tooltip component that shows contextual information on hover, focus, or click",
    category: "overlay",
    props: {
      content: { type: "string", description: "Tooltip text content" },
      side: { type: "enum", values: ["top", "bottom", "left", "right"], default: "top", description: "Which side the tooltip appears on" },
      align: { type: "enum", values: ["start", "center", "end"], default: "center", description: "Alignment of the tooltip relative to the trigger" },
      delay: { type: "number", default: 300, description: "Delay in ms before showing the tooltip" },
      closeDelay: { type: "number", default: 100, description: "Delay in ms before hiding the tooltip" },
      maxWidth: { type: "string", default: "14rem", description: "Maximum width of the tooltip" }
    },
    slots: {
      default: { description: "Trigger element that the tooltip wraps around" },
      content: { description: "Custom content inside the tooltip (replaces content prop)" }
    },
    events: { onOpenChange: { description: "Fired when the tooltip visibility changes" } },
    template: {
      tag: "div",
      class: "{{styles.base}}",
      attributes: { "data-side": "{{props.side}}", "data-align": "{{props.align}}" },
      children: [
        { tag: "div", class: "{{styles.triggerWrapper}}", attributes: { "aria-describedby": "tooltip-content", tabindex: "0" }, children: [{ slot: "default" }] },
        { tag: "div", class: "{{styles.tooltip}} {{styles.side[props.side]}} {{styles.align[props.align]}}", attributes: { id: "tooltip-content", role: "tooltip", style: "max-width: {{props.maxWidth}}" }, children: [
          { slot: "content" },
          { if: "!hasSlot('content')", then: { text: "{{props.content}}" } },
          { tag: "div", class: "{{styles.arrow}}" }
        ] }
      ]
    },
    styles: {
      base: "relative inline-flex",
      triggerWrapper: "inline-flex",
      tooltip: "absolute z-50 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-sm",
      side: {
        top: "bottom-full left-1/2 mb-2",
        bottom: "top-full left-1/2 mt-2",
        left: "right-full top-1/2 mr-2",
        right: "left-full top-1/2 ml-2"
      },
      align: { start: "", center: "-translate-x-1/2", end: "" },
      arrow: "absolute w-2 h-2 bg-gray-900 rotate-45"
    },
    accessibility: {
      role: "tooltip",
      ariaAttributes: { "aria-describedby": "tooltip-content" },
      keyboardInteractions: ["Tab: Focus trigger element to show tooltip", "Escape: Hide tooltip"]
    }
  },
  progress: {
    name: "progress",
    version: "1.0.0",
    description: "Progress bar component for tracking completion, loading, or step progress",
    category: "feedback",
    props: {
      value: { type: "number", default: 0, description: "Current progress value" },
      max: { type: "number", default: 100, description: "Maximum progress value" },
      variant: { type: "enum", values: ["bar", "circle", "steps"], default: "bar", description: "Visual style variant" },
      color: { type: "enum", values: ["primary", "success", "warning", "error", "info"], default: "primary", description: "Color variant" },
      size: { type: "enum", values: ["sm", "md", "lg"], default: "md", description: "Size/thickness of the progress bar" },
      showLabel: { type: "boolean", default: true, description: "Whether to show the percentage label" },
      animated: { type: "boolean", default: true, description: "Whether the bar has a smooth animation" },
      indeterminate: { type: "boolean", default: false, description: "Whether the progress is in indeterminate (unknown) state" },
      steps: { type: "number", default: 3, description: "Number of steps for the steps variant" },
      stepLabels: { type: "array", default: [], description: "Labels for each step in the steps variant" }
    },
    slots: { default: { description: "Custom label content (replaces percentage text)" } },
    template: {
      tag: "div",
      class: "{{styles.wrapper}}",
      children: [
        { if: "props.variant === 'bar'", then: { tag: "div", class: "{{styles.base}} {{styles.size[props.size]}}", attributes: { role: "progressbar", "aria-valuenow": "{{props.indeterminate ? undefined : props.value}}", "aria-valuemin": "0", "aria-valuemax": "{{props.max}}" }, children: [
          { tag: "div", class: "{{styles.bar}} {{styles.color[props.color]}} {{props.animated ? styles.animated : ''}} {{props.indeterminate ? styles.indeterminate : ''}}", attributes: { style: "{{props.indeterminate ? '100%' : (props.value / props.max * 100) + '%'}}" } }
        ] } },
        { if: "props.variant === 'circle'", then: { tag: "div", class: "{{styles.circleWrapper}}", attributes: { role: "progressbar", "aria-valuenow": "{{props.value}}", "aria-valuemin": "0", "aria-valuemax": "{{props.max}}" }, children: [
          { tag: "svg", class: "{{styles.circleSvg}} {{styles.size[props.size]}}", attributes: { viewBox: "0 0 36 36" }, children: [
            { tag: "path", class: "{{styles.circleTrack}}", attributes: { d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831", fill: "none", "stroke-width": "3" } },
            { tag: "path", class: "{{styles.circleBar}} {{styles.color[props.color]}}", attributes: { d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831", fill: "none", "stroke-width": "3", "stroke-dasharray": "{{props.value / props.max * 100}}, 100" } }
          ] }
        ] } },
        { if: "props.variant === 'steps'", then: { tag: "div", class: "{{styles.stepsWrapper}}", children: [
          { each: "range(props.steps)", as: "step", key: "step", children: [
            { tag: "div", class: "{{styles.step}} {{step < props.value / (props.max / props.steps) ? styles.stepActive : styles.stepInactive}}", children: [
              { tag: "div", class: "{{styles.stepIndicator}} {{step < props.value / (props.max / props.steps) ? styles.stepIndicatorActive : ''}}", children: [{ text: "{{step + 1}}" }] },
              { if: "props.stepLabels[step]", then: { tag: "span", class: "{{styles.stepLabel}}", children: [{ text: "{{props.stepLabels[step]}}" }] } }
            ] },
            { if: "step < props.steps - 1", then: { tag: "div", class: "{{styles.stepConnector}} {{step < props.value / (props.max / props.steps) ? styles.stepConnectorActive : ''}}" } }
          ] }
        ] } },
        { if: "props.showLabel && props.variant !== 'steps'", then: { tag: "span", class: "{{styles.label}}", children: [{ slot: "default" }, { if: "!hasSlot('default')", then: { text: "{{Math.round(props.value / props.max * 100)}}%" } }] } }
      ]
    },
    styles: {
      wrapper: "flex items-center gap-3",
      base: "w-full overflow-hidden rounded-full bg-gray-200",
      size: { sm: "h-1.5", md: "h-2.5", lg: "h-4" },
      bar: "h-full rounded-full transition-all duration-500",
      color: { primary: "bg-blue-600", success: "bg-green-600", warning: "bg-yellow-500", error: "bg-red-600", info: "bg-cyan-600" },
      animated: "transition-all duration-500 ease-in-out",
      indeterminate: "animate-pulse",
      label: "text-sm font-medium text-gray-700",
      circleWrapper: "inline-flex items-center justify-center",
      circleSvg: "",
      circleTrack: "stroke-gray-200",
      circleBar: "transition-all duration-500",
      stepsWrapper: "flex items-center w-full",
      step: "flex flex-col items-center",
      stepActive: "",
      stepInactive: "",
      stepIndicator: "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium border-2",
      stepIndicatorActive: "bg-blue-600 text-white border-blue-600",
      stepLabel: "mt-1 text-xs text-gray-500",
      stepConnector: "flex-1 h-0.5 mx-2 bg-gray-200",
      stepConnectorActive: "bg-blue-600"
    },
    accessibility: {
      role: "progressbar",
      ariaAttributes: { "aria-valuenow": "{{props.value}}", "aria-valuemin": "0", "aria-valuemax": "{{props.max}}", "aria-label": "{{props.label || 'Progress'}}" }
    }
  },
  pagination: {
    name: "pagination",
    version: "1.0.0",
    description: "Pagination component for navigating through pages with page numbers, next/previous, and ellipsis",
    category: "navigation",
    props: {
      currentPage: { type: "number", default: 1, description: "Current active page number" },
      totalPages: { type: "number", default: 1, description: "Total number of pages" },
      siblingCount: { type: "number", default: 1, description: "Number of sibling pages to show on each side of the current page" },
      boundaryCount: { type: "number", default: 1, description: "Number of boundary pages to show at start and end" },
      size: { type: "enum", values: ["sm", "md", "lg"], default: "md", description: "Size of pagination buttons" },
      variant: { type: "enum", values: ["default", "outlined", "ghost"], default: "default", description: "Visual style variant" },
      showPrevNext: { type: "boolean", default: true, description: "Whether to show previous/next buttons" },
      showFirstLast: { type: "boolean", default: false, description: "Whether to show first/last page buttons" },
      prevLabel: { type: "string", default: "Previous", description: "Label for the previous button" },
      nextLabel: { type: "string", default: "Next", description: "Label for the next button" }
    },
    slots: { default: { description: "Custom content between prev/next buttons (replaces page numbers)" } },
    events: { onPageChange: { description: "Fired when a page is selected" } },
    template: {
      tag: "nav",
      class: "{{styles.base}}",
      attributes: { role: "navigation", "aria-label": "Pagination" },
      children: [
        { if: "props.showFirstLast", then: { tag: "button", class: "{{styles.button}} {{styles.size[props.size]}} {{styles.variant[props.variant]}}", attributes: { type: "button", disabled: "{{props.currentPage === 1}}", "aria-label": "First page" }, children: [{ tag: "svg", class: "h-4 w-4", attributes: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "aria-hidden": "true" }, children: [{ tag: "polyline", attributes: { points: "11 17 6 12 11 7" } }, { tag: "polyline", attributes: { points: "18 17 13 12 18 7" } }] }] } },
        { if: "props.showPrevNext", then: { tag: "button", class: "{{styles.button}} {{styles.size[props.size]}} {{styles.variant[props.variant]}}", attributes: { type: "button", disabled: "{{props.currentPage === 1}}", "aria-label": "Go to previous page" }, children: [{ tag: "svg", class: "h-4 w-4", attributes: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "aria-hidden": "true" }, children: [{ tag: "polyline", attributes: { points: "15 18 9 12 15 6" } }] }, { text: "{{props.prevLabel}}" }] } },
        { slot: "default" },
        { if: "props.showPrevNext", then: { tag: "button", class: "{{styles.button}} {{styles.size[props.size]}} {{styles.variant[props.variant]}}", attributes: { type: "button", disabled: "{{props.currentPage === props.totalPages}}", "aria-label": "Go to next page" }, children: [{ text: "{{props.nextLabel}}" }, { tag: "svg", class: "h-4 w-4", attributes: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "aria-hidden": "true" }, children: [{ tag: "polyline", attributes: { points: "9 18 15 12 9 6" } }] }] } },
        { if: "props.showFirstLast", then: { tag: "button", class: "{{styles.button}} {{styles.size[props.size]}} {{styles.variant[props.variant]}}", attributes: { type: "button", disabled: "{{props.currentPage === props.totalPages}}", "aria-label": "Last page" }, children: [{ tag: "svg", class: "h-4 w-4", attributes: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "aria-hidden": "true" }, children: [{ tag: "polyline", attributes: { points: "13 17 18 12 13 7" } }, { tag: "polyline", attributes: { points: "6 17 11 12 6 7" } }] }] } }
      ]
    },
    styles: {
      base: "flex items-center gap-1",
      button: "inline-flex items-center gap-1 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      size: { sm: "h-7 px-2 text-xs", md: "h-9 px-3 text-sm", lg: "h-11 px-4 text-base" },
      variant: { default: "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300", outlined: "bg-transparent text-gray-700 hover:bg-gray-50 border border-gray-300", ghost: "bg-transparent text-gray-700 hover:bg-gray-100 border-0" }
    },
    accessibility: {
      role: "navigation",
      ariaAttributes: { "aria-label": "Pagination" },
      keyboardInteractions: ["Arrow Left: Go to previous page", "Arrow Right: Go to next page", "Home: Go to first page", "End: Go to last page"]
    }
  },
  breadcrumb: {
    name: "breadcrumb",
    version: "1.0.0",
    description: "Breadcrumb navigation component showing page hierarchy with links and separators",
    category: "navigation",
    props: {
      items: { type: "array", default: [], description: "Array of breadcrumb items with label, href, and optional icon" },
      separator: { type: "enum", values: ["slash", "chevron", "dot", "arrow"], default: "chevron", description: "Separator style between items" },
      size: { type: "enum", values: ["sm", "md", "lg"], default: "md", description: "Size of the breadcrumb text" },
      maxItems: { type: "number", description: "Maximum items before collapsing with ellipsis" },
      collapsedLabel: { type: "string", default: "...", description: "Label for the collapsed indicator" }
    },
    slots: { default: { description: "Custom breadcrumb items (replaces items prop)" } },
    events: { onClick: { description: "Fired when a breadcrumb link is clicked" } },
    template: {
      tag: "nav",
      class: "{{styles.base}}",
      attributes: { "aria-label": "Breadcrumb" },
      children: [
        { tag: "ol", class: "{{styles.list}} {{styles.size[props.size]}}", children: [
          { slot: "default" },
          { each: "props.items", as: "item", key: "item.label", children: [
            { if: "item.index > 0", then: { tag: "li", class: "{{styles.separatorItem}}", attributes: { "aria-hidden": "true" }, children: [{ tag: "svg", class: "{{styles.separatorIcon}}", attributes: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "aria-hidden": "true" }, children: [
              { if: "props.separator === 'chevron' || props.separator === 'arrow'", then: { tag: "polyline", attributes: { points: "9 18 15 12 9 6" } } },
              { if: "props.separator === 'slash'", then: { tag: "line", attributes: { x1: "14", y1: "6", x2: "10", y2: "18" } } },
              { if: "props.separator === 'dot'", then: { tag: "circle", attributes: { cx: "12", cy: "12", r: "2" } } }
            ] }] } },
            { tag: "li", class: "{{styles.item}} {{item.index === props.items.length - 1 ? styles.current : ''}}", attributes: { "aria-current": "{{item.index === props.items.length - 1 ? 'page' : undefined}}" }, children: [
              { if: "item.index < props.items.length - 1", then: { tag: "a", class: "{{styles.link}}", attributes: { href: "{{item.href}}" }, children: [{ text: "{{item.label}}" }] }, else: { tag: "span", class: "{{styles.currentText}}", children: [{ text: "{{item.label}}" }] } }
            ] }
          ] }
        ] }
      ]
    },
    styles: {
      base: "",
      list: "flex items-center flex-wrap",
      size: { sm: "text-xs", md: "text-sm", lg: "text-base" },
      item: "inline-flex items-center",
      separatorItem: "inline-flex items-center mx-1.5",
      separatorIcon: "h-3.5 w-3.5 text-gray-400",
      link: "text-gray-600 hover:text-gray-900 underline-offset-2 hover:underline transition-colors",
      current: "",
      currentText: "text-gray-900 font-medium"
    },
    accessibility: { role: "navigation", ariaAttributes: { "aria-label": "Breadcrumb" } }
  },
  "dropdown-menu": {
    name: "dropdown-menu",
    version: "1.0.0",
    description: "Dropdown menu component with trigger, items, separators, and keyboard navigation",
    category: "overlay",
    props: {
      label: { type: "string", default: "Menu", description: "Accessible label for the menu" },
      align: { type: "enum", values: ["start", "center", "end"], default: "start", description: "Alignment of the dropdown relative to the trigger" },
      side: { type: "enum", values: ["bottom", "top", "left", "right"], default: "bottom", description: "Which side the dropdown appears on" },
      items: { type: "array", default: [], description: "Array of menu items with label, icon, shortcut, disabled, and divider properties" }
    },
    slots: {
      trigger: { description: "Element that opens the dropdown on click" },
      default: { description: "Custom menu content (replaces items prop)" }
    },
    events: {
      onSelect: { description: "Fired when a menu item is selected" },
      onOpenChange: { description: "Fired when the dropdown opens or closes" }
    },
    template: {
      tag: "div",
      class: "{{styles.base}}",
      children: [
        { tag: "div", class: "{{styles.triggerWrapper}}", children: [{ slot: "trigger" }] },
        { tag: "div", class: "{{styles.menu}} {{styles.side[props.side]}} {{styles.align[props.align]}}", attributes: { role: "menu", "aria-label": "{{props.label}}" }, children: [
          { slot: "default" },
          { each: "props.items", as: "item", key: "item.label", children: [
            { if: "item.divider", then: { tag: "div", class: "{{styles.divider}}", attributes: { role: "separator" } }, else: { tag: "button", class: "{{styles.item}} {{item.disabled ? styles.disabled : ''}}", attributes: { role: "menuitem", type: "button", disabled: "{{item.disabled}}", "aria-disabled": "{{item.disabled}}" }, children: [
              { if: "item.icon", then: { tag: "span", class: "{{styles.icon}}", children: [{ text: "{{item.icon}}" }] } },
              { tag: "span", class: "{{styles.label}}", children: [{ text: "{{item.label}}" }] },
              { if: "item.shortcut", then: { tag: "kbd", class: "{{styles.shortcut}}", children: [{ text: "{{item.shortcut}}" }] } }
            ] } }
          ] }
        ] }
      ]
    },
    styles: {
      base: "relative inline-block",
      triggerWrapper: "",
      menu: "absolute z-50 min-w-[14rem] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg",
      side: { bottom: "top-full mt-1", top: "bottom-full mb-1", left: "right-full mr-1", right: "left-full ml-1" },
      align: { start: "left-0", center: "left-1/2 -translate-x-1/2", end: "right-0" },
      item: "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors",
      disabled: "pointer-events-none opacity-50",
      icon: "flex h-4 w-4 items-center justify-center text-gray-500",
      label: "flex-1 text-left",
      shortcut: "ml-auto text-xs text-gray-400",
      divider: "my-1 h-px bg-gray-200"
    },
    accessibility: {
      role: "menu",
      ariaAttributes: { "aria-label": "{{props.label}}", "aria-orientation": "vertical" },
      keyboardInteractions: ["Arrow Up/Down: Navigate through menu items", "Enter/Space: Select menu item", "Escape: Close the menu", "Tab: Close the menu and move focus"]
    }
  }
};
function getComponent(name) {
  const raw = COMPONENT_REGISTRY[name];
  if (!raw) {
    return err(
      new ValidationError(`Component "${name}" not found in registry`, [
        { path: "name", message: `Unknown component: ${name}`, code: "not_found" }
      ])
    );
  }
  const result = validateComponentIR(raw);
  if (isOk(result)) {
    return ok(result.data);
  }
  return result;
}
function listComponents() {
  return Object.values(COMPONENT_REGISTRY).map((raw) => {
    const data = raw;
    return {
      name: data["name"] ?? "unknown",
      version: data["version"] ?? "0.0.0",
      description: data["description"] ?? "",
      category: data["category"] ?? "utility"
    };
  });
}

// ../../node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// ../../node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// ../../node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// ../../node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// ../../node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// ../../node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// ../../node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// ../../node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err3) {
        if (err3?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") ; else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// src/config.ts
var CONFIG_FILENAME = "awesomeui.config.json";
var ConfigSchema = external_exports.object({
  /** Target framework */
  framework: external_exports.enum(["react", "vue", "svelte", "angular", "solid", "angularjs", "react-native"]),
  /** Style adapter */
  style: external_exports.enum(["tailwind", "css", "css-in-js", "panda"]).default("tailwind"),
  /** Output directory for generated components */
  outputDir: external_exports.string().default("./src/components/ui"),
  /** TypeScript enabled */
  typescript: external_exports.boolean().default(true),
  /** List of installed component names */
  components: external_exports.array(external_exports.string()).default([])
});
var DEFAULT_CONFIG = {
  framework: "react",
  style: "tailwind",
  outputDir: "./src/components/ui",
  typescript: true,
  components: []
};
async function readConfig(cwd) {
  const configPath = join(cwd, CONFIG_FILENAME);
  try {
    const content = await readFile(configPath, "utf-8");
    const parsed = JSON.parse(content);
    const result = ConfigSchema.safeParse(parsed);
    if (result.success) {
      return ok(result.data);
    }
    return err(
      new ValidationError("Invalid awesomeui.config.json", result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code
      })))
    );
  } catch {
    return ok(DEFAULT_CONFIG);
  }
}
async function writeConfig(cwd, config) {
  const configPath = join(cwd, CONFIG_FILENAME);
  await writeFile(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
}
function getDefaultConfig() {
  return { ...DEFAULT_CONFIG };
}

// src/commands/add.ts
function createAddCommand() {
  const cmd = new Command("add").description("Add a component to your project").argument("<component>", "Component name (e.g., button, badge, input)").option("-f, --framework <framework>", "Target framework (react, vue)", "").option("-o, --output <dir>", "Output directory", "").option("-s, --style <style>", "Style adapter (tailwind, css)", "tailwind").action(async (componentName, options) => {
    const spinner = ora();
    try {
      const cwd = process.cwd();
      const configResult = await readConfig(cwd);
      const config = isOk(configResult) ? configResult.data : null;
      const framework = options["framework"] || config?.framework || "";
      if (!framework) {
        console.error(
          chalk3.red("\u2717 No framework specified. Use --framework or run `awesomeui init` first.")
        );
        process.exit(1);
      }
      const outputDir = options["output"] || config?.outputDir || "./src/components/ui";
      const resolvedOutput = resolve(cwd, outputDir);
      spinner.start(`Loading component ${chalk3.cyan(componentName)}...`);
      const componentResult = getComponent(componentName);
      if (!isOk(componentResult)) {
        spinner.fail(chalk3.red(`Component "${componentName}" not found`));
        console.error(chalk3.gray(componentResult.error.formatErrors()));
        process.exit(1);
      }
      const ir = componentResult.data;
      spinner.succeed(`Loaded ${chalk3.cyan(ir.name)} v${ir.version}`);
      spinner.start(`Transpiling to ${chalk3.yellow(framework)}...`);
      const transpiler = createTranspiler(framework);
      if (!transpiler) {
        spinner.fail(chalk3.red(`Unsupported framework: ${framework}`));
        console.error(chalk3.gray(`Supported: react, vue, angularjs, react-native, svelte, solid`));
        process.exit(1);
      }
      const transpileResult = transpiler.transpile(ir, {
        styleAdapter: options["style"] ?? "tailwind"
      });
      if (!isOk(transpileResult)) {
        spinner.fail(chalk3.red("Transpilation failed"));
        console.error(chalk3.gray(transpileResult.error.formatErrors()));
        process.exit(1);
      }
      const output = transpileResult.data;
      spinner.succeed(`Transpiled to ${chalk3.yellow(output.framework)}`);
      spinner.start("Writing component file...");
      await mkdir(resolvedOutput, { recursive: true });
      const filePath = join(resolvedOutput, output.filename);
      await writeFile(filePath, output.code, "utf-8");
      if (config) {
        if (!config.components.includes(componentName)) {
          config.components.push(componentName);
          await writeConfig(cwd, config);
        }
      }
      spinner.succeed(chalk3.green(`\u2713 ${output.filename}`));
      console.log(chalk3.gray(`  \u2192 ${filePath}`));
      const npmDeps = ir.npmDependencies;
      if (npmDeps && npmDeps.length > 0) {
        const depsToInstall = npmDeps.filter((d) => !d.dev).map((d) => d.version ? `${d.name}@${d.version}` : d.name);
        const devDepsToInstall = npmDeps.filter((d) => d.dev).map((d) => d.version ? `${d.name}@${d.version}` : d.name);
        if (depsToInstall.length > 0) {
          spinner.start("Installing npm dependencies...");
          try {
            execSync(`npm install ${depsToInstall.join(" ")}`, { cwd, stdio: "ignore" });
            spinner.succeed(chalk3.green("Installed npm dependencies"));
          } catch {
            spinner.warn(chalk3.yellow(`Could not auto-install deps. Run: npm install ${depsToInstall.join(" ")}`));
          }
        }
        if (devDepsToInstall.length > 0) {
          spinner.start("Installing npm dev dependencies...");
          try {
            execSync(`npm install --save-dev ${devDepsToInstall.join(" ")}`, { cwd, stdio: "ignore" });
            spinner.succeed(chalk3.green("Installed npm dev dependencies"));
          } catch {
            spinner.warn(chalk3.yellow(`Could not auto-install devDeps. Run: npm install --save-dev ${devDepsToInstall.join(" ")}`));
          }
        }
      }
      console.log();
    } catch (error) {
      spinner.fail(chalk3.red("Failed to add component"));
      if (error instanceof Error) {
        console.error(chalk3.gray(error.message));
      }
      process.exit(1);
    }
  });
  return cmd;
}
function createTranspiler(framework) {
  switch (framework) {
    case "react":
      return new ReactTranspiler();
    case "vue":
      return new VueTranspiler();
    case "angularjs":
      return new AngularJSTranspiler();
    case "react-native":
      return new ReactNativeTranspiler();
    case "svelte":
      return new SvelteTranspiler();
    case "solid":
      return new SolidTranspiler();
    default:
      return null;
  }
}
function createListCommand() {
  return new Command("list").description("List all available components").action(() => {
    const components = listComponents();
    console.log();
    console.log(chalk3.bold("  Available Components"));
    console.log(chalk3.gray("  \u2500".repeat(30)));
    console.log();
    const nameWidth = 18;
    const versionWidth = 10;
    const categoryWidth = 14;
    console.log(
      chalk3.gray(
        `  ${"Name".padEnd(nameWidth)}${"Version".padEnd(versionWidth)}${"Category".padEnd(categoryWidth)}Description`
      )
    );
    console.log(chalk3.gray("  " + "\u2500".repeat(80)));
    for (const component of components) {
      const name = chalk3.cyan(component.name.padEnd(nameWidth));
      const version = chalk3.gray(component.version.padEnd(versionWidth));
      const category = chalk3.yellow(component.category.padEnd(categoryWidth));
      const desc = component.description;
      console.log(`  ${name}${version}${category}${desc}`);
    }
    console.log();
    console.log(chalk3.gray(`  ${components.length} component(s) available`));
    console.log(chalk3.gray(`  Run ${chalk3.white("awesomeui add <name> --framework <react|vue>")} to add a component`));
    console.log();
  });
}
var UTILS_TS = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
var UTILS_JS = `import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
`;
function createInitCommand() {
  return new Command("init").description("Initialize AwesomeUI configuration in your project").option("-f, --framework <framework>", "Target framework (react, vue)", "react").option("-s, --style <style>", "Style adapter (tailwind, css, css-in-js, panda)", "tailwind").option("-o, --output <dir>", "Output directory for components", "./src/components/ui").option("--no-typescript", "Generate JavaScript instead of TypeScript").action(async (options) => {
    const cwd = process.cwd();
    const config = {
      ...getDefaultConfig(),
      framework: options["framework"] ?? "react",
      style: options["style"] ?? "tailwind",
      outputDir: options["output"] ?? "./src/components/ui",
      typescript: options["typescript"] !== false
    };
    try {
      await writeConfig(cwd, config);
      const isTs = config.typescript;
      const utilsDir = resolve(cwd, "src", "lib");
      const utilsFile = join(utilsDir, isTs ? "utils.ts" : "utils.js");
      await mkdir(utilsDir, { recursive: true });
      await writeFile(utilsFile, isTs ? UTILS_TS : UTILS_JS, "utf-8");
      console.log();
      console.log(chalk3.green("  \u2713 Created awesomeui.config.json"));
      console.log(chalk3.green(`  \u2713 Created ${isTs ? "src/lib/utils.ts" : "src/lib/utils.js"}`));
      console.log();
      console.log(chalk3.gray("  Configuration:"));
      console.log(`    Framework:  ${chalk3.cyan(config.framework)}`);
      console.log(`    Style:      ${chalk3.yellow(config.style)}`);
      console.log(`    Output:     ${chalk3.white(config.outputDir)}`);
      console.log(`    TypeScript: ${config.typescript ? chalk3.green("yes") : chalk3.red("no")}`);
      console.log();
      const spinner = ora("Installing clsx and tailwind-merge...").start();
      try {
        execSync("npm install clsx tailwind-merge", { cwd, stdio: "ignore" });
        spinner.succeed(chalk3.green("Installed clsx and tailwind-merge"));
      } catch {
        spinner.warn(chalk3.yellow("Could not auto-install dependencies. Run: npm install clsx tailwind-merge"));
      }
      console.log();
      console.log(chalk3.gray("  Next steps:"));
      console.log(chalk3.gray(`    1. Make sure your project has a path alias from ${chalk3.white("@")} to ${chalk3.white("./src")}`));
      console.log(chalk3.gray(`       (e.g., in tsconfig.json: ${chalk3.white('"paths": { "@/*": ["./src/*"] }')})`));
      console.log(chalk3.gray(`    2. Run ${chalk3.white("awesomeui add button")} to add your first component`));
      console.log();
    } catch (error) {
      console.error(chalk3.red("  \u2717 Failed to initialize"));
      if (error instanceof Error) {
        console.error(chalk3.gray(`    ${error.message}`));
      }
      process.exit(1);
    }
  });
}

// src/index.ts
var program = new Command().name("awesomeui").description("AwesomeUI \u2014 Cross-framework component platform").version("0.1.0");
program.addCommand(createAddCommand());
program.addCommand(createListCommand());
program.addCommand(createInitCommand());
program.parse();
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map