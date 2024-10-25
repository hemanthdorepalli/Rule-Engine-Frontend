# Rule Engine Frontend

Welcome to the Rule Engine Frontend! This React application allows users to create, manage, combine, and evaluate rules based on specific criteria. It communicates with a backend API to perform CRUD operations on rules and evaluate them against given data.

## Features

- **Create New Rule**: Users can define rules in a specific format.
- **Manage Existing Rules**: List, combine, and delete existing rules.
- **Evaluate Rules**: Input specific criteria (e.g., age, salary) and check if they match the defined rules.
- **Error Handling**: User-friendly error messages for rule creation and evaluation.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hemanthdorepalli/Rule-Engine-Frontend.git


The frontend interacts with a backend API hosted at https://ats-ruleengine-backend.onrender.com/api/rules. The following API endpoints are used:

GET /api/rules: Fetch all rules.
POST /api/rules: Create a new rule.
POST /api/rules/combine: Combine selected rules.
DELETE /api/rules/:id: Delete a specific rule.
POST /api/rules/evaluate: Evaluate rules based on input data.