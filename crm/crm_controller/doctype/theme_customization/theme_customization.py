# Copyright (c) 2025, Projecx.io Team and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ThemeCustomization(Document):
	def validate(self):
		self.set_default_values()

	def set_default_values(self):
		"""set white colors as default for colors fields"""
		fields = self.meta.get("fields")
		fields = [field for field in fields if field.fieldtype == "Color"]
		for f in fields:
			if self.get(f.fieldname):
				continue

			self.set(f.fieldname, "#ffffff")
