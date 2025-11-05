import type { Dayjs } from 'dayjs/esm'

// Shared type definitions for TimePicker component

export type Placement =
  | 'bottom-start'
  | 'top-start'
  | 'top-end'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end'

// Variant aligns with TextInput variants (ghost not supported there)
export type Variant = 'outline' | 'subtle'

export interface Option {
  value: string
  label: string
}

export interface ParsedTimeValid {
  valid: true
  hh24: string
  mm: string
  ss?: string
  total: number
}
export interface ParsedTimeInvalid {
  valid: false
}
export type ParsedTime = ParsedTimeValid | ParsedTimeInvalid

export interface TimePickerProps {
  value?: string
  modelValue?: string
  interval?: number
  options?: Array<{ value: string; label?: string }>
  placement?: Placement
  placeholder?: string
  variant?: Variant
  allowCustom?: boolean
  autoClose?: boolean
  use12Hour?: boolean
  disabled?: boolean
  scrollMode?: 'center' | 'start' | 'nearest'
  minTime?: string
  maxTime?: string
  size?: string
}

export type TimePickerEmits = {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'input-invalid', input: string): void
  (e: 'invalid-change', invalid: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}



// Shared props for both single date and range pickers
export interface CommonDatePickerProps {
  placement?: DatePickerPlacement
  format?: string
  variant?: 'subtle' | 'ghost' | 'outline'
  readonly?: boolean
  placeholder?: string
  inputClass?: string | Array<string> | Record<string, boolean>
  allowCustom?: boolean
  autoClose?: boolean
  disabled?: boolean
  label?: string
  clearable?: boolean
  size?: string
}

export interface DatePickerProps extends CommonDatePickerProps {
  value?: string
  modelValue?: string
}

export interface DateRangePickerProps extends CommonDatePickerProps {
  value?: string | string[]
  modelValue?: string | string[]
}

export type DatePickerEmits = {
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}

export type DatePickerPlacement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end'

export type DatePickerViewMode = 'date' | 'month' | 'year'

export interface DatePickerDateObj {
  date: Dayjs
  key: string
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
}
