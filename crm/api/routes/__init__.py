from crm.api.routes.booking import booking_rules
from crm.api.routes.pet_service import service_rules

url_rules = []

url_rules += booking_rules
url_rules += service_rules
