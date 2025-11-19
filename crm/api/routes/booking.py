from werkzeug.routing import Rule

from crm.api.controllers.booking import create_booking

booking_rules = [
	Rule("/appointment/make-appointment", methods=["POST"], endpoint=create_booking),
]
