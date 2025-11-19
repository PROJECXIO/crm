import frappe

from crm.api.utils.endpoints import create_doc


def create_booking():
	doctype = "CRM Lead"

	full_name = None
	first_name = None
	last_name = None
	check_in_date = None
	check_out_date = None
	message = ""
	email = None
	phone_number = None
	phone = None
	service = None

	if "full_name" in frappe.form_dict:
		full_name = frappe.form_dict["full_name"]

	if "check_in_date" in frappe.form_dict:
		check_in_date = frappe.form_dict["check_in_date"]

	if "check_out_date" in frappe.form_dict:
		check_out_date = frappe.form_dict["check_out_date"]

	if "message" in frappe.form_dict:
		message = frappe.form_dict["message"]

	if "email" in frappe.form_dict:
		email = frappe.form_dict["email"]

	if "phone_number" in frappe.form_dict:
		phone_number = frappe.form_dict["phone_number"]

	if "phone" in frappe.form_dict:
		phone = frappe.form_dict["phone"]

	if "service" in frappe.form_dict:
		service = frappe.form_dict["service"]

	if not full_name:
		full_name = "Website Lead"

	full_name = full_name.split(" ")

	if len(full_name) > 0:
		first_name = full_name[0]
		last_name = " ".join(full_name[1:])

	if check_in_date:
		message += f"\nCheck-in: {check_in_date}"

	if check_out_date:
		message += f"\nCheck-out: {check_out_date}"

	booking_data = {
		"lead_name": " ".join(full_name),
		"first_name": first_name,
		"last_name": last_name,
		"email_id": email,
		"phone": phone or phone_number,
		"source": "Website Booking",
		"service": service,
		"message": message.strip(),
	}

	create_doc(doctype, booking_data, ignore_permissions=True, ignore_links=True)
