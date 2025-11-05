import frappe
from frappe import _
from frappe.apps import get_route


@frappe.whitelist()
def get_apps():
	from frappe.desk.desktop import get_workspace_sidebar_items

	allowed_workspaces = get_workspace_sidebar_items().get("pages")

	apps = frappe.get_installed_apps()
	app_list = []

	for app in apps:
		if app == "frappe":
			continue

		app_details = frappe.get_hooks("add_to_apps_screen", app_name=app)

		if not len(app_details):
			continue

		for app_detail in app_details:
			try:
				has_permission_path = app_detail.get("has_permission")
				if has_permission_path and not frappe.get_attr(has_permission_path)():
					continue

				logo = app_detail.get("logo")
				title = _(app_detail.get("title"))
				if app == "erpnext":
					logo = "/assets/revenyu/images/revenyu-desk.svg"
					title = _("Revenyu Desk")
				if app == "press":
					logo = "/assets/revenyu/images/revenyu-cloud.svg"
					title = _("Revenyu Cloud")
				if app == "hrms":
					logo = "/assets/revenyu/images/revenyu-hrms.svg"
					title = _("Revenyu HR")

				app_list.append(
					{
						"name": app,
						"logo": logo,
						"title": title,
						"route": get_route(app),
					}
				)
			except Exception:
				frappe.log_error(f"Failed to call has_permission hook ({has_permission_path}) for {app}")

	return app_list
