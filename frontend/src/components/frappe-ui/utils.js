import { dayjs, dayjsLocal } from "frappe-ui"

export function getGridTemplateColumns(columns, withCheckbox = true) {
	let checkBoxWidth = withCheckbox ? '14px ' : ''
	let columnsWidth = columns
		.map((col) => {
			let width = col.width || 1
			if (typeof width === 'number') {
				return width + 'fr'
			}
			return width
		})
		.join(' ')
	return checkBoxWidth + columnsWidth
}

export const alignmentMap = {
	left: 'justify-start',
	start: 'justify-start',
	center: 'justify-center',
	middle: 'justify-center',
	right: 'justify-end',
	end: 'justify-end',
}

function generateId() {
	return Math.random().toString(36).substring(2, 9)
}

export function useId() {
	return 'frappe-ui-' + generateId()
}


// Constant list of month labels
export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// Start of given month (0-indexed month)
export function monthStart(year, monthIndex) {
  return dayjs(`${year}-${monthIndex + 1}-01`)
}

// Build weeks grid for the calendar
export function generateWeeks(
  year,
  monthIndex,
  selected
){
  const start = monthStart(year, monthIndex).startOf('week')
  const end = monthStart(year, monthIndex).endOf('month').endOf('week')
  const days = []
  let d = start
  while (d.isBefore(end) || d.isSame(end)) {
    const inMonth = d.month() === monthIndex
    const sel = dayjs(selected)
    days.push({
      date: d,
      key: d.format('YYYY-MM-DD'),
      inMonth,
      isToday: d.isSame(dayjsLocal().format('YYYY-MM-DD'), 'day'),
      isSelected: sel.isValid() && d.isSame(sel, 'day'),
    })
    d = d.add(1, 'day')
  }
  const chunked = []
  for (let i = 0; i < days.length; i += 7) chunked.push(days.slice(i, i + 7))
  return chunked
}

export function getDateValue(date) {
  if (!date || date.toString() === 'Invalid Date') return ''

  return dayjs(date)
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0)
    .format('YYYY-MM-DD')
}